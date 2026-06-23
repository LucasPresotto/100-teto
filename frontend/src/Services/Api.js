import { useState } from "react";


export async function login(email, senha) {

    const response = await fetch(
        "http://localhost:8000/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha
            })
        }
    );

    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("usuario_id", data.usuario.id);
        return data;
    } else {
        const erro = await response.json();
        throw new Error(erro.detail);
    }

}

export async function cadastrarUsuario(nome, telefone, cpf, email, senha, dataCriacao) {

    const response = await fetch(
        "http://localhost:8000/cadastro",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                telefone,
                cpf,
                email,
                senha
            })
        }
    );

    if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail);
    }

    return response.json();
}


export async function listarImoveis() {

    const response = await fetch(
        "http://localhost:8000/imoveis"
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar imóveis");
    }

    return response.json();
}

export async function buscarImovel(id) {

    const response = await fetch(
        `http://localhost:8000/imoveis/${id}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar imóvel");
    }

    return response.json();
}

export async function solicitarImovel(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Você precisa estar logado para solicitar um imóvel.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:8000/solicitar_imovel/${id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.detail || "Erro ao solicitar imóvel");
        }
        alert("Solicitação enviada com sucesso!");
    } catch (err) {
        console.error("Erro ao solicitar imóvel:", err);
        alert(err.message);
    }
}

export async function listarSolicitacoes() {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Você precisa estar logado para ver suas solicitações.");
    }
    const response = await fetch(
        "http://localhost:8000/solicitacoes",
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar solicitações");
    }

    return response.json();
}

export async function listarSolicitacoesRecebidas() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Você precisa estar logado");
    
    const response = await fetch(`http://localhost:8000/solicitacoes/recebidas`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Erro ao carregar solicitações recebidas");
    return response.json();
}

export async function responderSolicitacao(imovel_id, usuario_id, acao) {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8000/solicitacoes/responder/${imovel_id}/${usuario_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ acao })
    });

    if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail || "Erro ao responder solicitação");
    }
    return response.json();
}

export async function listarMeusImoveis(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        throw new Error("Você precisa estar logado para ver suas solicitações.");
        return;
    }
    const response = await fetch(
        `http://localhost:8000/meusImoveis/${id}`,
        {
            headers: {
                Authorization: token
            }
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao carregar imóveis");
    }

    return response.json();
}
