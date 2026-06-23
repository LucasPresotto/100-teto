
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import CardImovel from "../components/cardImovel";
import { listarSolicitacoes, listarSolicitacoesRecebidas, responderSolicitacao} from "../Services/Api";
import { useNavigate } from "react-router-dom";

export default function TelaListarSolicitacoes() {

    const [enviadas, setEnviadas] = useState([]);
    const [recebidas, setRecebidas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [abaAtiva, setAbaAtiva] = useState("enviadas");
    const navigate = useNavigate();

    const carregarDados = async () => {
        setCarregando(true);
        try{
            const dadosEnviados = await listarSolicitacoes();
            setEnviadas(dadosEnviados);

            const dadosRecebidos = await listarSolicitacoesRecebidas();
            setRecebidas(dadosRecebidos);
        } catch(err){
            console.error("Erro ao carregar dados: ", err);
        } finally{
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    const handleResponder = async (imovel_id, usuario_id, acao) => {
        if (!window.confirm(`Tem a certeza que deseja ${acao} esta solicitação?`)) return;
        
        try {
            const resposta = await responderSolicitacao(imovel_id, usuario_id, acao);
            alert(resposta.mensagem);
            carregarDados();
        } catch (err) {
            alert(err.message);
        }
    }

    if (carregando) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container-fluid min-vh-100 py-5 bg-light">
                <div className="container">
                    <h2 className="fw-bold mb-4" style={{ color: "#000000" }}>Painel de Solicitações</h2>

                    <div className="btn-group w-100 mb-4 shadow-sm">
                        <button 
                            className={`btn btn-lg ${abaAtiva === "enviadas" ? "btn-primary active" : "btn-outline-primary"}`}
                            onClick={() => setAbaAtiva("enviadas")}
                        >
                            Casas que eu solicitei
                        </button>
                        <button 
                            className={`btn btn-lg ${abaAtiva === "recebidas" ? "btn-primary active" : "btn-outline-primary"}`}
                            onClick={() => setAbaAtiva("recebidas")}
                        >
                            Interessados nos meus Imóveis
                            {recebidas.filter(r => r.status === "Pendente").length > 0 && (
                                <span className="badge bg-danger ms-2">Novo</span>
                            )}
                        </button>
                    </div>

                    {abaAtiva === "enviadas" && (
                        <div className="row g-4">
                            {enviadas.length === 0 ? (
                                <div className="alert alert-info text-center">Você ainda não enviou nenhuma solicitação.</div>
                            ) : (
                                enviadas.map((req, index) => (
                                    <div key={index} className="col-md-6 col-lg-4">
                                        <div className="card h-100 shadow-sm border-0 rounded-4">
                                            {req.fotos && req.fotos.length > 0 && (
                                                <img src={req.fotos[0].url_imagem} alt="Imóvel" className="card-img-top" style={{ height: "180px", objectFit: "cover" }} />
                                            )}
                                            <div className="card-body">
                                                <h5 className="fw-bold text-truncate">{req.titulo}</h5>
                                                <p className="text-muted small mb-2">📍 {req.cidade}</p>
                                                <h5 className="text-success mb-3">R$ {req.preco_aluguel.toFixed(2)}</h5>
                                                
                                                <div className={`alert p-2 text-center mb-0 ${req.status_solicitacao === "Pendente" ? "alert-warning" : "alert-success"}`}>
                                                    <strong>Status:</strong> {req.status_solicitacao}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {abaAtiva === "recebidas" && (
                        <div className="row g-4">
                            {recebidas.length === 0 ? (
                                <div className="alert alert-info text-center">Nenhum inquilino solicitou os seus imóveis ainda.</div>
                            ) : (
                                recebidas.map((req, index) => (
                                    <div key={index} className="col-12">
                                        <div className="card shadow-sm border-0 rounded-4 p-3">
                                            <div className="row align-items-center">
                                                <div className="col-md-5">
                                                    <h5 className="fw-bold mb-1">{req.imovel_titulo}</h5>
                                                    <div className={`badge ${req.status === "Pendente" ? "bg-warning text-dark" : "bg-success"} mb-2`}>
                                                        {req.status}
                                                    </div>
                                                </div>
                                                <div className="col-md-4 border-start">
                                                    <p className="mb-1 small"><strong>Inquilino:</strong> {req.usuario_nome}</p>
                                                    <p className="mb-1 small text-muted">{req.usuario_email}</p>
                                                    <p className="mb-0 small text-muted">{req.usuario_telefone}</p>
                                                </div>
                                                <div className="col-md-3 text-end mt-3 mt-md-0">
                                                    {req.status === "Pendente" ? (
                                                        <div className="d-grid gap-2">
                                                            <button className="btn btn-success btn-sm" onClick={() => handleResponder(req.imovel_id, req.usuario_id, "aceitar")}>
                                                                Aceitar 
                                                            </button>
                                                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleResponder(req.imovel_id, req.usuario_id, "rejeitar")}>
                                                                Rejeitar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button className="btn btn-secondary btn-sm w-100" disabled>
                                                            Negócio Fechado
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
}