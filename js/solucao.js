/* =============================================================
   MESA COMUM — página Solução
   1. Mostra as doações do array, ordenadas pela distância (DOM)
   2. Abre o formulário de reserva dentro do cartão da doação
   3. Valida nome, CPF e aceite dos termos (sem alert)
   4. Mostra o código da reserva e permite cancelar
   5. "Perdeu o código?": busca a reserva de hoje pelo CPF
   Usa as funções do js/dados.js.
   ============================================================= */

const selectBairro = document.getElementById('filtro-bairro');
const selectRaio = document.getElementById('filtro-raio');
const listaDoacoes = document.getElementById('lista-doacoes');
const resumoLista = document.getElementById('resumo-lista');
const areaCodigo = document.getElementById('area-codigo');
const codigoReserva = document.getElementById('codigo-reserva');

// CPF da reserva que está na tela (pra poder cancelar). Fica só na memória.
let cpfNaTela = '';


/* ---------- 1. LISTA DE DOAÇÕES ---------- */

// Preenche o select de bairros a partir do array BAIRROS
BAIRROS.forEach(function (bairro) {
  const opcao = document.createElement('option');
  opcao.value = bairro.nome;
  opcao.textContent = bairro.nome;
  selectBairro.appendChild(opcao);
});

function mostrarDoacoes() {
  const bairro = selectBairro.value;
  const raio = Number(selectRaio.value);
  const encontradas = doacoesPerto(bairro, raio);

  listaDoacoes.innerHTML = '';

  if (encontradas.length === 0) {
    resumoLista.textContent = '';
    const vazio = document.createElement('li');
    vazio.className = 'lista-vazia';
    vazio.textContent = 'Nada disponível até ' + raio + ' km de ' + bairro + ' agora. Aumente a distância ou volte mais tarde.';
    listaDoacoes.appendChild(vazio);
    return;
  }

  resumoLista.textContent = encontradas.length + (encontradas.length === 1 ? ' doação' : ' doações') +
    ' até ' + raio + ' km de ' + bairro + ', da mais perto para a mais longe.';

  encontradas.forEach(function (x) {
    const item = document.createElement('li');
    item.className = 'doacao';
    item.dataset.id = x.doacao.id;
    item.innerHTML =
      '<div class="doacao__distancia">' + distanciaTexto(x.km) + '<small>daqui</small></div>' +
      '<div>' +
        '<h3 class="doacao__nome">' + escaparHtml(x.comercio.nome) + '</h3>' +
        '<p class="doacao__local">' + escaparHtml(x.comercio.tipo) + ' · ' + escaparHtml(x.comercio.rua) + ', ' + escaparHtml(x.comercio.bairro) + '</p>' +
      '</div>' +
      '<div class="doacao__acao">' +
        '<button class="botao botao--principal" type="button" data-reservar>Reservar</button>' +
        '<span class="doacao__vagas">' + x.doacao.disponivel + ' de ' + x.doacao.quantidade + ' kits · até ' + horaTexto(x.doacao.retiradaAte) + '</span>' +
      '</div>' +
      '<p class="doacao__item">' + escaparHtml(x.doacao.item) + '</p>';
    listaDoacoes.appendChild(item);
  });
}

selectBairro.addEventListener('change', mostrarDoacoes);
selectRaio.addEventListener('change', mostrarDoacoes);


/* ---------- 2. FORMULÁRIO DE RESERVA ---------- */

