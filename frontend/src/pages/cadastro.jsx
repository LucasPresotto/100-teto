import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../imagens/Logo100TETO.png"
import { useNavigate } from "react-router-dom";
import { cadastrarUsuario } from "../Services/Cadastrar.js";

export default function Cadastrar() {
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setErro] = useState("");
    const navigate = useNavigate();

    async function handleCadastrar(e) {
        e.preventDefault();
        setErro("");

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem");
            return;
        }

        try {
            const usuario = await cadastrarUsuario(nome, telefone, cpf, email, senha, new Date(Date.now()));

            navigate("/");
            console.log("Cadastro realizado com sucesso!");

        } catch (err) {
            setErro("Dados inseridos incorretamente");
            if (senha.length < 6) setErro("A senha deve ter 6 digitos!!");
            console.error(err);
        }
    }

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light"

            style={{
                backgroundColor: '#11998e',
                backgroundImage: 'linear-gradient(to right, #a6ccf8, #ffffff, #a6ccf8)',
                overflowX: 'hidden'
            }}

        >
            <div
                className="card shadow p-4"
                style={{ width: "100%", maxWidth: "400px" }}
            >
                <img
                    src={logo}
                    alt="Logo"
                    className="mx-auto d-block mb-4"
                    style={{ width: "300px" }}
                />
                <h2 className="text-center mb-4">Crie sua conta</h2>


                <form onSubmit={handleCadastrar}>
                    <div className="mb-3">
                        <label className="form-label">Nome</label>

                        <input
                            type="nome"
                            className="form-control"
                            placeholder="Maria/Joao"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Telefone</label>

                        <input
                            type="telefone"
                            className="form-control"
                            placeholder="(99) 9 9999-9999"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">CPF</label>

                        <input
                            type="cpf"
                            className="form-control"
                            placeholder="***.***.***-**"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>

                        <input
                            type="email"
                            className="form-control"
                            placeholder="nome@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Senha</label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="********"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirme a senha</label>

                        <input
                            type="password"
                            className="form-control"
                            placeholder="********"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                        />
                    </div>

                    <div className="d-grid">
                        <button className="btn btn-primary" type="submit" onClick={handleCadastrar}>
                            Criar Conta
                        </button>
                    </div>
                    <div className="text-center mt-3">
                    </div>
                </form>
            </div>
        </div>
    );
}