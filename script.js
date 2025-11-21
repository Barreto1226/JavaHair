/* ===== CONFIGURAÇÃO DA API ===== */
const BASE_URL = 'http://localhost:8080';

/* ===== FUNÇÕES DA API ===== */

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

async function atualizarProduto(id, nome, descricao, imagens, preco) {
  try {
    const response = await fetch(`${BASE_URL}/product/${id}`, {
      method: 'PATCH',
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
    console.log('Produto atualizado:', resultado);
    return resultado;
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    throw erro;
  }
}

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

/* ===== CADASTRO DE PRODUTO ===== */
function inicializarCadastro() {
  const form = document.getElementById("formCadastroProduto");
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nome = document.getElementById("produtoNome").value;
      const descricao = document.getElementById("produtoDesc").value;
      const preco = parseFloat(document.getElementById("produtoPreco").value);
      const imagemUrl = document.getElementById("produtoImg").value;
      
      // Adicionar loading no botão
      const btnSubmit = form.querySelector('button[type="submit"]');
      const textoOriginal = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '<span>⏳</span> Salvando...';
      btnSubmit.disabled = true;
      
      try {
        await criarProduto(nome, descricao, imagemUrl ? [imagemUrl] : [], preco);
        
        // Mostrar mensagem de sucesso
        mostrarNotificacao('✅ Produto cadastrado com sucesso!', 'success');
        
        form.reset();
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
          window.location.href = "produtos.html";
        }, 1000);
        
      } catch (erro) {
        mostrarNotificacao('❌ Erro ao cadastrar produto! Verifique se o backend está rodando.', 'error');
        console.error(erro);
        
        // Restaurar botão
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
      }
    });
  }
}

/* ===== LISTAGEM DE PRODUTOS ===== */
async function carregarProdutos() {
  const lista = document.getElementById("listaProdutos");
  if (!lista) return;

  try {
    const produtos = await listarTodosProdutos();
    
    lista.innerHTML = '';

    if (produtos.length === 0) {
      lista.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div style="font-size: 4rem; margin-bottom: 20px;">📦</div>
          <h2 style="color: var(--gray); margin-bottom: 10px;">Nenhum produto cadastrado</h2>
          <p style="color: var(--gray);">Comece adicionando seu primeiro produto!</p>
          <a href="cadastro.html" class="btn btn-primary" style="margin-top: 20px; display: inline-flex;">
            ➕ Cadastrar Primeiro Produto
          </a>
        </div>
      `;
      return;
    }

    produtos.forEach((produto, index) => {
      const card = document.createElement("div");
      card.className = "produto-card";
      card.innerHTML = `
        ${produto.images && produto.images[0] ? 
          `<img src="${produto.images[0]}" alt="${produto.name}" onerror="this.src='https://via.placeholder.com/300x200/6a4c93/ffffff?text=JavaHair'">` 
          : '<img src="https://via.placeholder.com/300x200/6a4c93/ffffff?text=JavaHair" alt="Produto">'}
        <div style="padding: 20px;">
          <h3>${produto.name}</h3>
          <p>${produto.description.length > 80 ? produto.description.substring(0, 80) + '...' : produto.description}</p>
          <strong>R$ ${produto.price.toFixed(2)}</strong>
          
          <div style="display: flex; gap: 8px; margin-top: 15px;">
            <button onclick="abrirModal(${produto.id}, ${index})" class="btn btn-primary">
              👁️ Ver
            </button>
            <button onclick="editarProdutoModal(${produto.id})" class="btn btn-success">
              ✏️ Editar
            </button>
            <button onclick="confirmarExclusao(${produto.id}, '${produto.name.replace(/'/g, "\\'")}', '${produto.name.replace(/'/g, "\\'")}')" class="btn btn-danger">
              🗑️ Excluir
            </button>
          </div>
        </div>
      `;
      lista.appendChild(card);
    });

    window.produtosAPI = produtos;

  } catch (erro) {
    lista.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 4rem; margin-bottom: 20px;">❌</div>
        <h2 style="color: var(--danger); margin-bottom: 10px;">Erro ao carregar produtos!</h2>
        <p style="color: var(--gray); margin-bottom: 20px;">Certifique-se que o backend está rodando em http://localhost:8080</p>
        <button onclick="carregarProdutos()" class="btn btn-primary" style="display: inline-flex;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
    console.error('Erro:', erro);
  }
}

/* ===== EXCLUIR PRODUTO ===== */
async function confirmarExclusao(id, nome) {
  if (confirm(`🗑️ Tem certeza que deseja excluir "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
    try {
      await deletarProduto(id);
      mostrarNotificacao('✅ Produto excluído com sucesso!', 'success');
      carregarProdutos();
    } catch (erro) {
      mostrarNotificacao('❌ Erro ao excluir produto!', 'error');
      console.error(erro);
    }
  }
}

