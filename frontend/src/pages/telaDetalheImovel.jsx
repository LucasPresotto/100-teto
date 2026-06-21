import { useEffect, useState } from "react";
import Layout from "../components/layout";
import CardImovel from "../components/cardImovel";
import { listarImoveis } from "../Services/Api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { buscarImovel, solicitarImovel } from "../Services/Api";
export default function TelaDetalhesImovel() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [imovel, setImovel] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarImoveis() {
            try {
                const dados = await buscarImovel(id);
                setImovel(dados);
                setCarregando(false);
            } catch (err) {
                console.error("Erro ao carregar imóveis:", err);
                setCarregando(false);
            }
        }
        carregarImoveis();
    }, [id]);

    if (carregando) {
        return (
            <Layout>
                <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            </Layout>
        );
    }

    if (!imovel) {

        return (
            <Layout>
                <div className="container text-center py-5">
                    <h2 className="mb-4">Imóvel não encontrado</h2>
                    <button className="btn btn-primary px-4 py-2" onClick={() => navigate("/telaInicial")}>
                        Voltar para o Início
                    </button>
                </div>
            </Layout>
        );
    }

    const fotoCapa = imovel.fotos && imovel.fotos.length > 0
        ? (imovel.fotos.find(f => f.is_principal)?.url_imagem || imovel.fotos[0].url_imagem)
        : "https://via.placeholder.com/1200x400?text=Sem+Fotografia";

    

    return (
        <Layout>

            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light"

                style={{
                    backgroundColor: '#11998e',
                    backgroundImage: 'linear-gradient(to right, #a6ccf8, #ffffff, #a6ccf8)',
                    overflowX: 'hidden'
                }}

            >


                <div className="container" style={{ marginTop: "80px", paddingBottom: "60px" }}>
                    <div className="card shadow-lg border-2 rounded-4 p-4 p-md-5" style={{ marginTop: "50px" }}>
                        <div className=" d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                            <img
                                src={fotoCapa}
                                className="img-fluid rounded-3 shadow-sm w-50"
                                alt={imovel.titulo}
                                style={{
                                    height: "250px",
                                    objectFit: "cover",
                                }}
                            ></img>
                            <div className="card-body d-flex flex-column justify-content-center align-items-start mt-4 mt-md-0">
                                <span className="badge bg-secondary mb-2 text-uppercase px-3 py-2">{imovel.tipo}</span>
                                <h1 className="fw-bold mb-1">{imovel.titulo}</h1>
                                <p className="text-muted fs-5 mb-0"> {imovel.cidade} - CEP: {imovel.cep}</p>
                            </div>
                            <div className="text-md-end mt-3 mt-md-0">
                                <h2 className="text-success fw-bold mb-0">R$ {imovel.preco_aluguel.toFixed(2)}</h2>
                                <small className="text-muted">Por mês</small>
                            </div>
                        </div>

                        <hr className="mb-4" />

                        <div className="row mb-5 text-center">
                            <div className="col-4">
                                <h3 className="fw-bold text-primary">{imovel.quartos}</h3>
                                <span className="text-muted">Quartos</span>
                            </div>
                            <div className="col-4 border-start border-end">
                                <h3 className="fw-bold text-primary">{imovel.banheiros}</h3>
                                <span className="text-muted">Banheiros</span>
                            </div>
                            <div className="col-4">
                                <h3 className="fw-bold text-primary">{imovel.area_m2 || "--"}</h3>
                                <span className="text-muted">Área (m²)</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-7 mb-4">
                                <h4 className="fw-bold mb-3">Sobre o imóvel</h4>
                                <p className="text-muted" style={{ whiteSpace: "pre-line", lineHeight: "1.8" }}>
                                    {imovel.descricao || "O locador não forneceu uma descrição detalhada para este imóvel."}
                                </p>

                                <h4 className="fw-bold mt-5 mb-3">Comodidades Inclusas</h4>
                                <div className="d-flex flex-wrap gap-2">
                                    {imovel.comodidades && imovel.comodidades.length > 0 ? (
                                        imovel.comodidades.map(comodidade => (
                                            <span key={comodidade.id} className="badge bg-light text-dark border p-2 px-3 fs-6 rounded-pill">
                                                ✅ {comodidade.nome}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted fst-italic">Nenhuma comodidade especificada.</span>
                                    )}
                                </div>
                            </div>

                            <div className="col-lg-5">
                                <div className="bg-light p-4 rounded-4 border">
                                    <h5 className="fw-bold mb-3">Galeria de Fotos</h5>
                                    <div className="row g-2">
                                        {imovel.fotos && imovel.fotos.length > 0 ? (
                                            imovel.fotos.map((foto, index) => (
                                                <div className="col-6" key={foto.id}>
                                                    <img
                                                        src={foto.url_imagem}
                                                        alt={`Foto ${index}`}
                                                        className="img-fluid rounded-3 shadow-sm w-100"
                                                        style={{ height: "130px", objectFit: "cover" }}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted small w-100 text-center py-3">
                                                Nenhuma fotografia cadastrada para a galeria.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4">
                                <button className="btn btn-primary w-100 py-3" onClick={() => solicitarImovel(imovel.id)} style={{ backgroundColor: '#05172c', borderColor: '#05172c' }}>
                                    Solicitar imovel!
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </Layout>
    );
}