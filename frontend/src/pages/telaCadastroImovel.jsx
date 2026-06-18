import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout";

export default function CadastroImovel() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "casa",
    preco_aluguel: "",
    area_m2: "",
    quartos: "",
    banheiros: "",
    cep: "",
    cidade: "",
    descricao: ""
  });

  const [status, setStatus] = useState({ mensagem: "", tipo: "" });
  const [comodidadesDisponiveis, setComodidadesDisponiveis] = useState([]);
  const [comodidadesSelecionadas, setComodidadesSelecionadas] = useState([]);
  const [fotos, setFotos] = useState([""]);
 
  useEffect(() => {
    fetch("http://localhost:8000/comodidades")
      .then(res => res.json())
      .then(data => setComodidadesDisponiveis(data))
      .catch(err => console.error("Erro ao buscar comodidades:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleComodidadeToggle = (id) => {
    if (comodidadesSelecionadas.includes(id)) {
      setComodidadesSelecionadas(comodidadesSelecionadas.filter(cId => cId !== id));
    } else {
      setComodidadesSelecionadas([...comodidadesSelecionadas, id]);
    }
  };

  const handleFotoChange = (e) => {
    setFotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ mensagem: "A carregar...", tipo: "info" });

    const token = localStorage.getItem("token");

    if (!token) {
      setStatus({ mensagem: "Acesso negado. Faça login para cadastrar um imóvel.", tipo: "danger" });
      return;
    }

    const payload = new FormData();
    payload.append("titulo", formData.titulo);
    payload.append("tipo", formData.tipo);
    payload.append("preco_aluguel", formData.preco_aluguel);
    if (formData.area_m2) payload.append("area_m2", formData.area_m2);
    if (formData.quartos) payload.append("quartos", formData.quartos);
    if (formData.banheiros) payload.append("banheiros", formData.banheiros);
    payload.append("cep", formData.cep);
    payload.append("cidade", formData.cidade);
    if (formData.descricao) payload.append("descricao", formData.descricao);

    payload.append("comodidades", JSON.stringify(comodidadesSelecionadas));

    fotos.forEach((foto) => {
      payload.append("fotos", foto);
    });

    try {
      const response = await fetch("http://localhost:8000/imoveis", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` 
        },
        body: payload
      });

      if (response.ok) {
        setStatus({ mensagem: "Imóvel cadastrado com sucesso!", tipo: "success" });
        
        setFormData({ titulo: "", tipo: "casa", preco_aluguel: "", cep: "", cidade: "", descricao: "" });
        
        setTimeout(() => navigate("/telaInicial"), 2000);
      } else {
        const erro = await response.json();
        setStatus({ mensagem: `Erro: ${erro.detail || "Falha ao cadastrar"}`, tipo: "danger" });
      }
    } catch (error) {
      setStatus({ mensagem: "Erro de conexão com o servidor.", tipo: "danger" });
      console.error(error);
    }
  };

  return (
    <Layout>
    <div 
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center p-4"
      style={{
        backgroundColor: '#11998e',
        backgroundImage: 'linear-gradient(to right, #a6ccf8, #ffffff, #a6ccf8)',
        overflowX: 'hidden'
      }}
    >
      <div className="card shadow p-4" style={{ width: "100%", maxWidth: "600px" }}>
        <h2 className="text-center mb-4" style={{ color: "#333" }}>Anunciar Novo Imóvel</h2>

        {status.mensagem && (
          <div className={`alert alert-${status.tipo} text-center`} role="alert">
            {status.mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <h5 className="text-primary mt-3 border-bottom pb-2">1. Dados Básicos</h5>
          <div className="mb-3">
            <label className="form-label fw-bold">Título do Anúncio</label>
            <input type="text" name="titulo" className="form-control" value={formData.titulo} onChange={handleChange} required />
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Tipo</label>
              <select name="tipo" className="form-select" value={formData.tipo} onChange={handleChange}>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="republica">República</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Preço Mensal (R$)</label>
              <input type="number" step="0.01" name="preco_aluguel" className="form-control" value={formData.preco_aluguel} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Área (m²)</label>
              <input type="number" name="area_m2" className="form-control" value={formData.area_m2} onChange={handleChange} />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Quartos</label>
              <input type="number" name="quartos" className="form-control" value={formData.quartos} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Banheiros</label>
              <input type="number" name="banheiros" className="form-control" value={formData.banheiros} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">CEP</label>
              <input type="text" name="cep" className="form-control" value={formData.cep} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Cidade</label>
            <input type="text" name="cidade" className="form-control" value={formData.cidade} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Descrição</label>
            <textarea name="descricao" className="form-control" rows="3" value={formData.descricao} onChange={handleChange}></textarea>
          </div>

          <h5 className="text-primary mt-4 border-bottom pb-2">2. Comodidades</h5>
          <div className="row mb-4">
            {comodidadesDisponiveis.map((comodidade) => (
              <div key={comodidade.id} className="col-md-4 col-sm-6 mb-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`comodidade-${comodidade.id}`}
                    checked={comodidadesSelecionadas.includes(comodidade.id)}
                    onChange={() => handleComodidadeToggle(comodidade.id)}
                  />
                  <label className="form-check-label" htmlFor={`comodidade-${comodidade.id}`}>
                    {comodidade.nome}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <h5 className="text-primary mt-4 border-bottom pb-2">3. Fotos do Imóvel</h5>
          <p className="text-muted small">Selecione as imagens do seu computador. Pode selecionar vários ficheiros de uma vez (a primeira será a foto de capa).</p>
          
          <div className="mb-4">
            <input 
              type="file" 
              className="form-control" 
              multiple 
              accept="image/*"
              onChange={handleFotoChange} 
            />
            {fotos.length > 0 && (
              <div className="mt-2 small text-success fw-bold">
                {fotos.length} foto(s) pronta(s) para upload.
              </div>
            )}
          </div>
          <div className="d-grid gap-2 mt-4">
            <button className="btn btn-primary btn-lg" type="submit">
              Publicar Anúncio
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/telaInicial")}>
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
    </Layout>
  );
}