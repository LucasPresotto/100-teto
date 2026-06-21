
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import CardImovel from "../components/cardImovel";
import { listarSolicitacoes } from "../Services/Api";
import { useNavigate } from "react-router-dom";

export default function TelaListarSolicitacoes() {

    const [solicitacoes, setSolicitacoes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function carregarSolicitacoes() {
            try {
                const dados = await listarSolicitacoes();
                setSolicitacoes(dados);
            } catch (err) {
                console.error("Erro ao carregar solicitações:", err);
            }
        }
        carregarSolicitacoes();
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
                    Suas Solicitações
                </h2>

                <div className="row g-4">
                    {solicitacoes.map((imovel) => (
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