/* ===== EDITAR PRODUTO ===== */
async function editarProdutoModal(id) {
  try {
    const produto = await buscarProdutoPorId(id);
    
    const modalBg = document.getElementById("modalBg");
    const modal = modalBg.querySelector(".modal");
    
    modal.innerHTML = `
      <span class="modal-close" onclick="fecharModal()">&times;</span>
      <div class="modal-content">
        <h2>✏️ Editar Produto</h2>
        <form id="formEditarProduto" style="margin-top: 30px;">
          <input type="hidden" id="editId" value="${produto.id}">
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark);">
              📦 Nome do Produto
            </label>
            <input type="text" id="editNome" value="${produto.name}" required 
              style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem;">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark);">
              📝 Descrição
            </label>
            <textarea id="editDesc" required rows="4"
              style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem; font-family: inherit;">${produto.description}</textarea>
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark);">
              💰 Preço (R$)
            </label>
            <input type="number" id="editPreco" value="${produto.price}" step="0.01" required
              style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem;">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--dark);">
              🖼️ URL da Imagem
            </label>
            <input type="url" id="editImg" value="${produto.images && produto.images[0] ? produto.images[0] : ''}"
              style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem;">
          </div>
          
          <div style="display: flex; gap: 10px; margin-top: 30px;">
            <button type="submit" class="btn btn-success btn-large" style="flex: 1;">
              💾 Salvar Alterações
            </button>
            <button type="button" onclick="fecharModal()" class="btn btn-secondary btn-large" style="flex: 1;">
              ✖️ Cancelar
            </button>
          </div>
        </form>
      </div>
    `;
    
    modalBg.style.display = "flex";
    
    document.getElementById("formEditarProduto").addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById("editId").value;
      const nome = document.getElementById("editNome").value;
      const descricao = document.getElementById("editDesc").value;
      const preco = parseFloat(document.getElementById("editPreco").value);
      const imagemUrl = document.getElementById("editImg").value;
      
      const btnSubmit = e.target.querySelector('button[type="submit"]');
      const textoOriginal = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '<span>⏳</span> Salvando...';
      btnSubmit.disabled = true;
      
      try {
        await atualizarProduto(id, nome, descricao, imagemUrl ? [imagemUrl] : [], preco);
        mostrarNotificacao('✅ Produto atualizado com sucesso!', 'success');
        fecharModal();
        carregarProdutos();
      } catch (erro) {
        mostrarNotificacao('❌ Erro ao atualizar produto!', 'error');
        console.error(erro);
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
      }
    });
    
  } catch (erro) {
    mostrarNotificacao('❌ Erro ao buscar dados do produto!', 'error');
    console.error(erro);
  }
}

/* ===== MODAL - VER DETALHES ===== */
function abrirModal(id, index) {
  const produtos = window.produtosAPI;
  if (!produtos) return;

  const produto = produtos[index];
  
  const modalBg = document.getElementById("modalBg");
  const modal = modalBg.querySelector(".modal");
  
  modal.innerHTML = `
    <span class="modal-close" onclick="fecharModal()">&times;</span>
    <div class="modal-content">
      ${produto.images && produto.images[0] ? 
        `<img src="${produto.images[0]}" alt="${produto.name}" onerror="this.src='https://via.placeholder.com/600x400/6a4c93/ffffff?text=JavaHair'">` 
        : '<img src="https://via.placeholder.com/600x400/6a4c93/ffffff?text=JavaHair" alt="Produto">'}
      <h2>${produto.name}</h2>
      <p style="line-height: 1.8; margin: 20px 0;">${produto.description}</p>
      <h3>R$ ${produto.price.toFixed(2)}</h3>
      <button onclick="fecharModal()" class="btn btn-primary btn-large" style="margin-top: 25px; width: 100%;">
        Fechar
      </button>
    </div>
  `;
  
  modalBg.style.display = "flex";
}

function fecharModal() {
  document.getElementById("modalBg").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("modalBg");
  if (event.target === modal) {
    fecharModal();
  }
}

/* ===== NOTIFICAÇÕES ===== */
function mostrarNotificacao(mensagem, tipo) {
  const notificacao = document.createElement('div');
  notificacao.className = `notificacao ${tipo}`;
  notificacao.textContent = mensagem;
  notificacao.style.cssText = `
    position: fixed;
    top: 90px;
    right: 20px;
    padding: 16px 24px;
    background: ${tipo === 'success' ? 'var(--success)' : 'var(--danger)'};
    color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notificacao);
  
  setTimeout(() => {
    notificacao.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notificacao.remove(), 300);
  }, 3000);
}

/* ===== INICIALIZAÇÃO ===== */
document.addEventListener('DOMContentLoaded', () => {
  inicializarCadastro();
  carregarProdutos();
});