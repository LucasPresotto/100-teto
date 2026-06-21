import logo from "../imagens/Logo100TETO.png"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark "
            style={{
                backgroundColor: '#11998e',
                backgroundImage: 'linear-gradient(to right, #05172c, #012084, #05172c)',
                overflowX: 'hidden'
            }}>
            <div className="container">

                <a className="navbar-brand d-flex align-items-center">
                    <h2 className="mb-0"
                        style={{
                            color: '#a6ccf8',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '700'
                        }}>100TETO</h2>
                </a>    

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/telaInicial">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/telaListarSolicitacoes">Minhas Solicitações</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/telaMeusImoveis">Meus imoveis</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/">Logout</Link>
                        </li>
                    </ul>
                </div>


            </div>
        </nav >
    );
}