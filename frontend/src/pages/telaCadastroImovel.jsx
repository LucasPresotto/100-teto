import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function CadastroImovel() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "casa",
    preco_aluguel: "",
    cep: "",
    cidade: "",
    descricao: ""
  });

  const [status, setStatus] = useState({ mensagem: "", tipo: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ mensagem: "A carregar...", tipo: "info" });

    const token = localStorage.getItem("token");

    if (!token) {
      setStatus({ mensagem: "Acesso negado. Faça login para cadastrar um imóvel.", tipo: "danger" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/imoveis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          titulo: formData.titulo,
          descricao: formData.descricao,
          tipo: formData.tipo,
          preco_aluguel: parseFloat(formData.preco_aluguel), 
          cep: formData.cep,
          cidade: formData.cidade
        })
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
          
          <div className="mb-3">
            <label className="form-label fw-bold">Título do Anúncio</label>
            <input
              type="text"
              name="titulo"
              className="form-control"
              placeholder="Ex: Kitnet mobiliada perto do IFSC"
              value={formData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Tipo de Imóvel</label>
              <select 
                name="tipo" 
                className="form-select" 
                value={formData.tipo} 
                onChange={handleChange}
              >
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="republica">República</option>
              </select>
            </div>
            
            <div className="col-md-6 mt-3 mt-md-0">
              <label className="form-label fw-bold">Preço Mensal (R$)</label>
              <input
                type="number"
                step="0.01"
                name="preco_aluguel"
                className="form-control"
                placeholder="Ex: 1200.00"
                value={formData.preco_aluguel}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">CEP</label>
              <input
                type="text"
                name="cep"
                className="form-control"
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-8 mt-3 mt-md-0">
              <label className="form-label fw-bold">Cidade</label>
              <input
                type="text"
                name="cidade"
                className="form-control"
                placeholder="Ex: Florianópolis"
                value={formData.cidade}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Descrição</label>
            <textarea
              name="descricao"
              className="form-control"
              rows="3"
              placeholder="Descreva os detalhes da casa..."
              value={formData.descricao}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-primary btn-lg" type="submit">
              Publicar Anúncio
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={() => navigate("/telaInicial")}
            >
              Cancelar e Voltar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}