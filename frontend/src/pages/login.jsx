import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../imagens/Logo100TETO.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { login } from "../Services/Api.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const usuario = await login(
        email,
        senha
      );

      navigate("/telaInicial");

    } catch (err) {
      setErro(err.message);
      if (senha.length < 6) setErro("A senha deve ter 6 digitos!!");
      console.error(err);
    }
  }

  return (


    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center p-0"
      style={{
        backgroundColor: '#11998e',
        backgroundImage: 'linear-gradient(to right, #a6ccf8, #ffffff, #a6ccf8)',
        overflowX: 'hidden'
      }}
    >
      <div
        className="card shadow p-4"
        style={{ marginTop: "20px", width: "100%", maxWidth: "400px" }}
      >
        <img
          src={logo}
          alt="Logo"
          className="mx-auto d-block mb-4"
          style={{ width: "300px" }}
        />
        <h2 className="text-center mb-4">Login</h2>

        {erro && (
          <div className="container mt-5">
            <div className="alert alert-danger" role="alert">
              {erro}
            </div>
          </div>
        )}


        <form>
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

          <div className="d-grid">
            <button className="btn btn-primary" type="button" onClick={handleLogin}>
              Entrar
            </button>
          </div>
          <div className="text-center mt-3">
            <p>
              Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
