import { useEffect, useState } from "react";
import Layout from "../components/layout";
import CardImovel from "../components/cardImovel";
import { listarImoveis } from "../services/Api";
import { useNavigate } from "react-router-dom";

export default function TelaListarImoveis() {

    const [imoveis, setImoveis] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarImoveis() {
            try {
                const dados = await listarImoveis();
                setImoveis(dados);
            } catch (err) {
                console.error("Erro ao carregar imóveis:", err);
            }
        }
        carregarImoveis();
    }, []);

    return (
        <Layout>

            <div className="container-fluid vh-100"

                style={{
                    backgroundColor: '#11998e',
                    backgroundImage: 'linear-gradient(to right, #a6ccf8, #ffffff, #a6ccf8)',
                    overflowX: 'hidden'
                }}

            >

                <h2 className="text-center mb-4">
                    Imóveis disponíveis
                </h2>

                <div className="row g-4">
                    {imoveis.map((imovel) => (
                        <div
                            key={imovel.id}
                            className="col-md-4"
                        >
                            <CardImovel imovel={imovel} />
                        </div>
                    ))}
                </div>

            </div>

        </Layout>
    );
}