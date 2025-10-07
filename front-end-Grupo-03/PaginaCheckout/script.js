document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'https://68e03ed893207c4b47940ef3.mockapi.io/Api-trabalhoFrontEnd';

    const radios = document.querySelectorAll('input[name="metodoPagamento"]');
    const secaoCartao = document.getElementById('pagamento-cartao');
    const secaoPix = document.getElementById('pagamento-pix');
    const divPagamento = document.querySelector('.meioPagamento');
    const camposCartao = secaoCartao ? secaoCartao.querySelectorAll('input') : [];
    const form = document.getElementById('form-checkout');

    function atualizarMetodo() {
        const selecionado = document.querySelector('input[name="metodoPagamento"]:checked');
        const valor = selecionado ? selecionado.value : '';

        if (divPagamento) {
            divPagamento.style.display = valor ? 'block' : 'none';
        }

        const mostrarCartao = valor === 'credito' || valor === 'debito';

        if (secaoCartao) {
            secaoCartao.style.display = mostrarCartao ? 'block' : 'none';
        }

        if (secaoPix) {
            secaoPix.style.display = valor === 'pix' ? 'block' : 'none';
        }

        camposCartao.forEach(input => {
            input.required = mostrarCartao;
        });
    }

    radios.forEach(radio => {
        radio.addEventListener('change', atualizarMetodo);
    });


    atualizarMetodo();
    document.querySelector('#botaoEnviar')?.addEventListener('click', atualizarMetodo);
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const metodoPagamento = document.querySelector('input[name="metodoPagamento"]:checked')?.value;

            if (!metodoPagamento) {
                alert("Selecione um método de pagamento.");
                return;
            }

            const dados = {
                cep: form.cep.value,
                endereco: form.endereco.value,
                numero: form.numero.value,
                bairro: form.bairro.value,
                cidade: form.cidade.value,
                estado: form.estado.value,
                metodoPagamento: metodoPagamento
            };

            if (metodoPagamento === 'credito' || metodoPagamento === 'debito') {
                dados.detalhesCartao = {
                    nome: document.getElementById('nomeCartao').value,
                    numero: document.getElementById('numeroCartao').value,
                    validade: document.getElementById('validadeCartao').value,
                    cvv: document.getElementById('cvvCartao').value
                };
            }

            try {
                const resposta = await fetch(baseUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                });

                if (resposta.ok) {
                    alert("Pedido enviado com sucesso!");
                    form.reset();
                    atualizarMetodo();
                    window.location.href = '../CheckOutFinal/CompraEfetuada.html';
                } else {
                    alert("Erro ao enviar pedido. Tente novamente.");
                }
            } catch (erro) {
                console.error("Erro ao enviar:", erro);
                alert("Erro de conexão com a API.");
            }
        });
    }
});
