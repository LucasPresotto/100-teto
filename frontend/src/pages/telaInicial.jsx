import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../imagens/Logo100TETO.png"
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout.jsx";

export default function telaInicial() {
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    const animacaoTitulo = `
            @keyframes correrGradiente {
            0% { background-position: 0% 50%;}
            50% { background-position: 100% 50%;}
            100% { background-position: 0% 50%; }} 
        `;

    return (
        <Layout>
            <style>{animacaoTitulo}</style>
            <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light"

                style={{
                    backgroundColor: '#11998e',
                    backgroundImage: 'linear-gradient(to right, #a6ccf8, #ffffff, #a6ccf8)',
                    overflowX: 'hidden'
                }}

            >
                <div className="text-center">
                    <img src={logo} alt="Logo 100TETO" className="mb-4" style={{ width: '200px' }} />
                    <h1 className="mb-4" style={{
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: '700',
                        backgroundImage: 'linear-gradient(to right, #003776, #69a9f3, #137cf4, #003776)',
                        backgroundSize: '250% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                        animation: 'correrGradiente 6s linear infinite'
                    }}>
                        Bem-vindo ao 100TETO
                    </h1>
                    <p className="mb-4" style={{ color: '#05172c', fontFamily: 'Roboto, sans-serif', fontSize: '18px' }}>Aqui você pode encontrar o imóvel ideal para chamar de lar. Explore nossas opções e faça parte da nossa comunidade!</p>
                    <button className="btn btn-primary btn-lg me-2" onClick={navigate.bind(null, "/telaListarImoveis")} style={{ backgroundColor: '#05172c', borderColor: '#05172c' }}>Explorar Imóveis</button>
                    <button className="btn btn-primary btn-lg me-2" onClick={navigate.bind(null, "/telaCadastroImovel")} style={{ backgroundColor: '#05172c', borderColor: '#05172c' }}>Cadastrar Imóvel</button>
                </div>
            </div>
        </Layout >
    );
}