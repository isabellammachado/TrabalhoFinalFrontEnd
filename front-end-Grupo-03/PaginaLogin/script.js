
const API = {
    async getUsers() {
        const response = await fetch("https://68e03ed893207c4b47940ef3.mockapi.io/Api-trabalhoFrontEnd");
        if (!response.ok) throw new Error("Erro ao buscar usuários");
        return response.json();
    }
};

const CHECKOUT = "../PaginaCheckout/index.html";

async function autenticarUsuario(usuarioDigitado, senhaDigitada) {
    try {
        const usuarios = await API.getUsers();

        const usuarioAutenticado = usuarios.find(user => {
            const nomeOuEmailCorreto =
                user.Nome?.toLowerCase() === usuarioDigitado.toLowerCase() ||
                user.Email?.toLowerCase() === usuarioDigitado.toLowerCase();
            const senhaCorreta = user.Senha === senhaDigitada;
            return nomeOuEmailCorreto && senhaCorreta;
        });

        if (usuarioAutenticado) {
            alert(`Login realizado com sucesso! Bem-vindo(a), ${usuarioAutenticado.Nome}.`);
            window.location.href = "../PaginaCheckout/index.html";
        } else {
            throw new Error('Usuário ou senha incorretos. Tente novamente.');
        }

    } catch (error) {
        alert(error.message);
        console.error('Erro no Login:', error);
    }
}

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuarioInput = document.getElementById('usuario');
    const senhaInput = document.getElementById('senha');
    const erroUsuario = document.getElementById('erro-usuario');
    const erroSenha = document.getElementById('erro-senha');
    const btnLogin = document.querySelector('.btn-login');

    let isValid = true;
    erroUsuario.textContent = '';
    erroSenha.textContent = '';

    if (usuarioInput.value.trim() === '') {
        erroUsuario.textContent = 'Por favor, insira seu usuário ou e-mail.';
        isValid = false;
    }

    if (senhaInput.value.trim() === '') {
        erroSenha.textContent = 'Por favor, insira sua senha.';
        isValid = false;
    }

    if (!isValid) return;

    btnLogin.disabled = true;
    btnLogin.textContent = 'Entrando...';

    await autenticarUsuario(usuarioInput.value.trim(), senhaInput.value.trim());

    btnLogin.disabled = false;
    btnLogin.textContent = 'Entrar';
});
