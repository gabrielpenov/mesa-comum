/* =============================================================
   MESA COMUM — menu e acessibilidade (usado em todas as páginas)
   - Abre e fecha o menu no celular
   - Aumenta e diminui o tamanho da fonte
   - Liga e desliga o modo de alto contraste
   As escolhas ficam salvas no navegador.
   ============================================================= */


/* ---------- Menu no celular ---------- */

const botaoMenu = document.querySelector('.menu-botao');
const menu = document.querySelector('.menu');

botaoMenu.addEventListener('click', function () {
  const aberto = menu.classList.toggle('aberto');
  botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});

// Fecha o menu com a tecla Esc
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
    menu.classList.remove('aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
    botaoMenu.focus();
  }
});


/* ---------- Tamanho da fonte ---------- */

const TAMANHOS = ['', 'fonte-maior', 'fonte-muito-maior'];
let tamanhoAtual = 0;

function aplicarTamanho() {
  TAMANHOS.forEach(function (classe) {
    if (classe) document.documentElement.classList.remove(classe);
  });
  if (TAMANHOS[tamanhoAtual]) document.documentElement.classList.add(TAMANHOS[tamanhoAtual]);
  guardarPreferencia('mesa-comum-fonte', String(tamanhoAtual));
}

document.querySelector('[data-fonte="menor"]').addEventListener('click', function () {
  if (tamanhoAtual > 0) tamanhoAtual--;
  aplicarTamanho();
});

document.querySelector('[data-fonte="maior"]').addEventListener('click', function () {
  if (tamanhoAtual < TAMANHOS.length - 1) tamanhoAtual++;
  aplicarTamanho();
});


/* ---------- Alto contraste ---------- */

const botaoContraste = document.querySelector('[data-contraste]');

function aplicarContraste(ligado) {
  document.body.classList.toggle('alto-contraste', ligado);
  botaoContraste.setAttribute('aria-pressed', ligado ? 'true' : 'false');
  guardarPreferencia('mesa-comum-contraste', ligado ? '1' : '0');
}

botaoContraste.addEventListener('click', function () {
  aplicarContraste(!document.body.classList.contains('alto-contraste'));
});


/* ---------- Guardar as escolhas ---------- */

function guardarPreferencia(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch (erro) { /* sem localStorage */ }
}

function lerPreferencia(chave) {
  try { return localStorage.getItem(chave); } catch (erro) { return null; }
}

// Ao abrir a página, aplica o que a pessoa escolheu antes
tamanhoAtual = Number(lerPreferencia('mesa-comum-fonte')) || 0;
aplicarTamanho();
aplicarContraste(lerPreferencia('mesa-comum-contraste') === '1');
