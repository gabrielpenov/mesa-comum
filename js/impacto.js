/* =============================================================
   MESA COMUM — página Impacto
   Lê calcularImpacto() do js/dados.js e monta os números,
   o gráfico dos últimos 14 dias e o ranking dos comércios.
   As barras usam o elemento <meter> do HTML (sem CSS inline).
   ============================================================= */

function mostrarImpacto() {
  const impacto = calcularImpacto();

  // Números gerais
  const numeros = [
    [impacto.retiradas, 'kits retirados'],
    [impacto.pessoas, 'pessoas diferentes ajudadas'],
    [impacto.kg.toFixed(1).replace('.', ',') + ' kg', 'que não foram para o lixo'],
    [Math.round(impacto.taxaRetirada * 100) + '%', 'das reservas foram retiradas']
  ];
  document.getElementById('impacto-indicadores').innerHTML = numeros.map(function (n) {
    return '<div class="indicador"><dt>' + n[1] + '</dt><dd>' + n[0] + '</dd></div>';
  }).join('');

  // Gráfico: uma linha por dia
  const maior = Math.max(1, ...impacto.porDia.map(function (d) { return d.total; }));
  document.getElementById('impacto-grafico').innerHTML = impacto.porDia.map(function (d) {
    const dia = dataCurta(d.dia);
    return '<li><span>' + dia + '</span>' +
      '<meter min="0" max="' + maior + '" value="' + d.total + '" aria-label="' + d.total + ' retiradas em ' + dia + '"></meter>' +
      '<span>' + d.total + '</span></li>';
  }).join('');

  // Ranking dos comércios
  const ranking = document.getElementById('impacto-ranking');
  if (impacto.porComercio.length === 0) {
    ranking.innerHTML = '<li>Nenhuma retirada ainda.</li>';
    return;
  }
  const primeiro = impacto.porComercio[0].total;
  ranking.innerHTML = impacto.porComercio.slice(0, 6).map(function (x) {
    return '<li><span>' + escaparHtml(x.comercio.nome) + '</span><strong>' + x.total + '</strong>' +
      '<meter min="0" max="' + primeiro + '" value="' + x.total + '" aria-label="' + x.total + ' retiradas"></meter></li>';
  }).join('');
}

document.getElementById('botao-restaurar').addEventListener('click', function () {
  restaurarExemplos();
  mostrarImpacto();
  document.getElementById('restaurar-mensagem').textContent = 'Dados de exemplo restaurados. Todas as reservas de teste foram apagadas.';
});

mostrarImpacto();
