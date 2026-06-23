import { useEffect, useState } from "react";
import Layout from "../components/layout";
import CardImovel from "../components/cardImovel";
import { listarImoveis } from "../Services/Api";
import { useNavigate } from "react-router-dom";

export default function TelaListarImoveis() {

    const [imoveis, setImoveis] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState ({
        buscaGeral: "",
        tipo: "",
        precoMax: "",
        quartosMin: ""
    });

    useEffect(() => {
        async function carregarImoveis() {
            try {
                const dados = await listarImoveis();
                setImoveis(dados);
            } catch (err) {
                console.error("Erro ao carregar imóveis:", err);
            } finally {
                setCarregando(false);
            }
        }
        carregarImoveis();
    }, []);

    const handleFiltroChange = (e) => {
        setFiltros({...filtros, [e.target.name]: e.target.value});
    };

    const limparFiltros = () => {
        setFiltros({ buscaGeral: "", tipo: "", precoMax: "", quartosMin: "" });
    };

    const imoveisFiltrados = imoveis.filter((imovel) => {
        const termoBusca = filtros.buscaGeral.toLowerCase();
        const matchBusca = 
            imovel.titulo.toLowerCase().includes(termoBusca) || 
            imovel.cidade.toLowerCase().includes(termoBusca);
        const matchTipo = filtros.tipo === "" || imovel.tipo === filtros.tipo;
        const matchPreco = filtros.precoMax === "" || imovel.preco_aluguel <= parseFloat(filtros.precoMax);
        const matchQuartos = filtros.quartosMin === "" || imovel.quartos >= parseInt(filtros.quartosMin);
        return matchBusca && matchTipo && matchPreco && matchQuartos;
    });

    return (
        <Layout>

            <div className="container-fluid vh-100"

                style={{
                    backgroundColor: '#11998e',
                    backgroundImage: 'linear-gradient(to right, #a6ccf8, #ffffff, #a6ccf8)',
                    overflowX: 'hidden'
                }}

            >

                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4 p-4">
                        <button 
                            className="btn btn-primary shadow-sm fw-bold "
                            onClick={() => navigate("/telaCadastroImovel")}
                        >
                            + Anunciar Imóvel
                        </button>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4 mb-4 p-3 p-md-4 bg-white">
                        <h5 className="fw-bold" style={{ color: "#05172c" }}>Explorar Imóveis</h5>
                        <div className="row g-3">
                            <div className="col-12 col-md-4">
                                <label className="form-label small fw-bold text-muted mb-1">Cidade ou Título</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ex: Florianópolis, Centro..." 
                                    name="buscaGeral"
                                    value={filtros.buscaGeral}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            <div className="col-6 col-md-2">
                                <label className="form-label small fw-bold text-muted mb-1">Tipo</label>
                                <select 
                                    className="form-select" 
                                    name="tipo"
                                    value={filtros.tipo}
                                    onChange={handleFiltroChange}
                                >
                                    <option value="">Todos</option>
                                    <option value="casa">Casa</option>
                                    <option value="apartamento">Apartamento</option>
                                    <option value="republica">República</option>
                                </select>
                            </div>

                            <div className="col-6 col-md-3">
                                <label className="form-label small fw-bold text-muted mb-1">Preço Máximo (R$)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="Ex: 2000" 
                                    name="precoMax"
                                    value={filtros.precoMax}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            <div className="col-12 col-md-2">
                                <label className="form-label small fw-bold text-muted mb-1">Quartos (Mín)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="Ex: 2" 
                                    name="quartosMin"
                                    value={filtros.quartosMin}
                                    onChange={handleFiltroChange}
                                />
                            </div>

                            <div className="col-12 col-md-1 d-flex align-items-end">
                                <button 
                                    className="btn btn-outline-danger w-100" 
                                    onClick={limparFiltros}
                                    title="Limpar todos os filtros"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    </div>

                    {carregando ? (
                        <div className="text-center mt-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="mt-2 fw-bold text-dark">A procurar imóveis...</p>
                        </div>
                    ) : imoveisFiltrados.length === 0 ? (
                        <div className="alert alert-light text-center shadow-sm py-5 rounded-4">
                            <h4 className="fw-bold text-muted mb-3">Nenhum imóvel encontrado</h4>
                            <p className="mb-4">Tente remover alguns filtros para ver mais resultados.</p>
                            <button className="btn btn-primary px-4" onClick={limparFiltros}>
                                Ver todos os imóveis
                            </button>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {imoveisFiltrados.map((imovel) => (
                                <div key={imovel.id} className="col-12 col-md-6 col-lg-4">
                                    <CardImovel imovel={imovel} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </Layout>
    );
}