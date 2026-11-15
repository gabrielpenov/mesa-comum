/* =============================================================
   MESA COMUM — página Comércios
   Sem login: texto + formulário de cadastro (com validação).
   Com login: painel com números, validar código, publicar
   doação, lista de doações, selo e histórico.
   Usa as funções do js/dados.js.
   ============================================================= */

const vistaEntrada = document.getElementById('vista-entrada');
const vistaPainel = document.getElementById('vista-painel');


/* ---------- 1. SELECTS ---------- */

BAIRROS.forEach(function (bairro) {
  const opcao = document.createElement('option');
  opcao.value = bairro.nome;
  opcao.textContent = bairro.nome;
  document.getElementById('cad-bairro').appendChild(opcao);
});

dados.comercios.forEach(function (comercio) {
  const opcao = document.createElement('option');
  opcao.value = comercio.id;
  opcao.textContent = comercio.nome + ' (' + comercio.bairro + ')';
  document.getElementById('exemplo-comercio').appendChild(opcao);
});


/* ---------- 2. QUAL TELA MOSTRAR ---------- */

function atualizarTela(mensagemBoasVindas) {
  const comercio = comercioAtual();
  vistaEntrada.classList.toggle('oculto', comercio !== null);
  vistaPainel.classList.toggle('oculto', comercio === null);
  if (comercio) {
    document.getElementById('painel-boas-vindas').textContent = mensagemBoasVindas || '';
    desenharPainel(comercio);
  }
  window.scrollTo(0, 0);
}


/* ---------- 3. ERROS NOS CAMPOS ---------- */

function mostrarErro(idCampo, texto) {
  const campo = document.getElementById(idCampo);
  const erro = document.getElementById(idCampo + '-erro');
  campo.setAttribute('aria-invalid', 'true');
  erro.textContent = texto;
  erro.classList.remove('oculto');
}

function limparErros(form) {
  form.querySelectorAll('[aria-invalid]').forEach(function (c) { c.removeAttribute('aria-invalid'); });
  form.querySelectorAll('.campo__erro').forEach(function (p) { p.textContent = ''; p.classList.add('oculto'); });
}


/* ---------- 4. CADASTRO ---------- */

document.getElementById('form-cadastro').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const form = evento.currentTarget;
  limparErros(form);

  const nome = document.getElementById('cad-nome').value;
  const tipo = document.getElementById('cad-tipo').value;
  const bairro = document.getElementById('cad-bairro').value;
  const rua = document.getElementById('cad-rua').value;
  const email = document.getElementById('cad-email').value;
  const mensagem = document.getElementById('cad-mensagem');

  const erros = [];
  if (nome.trim().length < 2) erros.push(['cad-nome', 'Escreva o nome do estabelecimento.']);
  if (rua.trim().length < 3) erros.push(['cad-rua', 'Escreva a rua, para quem for retirar encontrar você.']);
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) erros.push(['cad-email', 'Escreva um email válido, com @. Ex.: contato@padaria.com']);

  if (erros.length > 0) {
    erros.forEach(function (e) { mostrarErro(e[0], e[1]); });
    mensagem.textContent = erros.length === 1 ? 'Falta corrigir 1 campo.' : 'Falta corrigir ' + erros.length + ' campos.';
    document.getElementById(erros[0][0]).focus();
    return;
  }

  mensagem.textContent = '';
  const comercio = cadastrarComercio(nome, tipo, rua, bairro, email);
  form.reset();
  atualizarTela('Cadastro feito! ' + comercio.nome + ' já pode publicar doações.');
});

document.getElementById('form-exemplo').addEventListener('submit', function (evento) {
  evento.preventDefault();
  entrarComoComercio(document.getElementById('exemplo-comercio').value);
  atualizarTela('');
});

document.getElementById('botao-sair').addEventListener('click', function () {
  sairDoPainel();
  atualizarTela('');
});


/* ---------- 5. PAINEL ---------- */

