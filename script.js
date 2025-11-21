/* ------------------------------------
   CONFIGURAÇÃO DA API
------------------------------------ */
const BASE_URL = 'http://localhost:8080';

/* ------------------------------------
   FUNÇÕES DA API
------------------------------------ */

// Criar produto
async function criarProduto(nome, descricao, imagens, preco) {
  try {
    const response = await fetch(`${BASE_URL}/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nome,
        description: descricao,
        images: imagens,
        price: preco
      })
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const resultado = await response.json();
    console.log('Produto criado:', resultado);
    return resultado;
  } catch (erro) {
    console.error('Erro ao criar produto:', erro);
    throw erro;
  }
}

// Listar todos os produtos
async function listarTodosProdutos() {
  try {
    const response = await fetch(`${BASE_URL}/product`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const produtos = await response.json();
    console.log('Produtos carregados:', produtos);
    return produtos;
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);
    throw erro;
  }
}

// Buscar produto por ID
async function buscarProdutoPorId(id) {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    const produto = await response.json();
    return produto;
  } catch (erro) {
    console.error('Erro ao buscar produto:', erro);
    throw erro;
  }
}

// Deletar produto
async function deletarProduto(id) {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.status}`);
    }

    console.log('Produto deletado com sucesso');
    return true;
  } catch (erro) {
    console.error('Erro ao deletar produto:', erro);
    throw erro;
  }
}

/* ------------------------------------
   CADASTRO DE PRODUTO (cadastro.html)
------------------------------------ */
function inicializarCadastro() {
  const form = document.getElementById("formCadastroProduto");
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById("produtoNome").value;
      const descricao = document.getElementById("produtoDesc").value;
      const preco = parseFloat(document.getElementById("produtoPreco").value);
      const imagemUrl = document.getElementById("produtoImg").value;
      
      try {
        await criarProduto(nome, descricao, [imagemUrl], preco);
        alert('✅ Produto cadastrado com sucesso!');
        form.reset();
        window.location.href = "produtos.html";
      } catch (erro) {
        alert('❌ Erro ao cadastrar produto! Verifique se o backend está rodando.');
        console.error(erro);
      }
    });
  }
}

/* ------------------------------------
   LISTAGEM DE PRODUTOS (produtos.html)
------------------------------------ */
async function carregarProdutos() {
  const lista = document.getElementById("listaProdutos");
  if (!lista) return;

  // Mostrar mensagem de carregamento
  lista.innerHTML = '<p>Carregando produtos...</p>';

  try {
    // Buscar produtos da API
    const produtos = await listarTodosProdutos();
    
    // Limpar container
    lista.innerHTML = '';

    // Se não houver produtos
    if (produtos.length === 0) {
      lista.innerHTML = '<p>Nenhum produto cadastrado ainda.</p>';
      return;
    }

    // Criar card para cada produto
    produtos.forEach((produto, index) => {
      const card = document.createElement("div");
      card.className = "produto-card";
      card.innerHTML = `
        ${produto.images && produto.images[0] ? 
          `<img src="${produto.images[0]}" alt="${produto.name}" onerror="this.src='https://via.placeholder.com/200x150?text=Sem+Imagem'">` 
          : '<img src="https://via.placeholder.com/200x150?text=Sem+Imagem" alt="Sem imagem">'}
        <h3>${produto.name}</h3>
        <p>${produto.description.substring(0, 50)}${produto.description.length > 50 ? '...' : ''}</p>
        <strong>R$ ${produto.price.toFixed(2)}</strong>
        <button class="btn-detalhes" onclick="abrirModal(${produto.id}, ${index})">Ver Detalhes</button>
      `;
      lista.appendChild(card);
    });

    // Salvar produtos globalmente para usar no modal
    window.produtosAPI = produtos;

  } catch (erro) {
    lista.innerHTML = `
      <p style="color: red;">❌ Erro ao carregar produtos!</p>
      <p>Certifique-se que o backend está rodando em http://localhost:8080</p>
    `;
    console.error('Erro:', erro);
  }
}

/* ------------------------------------
   MODAL - Ver Detalhes do Produto
------------------------------------ */
function abrirModal(id, index) {
  const produtos = window.produtosAPI;
  if (!produtos) return;

  const produto = produtos[index];
  
  document.getElementById("modalNome").innerText = produto.name;
  document.getElementById("modalDesc").innerText = produto.description;
  document.getElementById("modalPreco").innerText = `R$ ${produto.price.toFixed(2)}`;
  
  const modalImg = document.getElementById("modalImg");
  if (produto.images && produto.images[0]) {
    modalImg.src = produto.images[0];
    modalImg.onerror = () => modalImg.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
  } else {
    modalImg.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
  }

  document.getElementById("modalBg").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalBg").style.display = "none";
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById("modalBg");
  if (event.target === modal) {
    fecharModal();
  }
}

/* ------------------------------------
   INICIALIZAÇÃO
------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  // Se estiver na página de cadastro
  inicializarCadastro();
  
  // Se estiver na página de produtos
  carregarProdutos();
});

/* ------------------------------------
   PRODUTOS PADRÃO (FALLBACK)
   Caso a API não esteja disponível
------------------------------------ */
const produtosPadrao = [
  {
    id: 1,
    name: "Shampoo Fortalecedor",
    description: "Fortifica o cabelo e reduz queda.",
    price: 49.90,
    images: ["https://via.placeholder.com/200x150?text=Shampoo"]
  },
  {
    id: 2,
    name: "Máscara Hidratante",
    description: "Hidratação intensa para cabelos secos.",
    price: 39.90,
    images: ["https://via.placeholder.com/200x150?text=Mascara"]
  },
  {
    id: 3,
    name: "Tônico Capilar",
    description: "Estimula o crescimento acelerado.",
    price: 59.90,
    images: ["https://via.placeholder.com/200x150?text=Tonico"]
  }
];