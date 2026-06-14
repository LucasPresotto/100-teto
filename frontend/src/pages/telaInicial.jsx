import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../imagens/Logo100TETO.png"
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout.jsx";

export default function telaInicial() {
    const [nome, setNome] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    async function handleTelaCadastro(e) {
        e.preventDefault();
        setErro("");

        try {
            //const res = await Cadastrar(nome, sobrenome, cpf, dataNascimento, email, senha);

            navigate("/telaCadastroImovel");

        } catch (err) {
            setErro("Dados inseridos incorretamente");
            console.error(err);
        }
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

        </div>
        </Layout>
    );
}