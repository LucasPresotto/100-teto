import { useEffect, useState } from "react";
import Layout from "../components/layout";
import CardImovel from "../components/cardImovel";
import { listarImoveis } from "../Services/Api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { buscarImovel } from "../Services/Api";
export default function TelaDetalhesImovel() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [imoveis, setImoveis] = useState(null);

    useEffect(() => {
        async function carregarImoveis() {
            try {
                const dados = await buscarImovel(id);
                setImoveis(dados);
            } catch (err) {
                console.error("Erro ao carregar imóveis:", err);
            }
        }
        carregarImoveis();
    }, [id]);

    if (!imoveis) {

        return (
            <Layout>
                <div className="container">
                    Carregando...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>

            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light"

                style={{
                    backgroundColor: '#11998e',
                    backgroundImage: 'linear-gradient(to right, #a6ccf8, #ffffff, #a6ccf8)',
                    overflowX: 'hidden'
                }}

            >
                <div className="card shadow p-4" style={{ width: "100%", maxWidth: "600px" }}>
                    <h1>{imoveis.titulo}</h1>
                    <p className="text-muted">
                        {imoveis.cidade}
                    </p>

                    <h3>
                        R${imoveis.preco_aluguel}
                    </h3>

                    <p>
                        {imoveis.descricao}
                    </p>

                    <ul>
                        <li>Quartos: {imoveis.quartos}</li>
                        <li>Banheiros: {imoveis.banheiros}</li>
                        <li>Área: {imoveis.area_m2} m²</li>
                    </ul>
                </div>
            </div>

        </Layout>
    );
}