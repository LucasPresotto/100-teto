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
    } else{
        const erro = await response.json();
        throw new Error(erro.detail);
    }

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
        `http://localhost:8000/imoveis/${id}`
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar imóvel");
    }

    return response.json();
}

