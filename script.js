async function carregarProdutos() {
  const container = document.getElementById('produtos-container');
  container.innerHTML = '<div class="loading"></div>';

  try {
    const response = await fetch('data/produtos.xlsx');
    if (!response.ok) {
      throw new Error(`Erro ao buscar a planilha: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const produtos = XLSX.utils.sheet_to_json(sheet);

    container.innerHTML = ''; 

    produtos.forEach(produto => {
      const nomeImagemOriginal = produto.imagem.trim();

      // --- A NOVA CORREÇÃO ESTÁ AQUI ---
      // Substituímos a extensão .jpg por .png no nome do arquivo.
      const nomeImagemCorrigido = nomeImagemOriginal.replace('.jpg', '.png');

      // --- PASSO DE DEPURAÇÃO ATUALIZADO ---
      // Agora o console mostrará o novo caminho com .png
      console.log(`Tentando carregar a imagem em: imagens/${nomeImagemCorrigido}`);

      const card = document.createElement('article');
      card.className = 'card';

      const img = document.createElement('img');
      // Usamos a variável com o nome corrigido para .png
      img.src = `imagens/${nomeImagemCorrigido}`;
      img.alt = produto.nome;

      const content = document.createElement('div');
      content.className = 'card-content';

      const nome = document.createElement('h3');
      nome.textContent = produto.nome;

      const detalhes = document.createElement('p');
      detalhes.textContent = produto.detalhes;

      const preco = document.createElement('p');
      preco.className = 'preco';
      const precoFormatado = Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      preco.textContent = precoFormatado;

      card.appendChild(img);
      content.appendChild(nome);
      content.appendChild(detalhes);
      content.appendChild(preco);
      card.appendChild(content);

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar os produtos:", error);
        container.innerHTML = `
      <div class="error-message">
        <p>⚠️ Ops! Não conseguimos carregar as ofertas.</p>
        <p>Tente recarregar a página ou volte mais tarde.</p>
        <small>Erro: ${error.message}</small>
      </div>
    `;
  }

   setTimeout(atualizarVisibilidadeSetas, 100);
}

carregarProdutos();

function rolarPara(direcao) {
  const duracao = 800; // Duração da animação em ms
  const inicio = window.pageYOffset;
  let destino;
  
  if (direcao === 'cima') {
    destino = 0;
  } else {
    destino = document.body.scrollHeight - window.innerHeight;
  }
  
  const distancia = destino - inicio;
  const inicioTempo = performance.now();

  function animarScroll(tempoAtual) {
    const tempoDecorrido = tempoAtual - inicioTempo;
    const progresso = Math.min(tempoDecorrido / duracao, 1);
    const ease = progresso < 0.5 
      ? 2 * progresso * progresso 
      : 1 - Math.pow(-2 * progresso + 2, 2) / 2;
    
    window.scrollTo(0, inicio + distancia * ease);
    
    if (tempoDecorrido < duracao) {
      requestAnimationFrame(animarScroll);
    }
  }

  requestAnimationFrame(animarScroll);
}

function atualizarVisibilidadeSetas() {
  const setaCima = document.getElementById('seta-cima');
  const setaBaixo = document.getElementById('seta-baixo');
  const posicaoScroll = window.pageYOffset;
  const alturaJanela = window.innerHeight;
  const alturaDocumento = document.body.scrollHeight;

  // Mostrar/ocultar seta para cima
  if (posicaoScroll > 100) {
    setaCima.classList.remove('escondida');
  } else {
    setaCima.classList.add('escondida');
  }

  // Mostrar/ocultar seta para baixo
  if (posicaoScroll + alturaJanela < alturaDocumento - 100) {
    setaBaixo.classList.remove('escondida');
  } else {
    setaBaixo.classList.add('escondida');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  const setaCima = document.getElementById('seta-cima');
  const setaBaixo = document.getElementById('seta-baixo');

  // Configura o email
  configurarEmail();
  
  // Adiciona eventos de clique
  setaCima.addEventListener('click', () => rolarPara('cima'));
  setaBaixo.addEventListener('click', () => rolarPara('baixo'));

  // Atualiza visibilidade inicial
  atualizarVisibilidadeSetas();

  // Atualiza durante o scroll
  window.addEventListener('scroll', atualizarVisibilidadeSetas);
});


function configurarEmail() {
  const emailLink = document.querySelector('.email-link');
  
  emailLink.addEventListener('click', function(e) {
    e.preventDefault();
    
    const assunto = "Consulta sobre peças automotivas";
    const corpo = `Olá Lucas,\n\nEstou interessado(a) nas peças da Giraffe Auto Peças.\n\nPoderia me informar mais sobre:\n\n- \n- \n\nAtenciosamente,\n[Seu Nome]`;
    
    window.location.href = `mailto:lucas.pio@gmail.com?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  });
}