listaDoacoes.addEventListener('click', function (evento) {
  const botao = evento.target.closest('[data-reservar]');
  if (!botao) return;

  const cartao = botao.closest('.doacao');

  // Só um formulário aberto por vez
  document.querySelectorAll('.doacao__form').forEach(function (f) { f.remove(); });

  const form = document.createElement('form');
  form.className = 'doacao__form formulario';
  form.noValidate = true;
  form.innerHTML =
    '<div class="formulario__linha">' +
      '<div class="campo">' +
        '<label for="reserva-nome">Seu nome</label>' +
        '<input id="reserva-nome" autocomplete="given-name" aria-describedby="reserva-nome-erro" required>' +
        '<p class="campo__erro oculto" id="reserva-nome-erro"></p>' +
      '</div>' +
      '<div class="campo">' +
        '<label for="reserva-cpf">CPF</label>' +
        '<input id="reserva-cpf" inputmode="numeric" autocomplete="off" placeholder="000.000.000-00" aria-describedby="reserva-cpf-erro" required>' +
        '<p class="campo__erro oculto" id="reserva-cpf-erro"></p>' +
      '</div>' +
    '</div>' +
    '<label class="caixa-check"><input type="checkbox" id="reserva-termos" required> ' +
      '<span>Li e aceito os <a class="link" href="termos.html" target="_blank">termos de uso</a>. Sei que são alimentos doados, perto da validade, e que devo consumir logo.</span>' +
    '</label>' +
    '<p class="mensagem mensagem--erro" id="reserva-mensagem" role="alert"></p>' +
    '<div class="botoes">' +
      '<button class="botao botao--principal" type="submit">Confirmar reserva</button>' +
      '<button class="botao botao--secundario" type="button" data-fechar>Cancelar</button>' +
    '</div>';

  cartao.appendChild(form);
  document.getElementById('reserva-nome').focus();

  form.querySelector('[data-fechar]').addEventListener('click', function () { form.remove(); botao.focus(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    enviarReserva(form, cartao.dataset.id);
  });
});

function mostrarErroCampo(idCampo, texto) {
  const campo = document.getElementById(idCampo);
  const erro = document.getElementById(idCampo + '-erro');
  campo.setAttribute('aria-invalid', 'true');
  erro.textContent = texto;
  erro.classList.remove('oculto');
}

function limparErros(form) {
  form.querySelectorAll('[aria-invalid]').forEach(function (c) { c.removeAttribute('aria-invalid'); });
  form.querySelectorAll('.campo__erro').forEach(function (p) { p.textContent = ''; p.classList.add('oculto'); });
  const mensagem = form.querySelector('.mensagem');
  if (mensagem) mensagem.textContent = '';
}

function enviarReserva(form, doacaoId) {
  limparErros(form);
  const nome = document.getElementById('reserva-nome').value;
  const cpf = document.getElementById('reserva-cpf').value;
  const aceitou = document.getElementById('reserva-termos').checked;
  const mensagem = document.getElementById('reserva-mensagem');

  // Validação dos campos obrigatórios
  let primeiroErro = null;
  if (nome.trim().length < 2) {
    mostrarErroCampo('reserva-nome', 'Escreva seu nome.');
    primeiroErro = primeiroErro || 'reserva-nome';
  }
  if (cpf.trim() === '') {
    mostrarErroCampo('reserva-cpf', 'Escreva seu CPF.');
    primeiroErro = primeiroErro || 'reserva-cpf';
  }
  if (!aceitou) {
    mensagem.textContent = 'Para reservar, marque que você leu os termos de uso.';
  }
  if (primeiroErro) { document.getElementById(primeiroErro).focus(); return; }
  if (!aceitou) return;

  // Regras do sistema (CPF válido, 1 por dia, bloqueio, kit disponível)
  const resultado = reservar(doacaoId, nome, cpf);

  if (!resultado.ok) {
    if (resultado.campo === 'nome' || resultado.campo === 'cpf') {
      mostrarErroCampo('reserva-' + resultado.campo, resultado.mensagem);
      document.getElementById('reserva-' + resultado.campo).focus();
    } else {
      mensagem.textContent = resultado.mensagem;
      if (resultado.bloqueado) {
        mensagem.innerHTML = escaparHtml(resultado.mensagem) + ' <a class="link" href="termos.html#bloqueio">Entenda o bloqueio</a>';
      }
    }
    return;
  }

  // Sucesso
  cpfNaTela = cpf;
  mostrarCodigo(resultado.reserva, resultado.doacao, resultado.comercio, resultado.faltas);
  mostrarDoacoes();
}


/* ---------- 3. CARTÃO COM O CÓDIGO ---------- */

function htmlDoCodigo(reserva, doacao, comercio, faltas) {
  let html =
    '<div class="codigo-card" data-codigo="' + reserva.codigo + '">' +
      '<p class="codigo-card__rotulo">Mostre este código no balcão</p>' +
      '<p class="codigo-card__codigo">' + reserva.codigo + '</p>' +
      '<div class="codigo-card__info">' +
        '<p><strong>' + escaparHtml(comercio.nome) + '</strong> · ' + escaparHtml(comercio.rua) + ', ' + escaparHtml(comercio.bairro) + '</p>' +
        '<p>' + escaparHtml(doacao.item) + '</p>';

  if (reserva.status === 'retirada') {
    html += '<p><strong>Já retirado às ' + horaTexto(reserva.retiradaEm) + '.</strong></p></div>';
  } else {
    html += '<p>Você tem até as <strong>' + horaTexto(reserva.expiraEm) + '</strong> para buscar. Se não chegar até esse horário, a reserva é cancelada e a comida fica para outra pessoa.</p></div>';
    if (faltas > 0) {
      html += '<p class="mensagem mensagem--aviso">Atenção: você já tem ' + faltas + (faltas === 1 ? ' falta' : ' faltas') +
        '. Com ' + REGRAS.faltasParaBloqueio + ', o CPF fica bloqueado por ' + REGRAS.diasDeBloqueio + ' dias.</p>';
    }
    html += '<p class="codigo-card__rotulo">Dica: tire um print desta tela. O código funciona sem internet na hora da retirada.</p>' +
      '<div class="codigo-card__cancelar">' +
        '<p>Não vai conseguir ir? Cancele aqui. Cancelar não tem punição.</p>' +
        '<button class="botao botao--secundario" type="button" data-cancelar>Cancelar reserva</button>' +
      '</div>';
  }
  return html + '</div>';
}

function mostrarCodigo(reserva, doacao, comercio, faltas) {
  codigoReserva.innerHTML = htmlDoCodigo(reserva, doacao, comercio, faltas);
  areaCodigo.classList.remove('oculto');
  areaCodigo.scrollIntoView({ behavior: 'smooth' });
  areaCodigo.focus();
}


/* ---------- 4. CANCELAR (pede confirmação antes) ---------- */

document.addEventListener('click', function (evento) {
  const caixa = evento.target.closest('.codigo-card__cancelar');
  if (!caixa) return;
  const cartao = caixa.closest('.codigo-card');

  if (evento.target.closest('[data-cancelar]')) {
    caixa.innerHTML =
      '<p>Cancelar mesmo? A comida volta para a lista e outra pessoa pode reservar.</p>' +
      '<div class="botoes">' +
        '<button class="botao botao--secundario" type="button" data-cancelar-sim>Sim, cancelar</button>' +
        '<button class="botao botao--secundario" type="button" data-cancelar-nao>Não, vou buscar</button>' +
      '</div>';
    caixa.querySelector('[data-cancelar-nao]').focus();
    return;
  }

  if (evento.target.closest('[data-cancelar-nao]')) {
    caixa.innerHTML =
      '<p>Não vai conseguir ir? Cancele aqui. Cancelar não tem punição.</p>' +
      '<button class="botao botao--secundario" type="button" data-cancelar>Cancelar reserva</button>';
    return;
  }

  if (evento.target.closest('[data-cancelar-sim]')) {
    const resultado = cancelarReserva(cartao.dataset.codigo, cpfNaTela);
    if (resultado.ok) {
      cartao.innerHTML =
        '<p class="codigo-card__rotulo">Reserva cancelada</p>' +
        '<p>Tudo certo, sem nenhuma falta. A comida já voltou para a lista e você pode reservar de novo.</p>';
    } else {
      cartao.innerHTML = '<p>' + escaparHtml(resultado.mensagem) + '</p>';
    }
    mostrarDoacoes();
  }
});


/* ---------- 5. PERDEU O CÓDIGO ---------- */

document.getElementById('form-minha').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const campo = document.getElementById('minha-cpf');
  const erro = document.getElementById('minha-cpf-erro');
  const resultadoArea = document.getElementById('minha-resultado');

  campo.removeAttribute('aria-invalid');
  erro.classList.add('oculto');
  resultadoArea.innerHTML = '';

  if (!cpfValido(campo.value)) {
    campo.setAttribute('aria-invalid', 'true');
    erro.textContent = campo.value.trim() === '' ? 'Escreva o CPF que você usou na reserva.' : 'Esse CPF não é válido. Confira os 11 números.';
    erro.classList.remove('oculto');
    campo.focus();
    return;
  }

  const info = reservaDeHoje(campo.value);
  cpfNaTela = campo.value;

  if (info.reserva) {
    resultadoArea.innerHTML = htmlDoCodigo(info.reserva, info.doacao, info.comercio, info.faltas);
  } else if (info.bloqueadoAte) {
    resultadoArea.innerHTML = '<p class="mensagem mensagem--erro">Esse CPF está bloqueado por ' + REGRAS.faltasParaBloqueio +
      ' faltas. Você pode reservar de novo a partir de ' + dataLonga(info.bloqueadoAte) + '.</p>';
  } else {
    let texto = 'Nenhuma reserva ativa hoje com esse CPF.';
    if (info.faltas > 0) texto += ' Você tem ' + info.faltas + (info.faltas === 1 ? ' falta.' : ' faltas.');
    resultadoArea.innerHTML = '<p class="mensagem mensagem--aviso">' + texto + '</p>';
  }
});


/* ---------- COMEÇO ---------- */
mostrarDoacoes();
