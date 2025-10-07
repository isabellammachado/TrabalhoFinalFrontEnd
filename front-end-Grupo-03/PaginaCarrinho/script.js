let carrinho = [];

// Carregar carrinho salvo no localStorage
document.addEventListener('DOMContentLoaded', () => {
  const carrinhoSalvo = localStorage.getItem('carrinho');
  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo).map(item => ({
      ...item,
      foto: item.foto,
      quantidade: item.quantidade || 1
    }));
  }

  renderizarCarrinho();
  atualizarResumo();
});

// Renderiza os produtos na tabela
function renderizarCarrinho() {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  carrinho.forEach((item, index) => {
    const tr = document.createElement('tr');
  tr.innerHTML = `
  <td class="info-produto">
    <img src="${item.foto}" alt="Produto" style="width:50px;height:50px;border-radius:5px;">
    <div>
      <p class="nome-produto">${item.nome}</p>
      <span class="cor-produto">---</span>
    </div>
  </td>
  <td>R$${item.preco.toFixed(2)}</td>
  <td>
    <button class="botao-quantidade" onclick="alterarQuantidade(${index}, -1)">-</button>
    <span>${item.quantidade}</span>
    <button class="botao-quantidade" onclick="alterarQuantidade(${index}, 1)">+</button>
  </td>
  <td>R$${(item.preco * item.quantidade).toFixed(2)}</td>
  <td><button class="botao-remover" onclick="removerItem(${index})">x</button></td>
`;
    tbody.appendChild(tr);
  });

  atualizarResumo();
  salvarCarrinho();
}

// Altera a quantidade de um item
function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) {
    removerItem(index);
  } else {
    salvarCarrinho();
    renderizarCarrinho();
  }
}

// Remove um item do carrinho
function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  renderizarCarrinho();
}

// Salva no localStorage
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Atualiza o resumo (subtotal e total)
function atualizarResumo() {
  const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  document.querySelector('.resumo-compra .linha-resumo span:last-child').textContent = `R$${subtotal.toFixed(2)}`;
  document.querySelector('.resumo-compra .total span:last-child').textContent = `R$${subtotal.toFixed(2)}`;

  const botaoQuantidade = document.querySelector('.botao-carrinho');
  if (botaoQuantidade) {
    botaoQuantidade.textContent = `Itens: ${carrinho.length}`;
  }
}
