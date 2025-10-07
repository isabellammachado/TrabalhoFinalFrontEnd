const baseUrl = "https://68e03ed893207c4b47940ef3.mockapi.io/Api-trabalhoFrontEnd";

async function postUser(user) {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Erro ao cadastrar usuário");
    return response.json();
}

async function getUsers() {
    const response = await fetch(`${baseUrl}?sortBy=id&order=asc`);
    if (!response.ok) throw new Error("Erro ao buscar usuários");
    return response.json();
}

async function deleteUser(id) {
    const response = await fetch(`${baseUrl}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Erro ao excluir usuário");
    return response.json();
}

window.API = { baseUrl, postUser, getUsers, deleteUser };
