let carrinho = [];

document.addEventListener('DOMContentLoaded', function () {
  const carrinhoSalvo = localStorage.getItem('carrinho');

  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
  }

  atualizarQuantidadeCarrinho();

  const botoesComprar = document.querySelectorAll('.btn-comprar');
  botoesComprar.forEach(botao => {
    botao.addEventListener('click', function (event) {
      comprar(event, botao);
    });
  });
});

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function comprar(event, botao) {
  event.preventDefault();

  let produtoDiv = botao.closest('.produto');
  if (!produtoDiv) return;

  let nomeProduto = produtoDiv.querySelector('h4').innerText;
  let fotoProduto = produtoDiv.querySelector('img').src;
  let precoTexto = produtoDiv.querySelector('.preco').innerText;
  let preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.'));

  carrinho.push({
    nome: nomeProduto,
    preco: preco,
    foto: fotoProduto
  });

  salvarCarrinho();
  atualizarQuantidadeCarrinho();

  alert(nomeProduto + " foi adicionado ao carrinho!");
  console.log("Carrinho atual:", carrinho);
}

function atualizarQuantidadeCarrinho() {
  const spanQuantidade = document.getElementById('quantidade-carrinho');
  if (spanQuantidade) {
    spanQuantidade.textContent = carrinho.length;
  }
}