function desenharPainel(comercio) {
  document.getElementById('painel-nome').textContent = comercio.nome;
  document.getElementById('painel-endereco').textContent = comercio.tipo + ' · ' + comercio.rua + ', ' + comercio.bairro;

  const doacoes = doacoesDoComercio(comercio.id);
  const historico = historicoDoComercio(comercio.id);
  const kg = historico.reduce(function (soma, h) { return soma + h.pesoKg; }, 0);
  const aguardando = dados.reservas.filter(function (r) { return r.comercioId === comercio.id && r.status === 'ativa'; }).length;
  const disponiveis = doacoes
    .filter(function (d) { return new Date(d.retiradaAte) > new Date(); })
    .reduce(function (soma, d) { return soma + d.disponivel; }, 0);

  // Números do topo
  const numeros = [
    [historico.length, 'kits retirados'],
    [kg.toFixed(1).replace('.', ',') + ' kg', 'que não foram para o lixo'],
    [aguardando, 'reservas esperando retirada'],
    [disponiveis, 'kits disponíveis agora']
  ];
  document.getElementById('painel-indicadores').innerHTML = numeros.map(function (n) {
    return '<div class="indicador"><dt>' + n[1] + '</dt><dd>' + n[0] + '</dd></div>';
  }).join('');

  // Tabela de doações
  const tabela = document.getElementById('tabela-doacoes');
  if (doacoes.length === 0) {
    tabela.innerHTML = '<tbody><tr><td>Nenhuma doação publicada ainda. Use o formulário acima.</td></tr></tbody>';
  } else {
    let linhas = '';
    doacoes.forEach(function (d) {
      const reservas = dados.reservas.filter(function (r) { return r.doacaoId === d.id; });
      const reservados = reservas.filter(function (r) { return r.status === 'ativa'; }).length;
      const retirados = reservas.filter(function (r) { return r.status === 'retirada'; }).length;
      const encerrada = new Date(d.retiradaAte) < new Date() ? ' (encerrada)' : '';
      linhas += '<tr><td>' + escaparHtml(d.item) + encerrada + '</td><td>' + horaTexto(d.retiradaAte) + '</td>' +
        '<td class="numero">' + d.disponivel + '</td><td class="numero">' + reservados + '</td><td class="numero">' + retirados + '</td></tr>';
    });
    tabela.innerHTML =
      '<thead><tr><th scope="col">Item</th><th scope="col">Retirada até</th><th scope="col" class="numero">Disponíveis</th>' +
      '<th scope="col" class="numero">Reservados</th><th scope="col" class="numero">Retirados</th></tr></thead>' +
      '<tbody>' + linhas + '</tbody>';
  }

  // Histórico (sem dados pessoais)
  const tabelaHistorico = document.getElementById('tabela-historico');
  if (historico.length === 0) {
    tabelaHistorico.innerHTML = '<tbody><tr><td>Nenhuma retirada ainda.</td></tr></tbody>';
  } else {
    tabelaHistorico.innerHTML =
      '<thead><tr><th scope="col">Data</th><th scope="col">Hora</th><th scope="col">Item</th></tr></thead><tbody>' +
      historico.slice(0, 8).map(function (h) {
        return '<tr><td>' + dataCurta(h.quando) + '</td><td>' + horaTexto(h.quando) + '</td><td>' + escaparHtml(h.item) + '</td></tr>';
      }).join('') + '</tbody>';
  }

  // Selo Apoiador
  const meta = REGRAS.kitsParaSelo;
  const ganhou = historico.length >= meta;
  const faltam = meta - historico.length;
  document.getElementById('painel-selo').innerHTML =
    (ganhou
      ? '<img class="selo__disco selo__disco--ganho" src="img/selo.svg" alt="Selo Apoiador Mesa Comum conquistado">'
      : '<div class="selo__disco">' + historico.length + ' de ' + meta + '</div>') +
    '<div class="pilha">' +
      '<p><strong>' + (ganhou ? 'Selo Apoiador conquistado' : (faltam === 1 ? 'Falta 1 retirada para o selo' : 'Faltam ' + faltam + ' retiradas para o selo')) + '</strong></p>' +
      '<meter min="0" max="' + meta + '" value="' + Math.min(historico.length, meta) + '" aria-label="Progresso até o selo">' + historico.length + ' de ' + meta + '</meter>' +
      '<p class="campo__ajuda">Mostre o selo na vitrine e nas redes. O histórico serve de comprovação para pedir o Selo Doador de Alimentos oficial (Lei nº 15.224).</p>' +
    '</div>';
}


/* ---------- 6. VALIDAR CÓDIGO ---------- */

document.getElementById('form-validar').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const campo = document.getElementById('validar-codigo');
  const mensagem = document.getElementById('validar-mensagem');

  if (campo.value.trim() === '') {
    mensagem.className = 'mensagem mensagem--erro';
    mensagem.textContent = 'Digite o código que a pessoa mostrou.';
    campo.focus();
    return;
  }

  const resultado = validarCodigo(comercioAtual().id, campo.value);
  if (resultado.ok) {
    mensagem.className = 'mensagem mensagem--sucesso';
    mensagem.textContent = 'Retirada confirmada às ' + resultado.hora + ': ' + resultado.item + '. Pode entregar.';
    campo.value = '';
  } else {
    mensagem.className = 'mensagem mensagem--erro';
    mensagem.textContent = resultado.mensagem;
  }
  desenharPainel(comercioAtual());
});


/* ---------- 7. PUBLICAR DOAÇÃO ---------- */

document.getElementById('form-doacao').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const form = evento.currentTarget;
  const mensagem = document.getElementById('doacao-mensagem');
  limparErros(form);
  mensagem.textContent = '';

  const item = document.getElementById('doacao-item').value;
  const quantidade = Number(document.getElementById('doacao-qtd').value);
  const peso = Number(document.getElementById('doacao-peso').value);
  const ate = document.getElementById('doacao-ate').value;

  const erros = [];
  if (item.trim().length < 3) erros.push(['doacao-item', 'Escreva o que vai no kit.']);
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 100) erros.push(['doacao-qtd', 'Escreva um número de 1 a 100.']);
  if (!(peso > 0)) erros.push(['doacao-peso', 'Escreva o peso aproximado, ex.: 0,5.']);
  if (!ate) {
    erros.push(['doacao-ate', 'Escolha até que horas dá para retirar.']);
  } else if (horarioDeHoje(ate) <= new Date()) {
    erros.push(['doacao-ate', 'Esse horário já passou. Escolha um horário mais tarde, hoje.']);
  }

  if (erros.length > 0) {
    erros.forEach(function (e) { mostrarErro(e[0], e[1]); });
    mensagem.className = 'mensagem mensagem--erro';
    mensagem.textContent = erros.length === 1 ? 'Falta corrigir 1 campo.' : 'Falta corrigir ' + erros.length + ' campos.';
    document.getElementById(erros[0][0]).focus();
    return;
  }

  publicarDoacao(comercioAtual().id, item, quantidade, peso, ate);
  document.getElementById('doacao-item').value = '';
  mensagem.className = 'mensagem mensagem--sucesso';
  mensagem.textContent = 'Publicado: ' + quantidade + ' kits até ' + ate + '. Já aparece na página Solução.';
  desenharPainel(comercioAtual());
});


/* ---------- COMEÇO ---------- */
atualizarTela('');
