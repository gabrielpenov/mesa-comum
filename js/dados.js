/* =============================================================
   MESA COMUM — dados e regras do sistema
   -------------------------------------------------------------
   Este arquivo guarda os dados (arrays de objetos) e todas as
   regras: reservar, cancelar, validar código, faltas, bloqueio
   e os números de impacto.

   Os dados ficam salvos no localStorage do navegador, para que
   uma reserva feita na página Solução apareça no painel da
   página Comércios. Numa versão real, isso ficaria num servidor.
   ============================================================= */


/* ---------- 1. REGRAS DO NEGÓCIO ---------- */

const REGRAS = {
  reservasPorDia: 1,     // 1 reserva por CPF por dia
  horasParaBuscar: 2,    // depois de reservar, a pessoa tem 2 horas para buscar
  faltasParaBloqueio: 3, // 3 vezes sem buscar e sem cancelar = bloqueio
  diasDeBloqueio: 30,    // o bloqueio sai sozinho depois de 30 dias
  kitsParaSelo: 10       // retiradas para o comércio ganhar o selo Apoiador
};

const CHAVE_STORAGE = 'mesa-comum-dados';


/* ---------- 2. BAIRROS (coordenadas aproximadas) ----------
   Usados para calcular a distância entre a pessoa e o comércio. */

const BAIRROS = [
  { nome: 'Consolação',    lat: -23.5534, lng: -46.6563 },
  { nome: 'Bela Vista',    lat: -23.5614, lng: -46.6459 },
  { nome: 'Pinheiros',     lat: -23.5658, lng: -46.6862 },
  { nome: 'Mooca',         lat: -23.5560, lng: -46.6000 },
  { nome: 'Liberdade',     lat: -23.5583, lng: -46.6353 },
  { nome: 'Santa Cecília', lat: -23.5370, lng: -46.6515 },
  { nome: 'Brás',          lat: -23.5430, lng: -46.6160 },
  { nome: 'Vila Mariana',  lat: -23.5890, lng: -46.6340 }
];


/* ---------- 3. DADOS INICIAIS (arrays de objetos) ----------
   10 comércios e 12 doações de exemplo, para a apresentação. */

const COMERCIOS_INICIAIS = [
  { id: 'c1',  nome: 'Padaria Trigal',          tipo: 'Padaria',     rua: 'Rua Augusta',          bairro: 'Consolação',    email: 'trigal@exemplo.com',    lat: -23.5528, lng: -46.6571 },
  { id: 'c2',  nome: 'Mercadinho do Largo',     tipo: 'Mercado',     rua: 'Rua Treze de Maio',    bairro: 'Bela Vista',    email: 'largo@exemplo.com',     lat: -23.5620, lng: -46.6450 },
  { id: 'c3',  nome: 'Hortifruti Pomar Vivo',   tipo: 'Hortifruti',  rua: 'Rua dos Pinheiros',    bairro: 'Pinheiros',     email: 'pomar@exemplo.com',     lat: -23.5649, lng: -46.6870 },
  { id: 'c4',  nome: 'Restaurante Panela Cheia',tipo: 'Restaurante', rua: 'Rua da Mooca',         bairro: 'Mooca',         email: 'panela@exemplo.com',    lat: -23.5571, lng: -46.5989 },
  { id: 'c5',  nome: 'Padaria Grão Dourado',    tipo: 'Padaria',     rua: 'Rua Galvão Bueno',     bairro: 'Liberdade',     email: 'grao@exemplo.com',      lat: -23.5576, lng: -46.6347 },
  { id: 'c6',  nome: 'Lanchonete Esquina Sete', tipo: 'Lanchonete',  rua: 'Rua das Palmeiras',    bairro: 'Santa Cecília', email: 'esquina@exemplo.com',   lat: -23.5378, lng: -46.6522 },
  { id: 'c7',  nome: 'Empório Bom Prato',       tipo: 'Mercado',     rua: 'Rua Oriente',          bairro: 'Brás',          email: 'emporio@exemplo.com',   lat: -23.5437, lng: -46.6152 },
  { id: 'c8',  nome: 'Padaria Vila Pão',        tipo: 'Padaria',     rua: 'Rua Domingos de Morais', bairro: 'Vila Mariana', email: 'vilapao@exemplo.com',  lat: -23.5884, lng: -46.6347 },
  { id: 'c9',  nome: 'Cozinha da Dona Cida',    tipo: 'Restaurante', rua: 'Rua Frei Caneca',      bairro: 'Consolação',    email: 'cida@exemplo.com',      lat: -23.5541, lng: -46.6522 },
  { id: 'c10', nome: 'Quitanda Paulista',       tipo: 'Hortifruti',  rua: 'Rua Abolição',         bairro: 'Bela Vista',    email: 'quitanda@exemplo.com',  lat: -23.5600, lng: -46.6420 }
];

const DOACOES_INICIAIS = [
  { id: 'd1',  comercioId: 'c1',  item: 'Pães do dia (6 pães franceses)',     quantidade: 8,  pesoKg: 0.5 },
  { id: 'd2',  comercioId: 'c2',  item: 'Iogurtes e frios perto da validade', quantidade: 5,  pesoKg: 1.2 },
  { id: 'd3',  comercioId: 'c3',  item: 'Frutas e legumes maduros',           quantidade: 10, pesoKg: 2.0 },
  { id: 'd4',  comercioId: 'c4',  item: 'Marmita do almoço',                  quantidade: 6,  pesoKg: 0.6 },
  { id: 'd5',  comercioId: 'c5',  item: 'Bolos e salgados do dia',            quantidade: 4,  pesoKg: 0.8 },
  { id: 'd6',  comercioId: 'c6',  item: 'Sanduíches naturais',                quantidade: 5,  pesoKg: 0.4 },
  { id: 'd7',  comercioId: 'c7',  item: 'Arroz e feijão com embalagem amassada', quantidade: 6, pesoKg: 2.0 },
  { id: 'd8',  comercioId: 'c8',  item: 'Pão de forma e bisnaguinhas',        quantidade: 7,  pesoKg: 0.6 },
  { id: 'd9',  comercioId: 'c9',  item: 'Sopa de legumes (pote de 1 litro)',  quantidade: 5,  pesoKg: 1.0 },
  { id: 'd10', comercioId: 'c10', item: 'Verduras do dia',                    quantidade: 8,  pesoKg: 1.5 },
  { id: 'd11', comercioId: 'c1',  item: 'Roscas e sonhos',                    quantidade: 4,  pesoKg: 0.5 },
  { id: 'd12', comercioId: 'c3',  item: 'Bananas maduras (1 dúzia)',          quantidade: 6,  pesoKg: 1.5 }
];


/* ---------- 4. FUNÇÕES DE APOIO ---------- */

// Gera um id simples, ex.: "r1731600000000"
function novoId(prefixo) {
  return prefixo + Date.now() + Math.floor(Math.random() * 1000);
}

// Data no formato "2026-11-15", no fuso do navegador
function chaveDoDia(data) {
  const d = new Date(data);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + mes + '-' + dia;
}

// "14:30"
function horaTexto(data) {
  return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// "15/11"
function dataCurta(data) {
  return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// "15/12/2026"
function dataLonga(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

// Deixa só os números: "529.982.247-25" -> "52998224725"
function soNumeros(texto) {
  return String(texto).replace(/\D/g, '');
}

// Impede que texto digitado pelo usuário vire HTML na página
function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ---------- 5. SALVAR E CARREGAR ---------- */

// Fim do horário de retirada das doações de exemplo: 23h30 de hoje,
// ou daqui a 3 horas se já for tarde (pra demonstração funcionar a qualquer hora)
function fimDaRetiradaExemplo() {
  const fim = new Date();
  fim.setHours(23, 30, 0, 0);
  const daqui3h = new Date(Date.now() + 3 * 60 * 60 * 1000);
  return fim > daqui3h ? fim : daqui3h;
}

// Monta o estado inicial com os arrays de exemplo e um histórico de retiradas
function criarDadosDeExemplo() {
  const fim = fimDaRetiradaExemplo().toISOString();
  const dados = {
    comercios: COMERCIOS_INICIAIS.map(function (c) { return Object.assign({}, c); }),
    doacoes: DOACOES_INICIAIS.map(function (d) {
      return Object.assign({}, d, { disponivel: d.quantidade, retiradaAte: fim, criadaEm: new Date().toISOString() });
    }),
    reservas: [],
    comercioLogado: null,
    diaDosExemplos: chaveDoDia(new Date())
  };

  // Histórico dos últimos 14 dias, para a página Impacto não começar vazia
  let n = 0;
  for (let dia = 14; dia >= 1; dia--) {
    const porDia = 2 + ((dia * 7) % 5);
    for (let k = 0; k < porDia; k++) {
      const doacaoBase = DOACOES_INICIAIS[(dia + k) % DOACOES_INICIAIS.length];
      const quando = new Date();
      quando.setDate(quando.getDate() - dia);
      quando.setHours(8 + (k * 3) % 11, (k * 17) % 60, 0, 0);

      const doacaoAntiga = {
        id: 'h' + n, comercioId: doacaoBase.comercioId, item: doacaoBase.item, quantidade: 1,
        disponivel: 0, pesoKg: doacaoBase.pesoKg, retiradaAte: quando.toISOString(), criadaEm: quando.toISOString()
      };
      dados.doacoes.push(doacaoAntiga);

      const faltou = (n % 9 === 4);
      dados.reservas.push({
        id: 'r' + n, doacaoId: doacaoAntiga.id, comercioId: doacaoBase.comercioId,
        codigo: 'HIS-' + (1000 + n), nome: 'Exemplo', cpf: 'exemplo' + (n % 37),
        criadaEm: quando.toISOString(),
        expiraEm: new Date(quando.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        status: faltou ? 'expirada' : 'retirada',
        retiradaEm: faltou ? null : new Date(quando.getTime() + 40 * 60 * 1000).toISOString()
      });
      n++;
    }
  }
  return dados;
}

function carregar() {
  try {
    const texto = localStorage.getItem(CHAVE_STORAGE);
    if (texto) return JSON.parse(texto);
  } catch (erro) {
    // Sem localStorage (ex.: navegação privada): segue com os exemplos
  }
  return criarDadosDeExemplo();
}

function salvar() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(dados));
  } catch (erro) {
    // Sem localStorage: os dados valem só enquanto a página estiver aberta
  }
}

function restaurarExemplos() {
  dados = criarDadosDeExemplo();
  salvar();
}

let dados = carregar();


/* ---------- 6. DISTÂNCIA ----------
   Fórmula de Haversine: distância em linha reta entre dois
   pontos no mapa, em quilômetros. */

function distanciaKm(a, b) {
  const raioTerra = 6371;
  const rad = function (graus) { return graus * Math.PI / 180; };
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * raioTerra * Math.asin(Math.sqrt(h));
}

function distanciaTexto(km) {
  if (km < 1) return (Math.round(km * 1000 / 50) * 50) + ' m';
  return km.toFixed(1).replace('.', ',') + ' km';
}

function buscarBairro(nome) {
  return BAIRROS.find(function (b) { return b.nome === nome; });
}


/* ---------- 7. CPF ----------
   Os dois últimos dígitos do CPF são calculados a partir dos
   nove primeiros. Aqui refazemos essa conta para saber se o
   número tem o formato de um CPF de verdade. */

function cpfValido(cpf) {
  const n = soNumeros(cpf);
  if (n.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(n)) return false; // 111.111.111-11 e parecidos

  function calcularDigito(base) {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  return calcularDigito(n.slice(0, 9)) === Number(n[9]) &&
         calcularDigito(n.slice(0, 10)) === Number(n[10]);
}


/* ---------- 8. CÓDIGO DE RETIRADA ----------
   3 letras do comércio + 4 números. Ex.: "TRI-4821". */

function gerarCodigo(nomeComercio) {
  const palavras = nomeComercio
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .split(' ')
    .filter(function (p) { return !['PADARIA', 'MERCADINHO', 'RESTAURANTE', 'LANCHONETE', 'HORTIFRUTI', 'EMPORIO', 'COZINHA', 'QUITANDA', 'DA', 'DO', 'DE'].includes(p); });
  const prefixo = ((palavras[0] || 'MES') + 'XXX').slice(0, 3);

  let codigo;
  do {
    codigo = prefixo + '-' + (1000 + Math.floor(Math.random() * 9000));
  } while (dados.reservas.some(function (r) { return r.codigo === codigo; }));
  return codigo;
}


/* ---------- 9. ATUALIZAÇÕES AUTOMÁTICAS ---------- */

// Num dia novo, as doações de exemplo voltam a ficar disponíveis
function renovarExemplosSeDiaNovo() {
  const hoje = chaveDoDia(new Date());
  if (dados.diaDosExemplos === hoje) return;
  const fim = fimDaRetiradaExemplo().toISOString();
  dados.doacoes.forEach(function (d) {
    if (/^d\d+$/.test(d.id)) {
      d.disponivel = d.quantidade;
      d.retiradaAte = fim;
    }
  });
  dados.diaDosExemplos = hoje;
  salvar();
}

// Reserva vencida sem retirada vira "expirada" (= 1 falta) e o kit volta pra lista
function atualizarExpiradas() {
  const agora = Date.now();
  let mudou = false;
  dados.reservas.forEach(function (r) {
    if (r.status === 'ativa' && new Date(r.expiraEm).getTime() < agora) {
      r.status = 'expirada';
      const doacao = dados.doacoes.find(function (d) { return d.id === r.doacaoId; });
      if (doacao) doacao.disponivel += 1;
      mudou = true;
    }
  });
  if (mudou) salvar();
}

renovarExemplosSeDiaNovo();
atualizarExpiradas();


/* ---------- 10. FALTAS E BLOQUEIO ----------
   Status de uma reserva:
   'ativa'     -> reservou e ainda pode buscar
   'retirada'  -> o comércio validou o código
   'cancelada' -> a pessoa cancelou (sem punição)
   'expirada'  -> não buscou e não cancelou = 1 falta

   Com 3 faltas o CPF fica bloqueado por 30 dias, contados
   da 3ª falta. Depois disso, as faltas antigas deixam de contar. */

function faltasDoCpf(cpf) {
  const umDia = 24 * 60 * 60 * 1000;
  const faltas = dados.reservas
    .filter(function (r) { return r.cpf === cpf && r.status === 'expirada'; })
    .sort(function (a, b) { return a.expiraEm.localeCompare(b.expiraEm); });

  // Percorre as faltas: a cada 3, abre um bloqueio de 30 dias.
  // Se o bloqueio já acabou, a contagem recomeça do zero.
  let contando = [];
  let fimDoBloqueio = null;
  faltas.forEach(function (f) {
    contando.push(f);
    if (contando.length === REGRAS.faltasParaBloqueio) {
      fimDoBloqueio = new Date(new Date(f.expiraEm).getTime() + REGRAS.diasDeBloqueio * umDia);
      if (fimDoBloqueio.getTime() <= Date.now()) {
        contando = [];
        fimDoBloqueio = null;
      }
    }
  });
  return { quantidade: contando.length, bloqueadoAte: fimDoBloqueio };
}


/* ---------- 11. PESSOA: BUSCAR, RESERVAR, CANCELAR ---------- */

// Doações com kit disponível, dentro do horário e até o raio escolhido
function doacoesPerto(bairro, raioKm) {
  atualizarExpiradas();
  const origem = buscarBairro(bairro);
  const agora = Date.now();

  return dados.doacoes
    .filter(function (d) { return d.disponivel > 0 && new Date(d.retiradaAte).getTime() > agora; })
    .map(function (d) {
      const comercio = dados.comercios.find(function (c) { return c.id === d.comercioId; });
      return { doacao: d, comercio: comercio, km: distanciaKm(origem, comercio) };
    })
    .filter(function (x) { return x.km <= raioKm; })
    .sort(function (a, b) { return a.km - b.km; });
}

// Devolve { ok: true, reserva, ... } ou { ok: false, campo, mensagem }
function reservar(doacaoId, nome, cpfDigitado) {
  atualizarExpiradas();
  const cpf = soNumeros(cpfDigitado);

  if (nome.trim().length < 2) {
    return { ok: false, campo: 'nome', mensagem: 'Escreva seu nome.' };
  }
  if (!cpfValido(cpf)) {
    return { ok: false, campo: 'cpf', mensagem: 'Esse CPF não é válido. Confira os 11 números.' };
  }

  const situacao = faltasDoCpf(cpf);
  if (situacao.bloqueadoAte) {
    return {
      ok: false, campo: 'geral', bloqueado: true,
      mensagem: 'Esse CPF está bloqueado porque deixou de buscar ' + REGRAS.faltasParaBloqueio +
        ' reservas sem cancelar, e essa comida ficou parada enquanto outras pessoas precisavam. ' +
        'Você pode reservar de novo a partir de ' + dataLonga(situacao.bloqueadoAte) + '.'
    };
  }

  // 1 por dia: reserva cancelada não conta, reserva que virou falta conta
  const hoje = chaveDoDia(new Date());
  const jaReservou = dados.reservas.some(function (r) {
    return r.cpf === cpf && chaveDoDia(r.criadaEm) === hoje && r.status !== 'cancelada';
  });
  if (jaReservou) {
    return { ok: false, campo: 'cpf', mensagem: 'Esse CPF já usou a reserva de hoje. Amanhã você pode reservar de novo.' };
  }

  const doacao = dados.doacoes.find(function (d) { return d.id === doacaoId; });
  if (!doacao || doacao.disponivel < 1) {
    return { ok: false, campo: 'geral', mensagem: 'Esse kit acabou de ser reservado por outra pessoa. Escolha outro na lista.' };
  }

  const comercio = dados.comercios.find(function (c) { return c.id === doacao.comercioId; });
  const agora = new Date();
  const limite2h = new Date(agora.getTime() + REGRAS.horasParaBuscar * 60 * 60 * 1000);
  const fimRetirada = new Date(doacao.retiradaAte);
  const expiraEm = limite2h < fimRetirada ? limite2h : fimRetirada;

  const reserva = {
    id: novoId('r'), doacaoId: doacao.id, comercioId: comercio.id,
    codigo: gerarCodigo(comercio.nome), nome: nome.trim(), cpf: cpf,
    criadaEm: agora.toISOString(), expiraEm: expiraEm.toISOString(),
    status: 'ativa', retiradaEm: null
  };

  doacao.disponivel -= 1;
  dados.reservas.push(reserva);
  salvar();
  return { ok: true, reserva: reserva, doacao: doacao, comercio: comercio, faltas: situacao.quantidade };
}

function cancelarReserva(codigo, cpfDigitado) {
  atualizarExpiradas();
  const cpf = soNumeros(cpfDigitado);
  const reserva = dados.reservas.find(function (r) { return r.codigo === codigo && r.cpf === cpf; });

  if (!reserva) return { ok: false, mensagem: 'Não achamos essa reserva com esse CPF.' };
  if (reserva.status !== 'ativa') return { ok: false, mensagem: 'Essa reserva não pode mais ser cancelada.' };

  reserva.status = 'cancelada';
  const doacao = dados.doacoes.find(function (d) { return d.id === reserva.doacaoId; });
  if (doacao) doacao.disponivel += 1;
  salvar();
  return { ok: true };
}

// "Perdeu o código?": a reserva de hoje (ativa ou retirada) desse CPF
function reservaDeHoje(cpfDigitado) {
  atualizarExpiradas();
  const cpf = soNumeros(cpfDigitado);
  const hoje = chaveDoDia(new Date());
  const reserva = dados.reservas.find(function (r) {
    return r.cpf === cpf && chaveDoDia(r.criadaEm) === hoje && (r.status === 'ativa' || r.status === 'retirada');
  });
  const situacao = faltasDoCpf(cpf);
  if (!reserva) return { reserva: null, faltas: situacao.quantidade, bloqueadoAte: situacao.bloqueadoAte };

  return {
    reserva: reserva,
    doacao: dados.doacoes.find(function (d) { return d.id === reserva.doacaoId; }),
    comercio: dados.comercios.find(function (c) { return c.id === reserva.comercioId; }),
    faltas: situacao.quantidade,
    bloqueadoAte: situacao.bloqueadoAte
  };
}


/* ---------- 12. COMÉRCIO ---------- */

function cadastrarComercio(nome, tipo, rua, bairro, email) {
  const base = buscarBairro(bairro);
  // Espalha um pouco o ponto dentro do bairro, pra dois comércios não ficarem no mesmo lugar
  const ajuste = function () { return (Math.random() - 0.5) * 0.006; };
  const comercio = {
    id: novoId('c'), nome: nome.trim(), tipo: tipo, rua: rua.trim(), bairro: bairro,
    email: email.trim(), lat: base.lat + ajuste(), lng: base.lng + ajuste()
  };
  dados.comercios.push(comercio);
  dados.comercioLogado = comercio.id;
  salvar();
  return comercio;
}

function entrarComoComercio(id) { dados.comercioLogado = id; salvar(); }
function sairDoPainel() { dados.comercioLogado = null; salvar(); }

function comercioAtual() {
  return dados.comercios.find(function (c) { return c.id === dados.comercioLogado; }) || null;
}

// "18:30" de hoje -> data completa
function horarioDeHoje(hhmm) {
  const partes = hhmm.split(':');
  const d = new Date();
  d.setHours(Number(partes[0]), Number(partes[1]), 0, 0);
  return d;
}

function publicarDoacao(comercioId, item, quantidade, pesoKg, retiradaAte) {
  const doacao = {
    id: novoId('d'), comercioId: comercioId, item: item.trim(), quantidade: quantidade,
    disponivel: quantidade, pesoKg: pesoKg,
    retiradaAte: horarioDeHoje(retiradaAte).toISOString(), criadaEm: new Date().toISOString()
  };
  dados.doacoes.push(doacao);
  salvar();
  return doacao;
}

// Doações publicadas pelo comércio (sem o histórico antigo de exemplo)
function doacoesDoComercio(comercioId) {
  atualizarExpiradas();
  return dados.doacoes.filter(function (d) {
    return d.comercioId === comercioId && d.id.charAt(0) !== 'h';
  });
}

function validarCodigo(comercioId, codigoDigitado) {
  atualizarExpiradas();
  const codigo = codigoDigitado.trim().toUpperCase();
  const reserva = dados.reservas.find(function (r) { return r.codigo === codigo; });

  if (!reserva) return { ok: false, mensagem: 'Código não encontrado. Confira as letras e os números.' };
  if (reserva.comercioId !== comercioId) return { ok: false, mensagem: 'Este código é de outro estabelecimento.' };
  if (reserva.status === 'retirada') return { ok: false, mensagem: 'Este código já foi usado às ' + horaTexto(reserva.retiradaEm) + '.' };
  if (reserva.status === 'cancelada') return { ok: false, mensagem: 'A pessoa cancelou esta reserva.' };
  if (reserva.status === 'expirada') return { ok: false, mensagem: 'Esta reserva passou do prazo e o kit voltou para a lista.' };

  reserva.status = 'retirada';
  reserva.retiradaEm = new Date().toISOString();
  salvar();
  const doacao = dados.doacoes.find(function (d) { return d.id === reserva.doacaoId; });
  return { ok: true, item: doacao.item, hora: horaTexto(reserva.retiradaEm) };
}

// Histórico do comércio: data, hora e item. Sem nome nem CPF de quem retirou.
function historicoDoComercio(comercioId) {
  return dados.reservas
    .filter(function (r) { return r.comercioId === comercioId && r.status === 'retirada'; })
    .sort(function (a, b) { return b.retiradaEm.localeCompare(a.retiradaEm); })
    .map(function (r) {
      const doacao = dados.doacoes.find(function (d) { return d.id === r.doacaoId; });
      return { quando: r.retiradaEm, item: doacao.item, pesoKg: doacao.pesoKg };
    });
}


/* ---------- 13. IMPACTO ---------- */

function calcularImpacto() {
  atualizarExpiradas();
  const retiradas = dados.reservas.filter(function (r) { return r.status === 'retirada'; });
  const expiradas = dados.reservas.filter(function (r) { return r.status === 'expirada'; });

  const kg = retiradas.reduce(function (soma, r) {
    const doacao = dados.doacoes.find(function (d) { return d.id === r.doacaoId; });
    return soma + doacao.pesoKg;
  }, 0);

  // Pessoas diferentes: CPFs únicos entre as retiradas
  const cpfs = [];
  retiradas.forEach(function (r) { if (!cpfs.includes(r.cpf)) cpfs.push(r.cpf); });

  // Retiradas por dia nos últimos 14 dias
  const porDia = [];
  for (let i = 13; i >= 0; i--) {
    const dia = new Date();
    dia.setDate(dia.getDate() - i);
    const chave = chaveDoDia(dia);
    porDia.push({
      dia: dia,
      total: retiradas.filter(function (r) { return chaveDoDia(r.retiradaEm) === chave; }).length
    });
  }

  // Ranking dos comércios
  const porComercio = dados.comercios
    .map(function (c) {
      return { comercio: c, total: retiradas.filter(function (r) { return r.comercioId === c.id; }).length };
    })
    .filter(function (x) { return x.total > 0; })
    .sort(function (a, b) { return b.total - a.total; });

  const totalFinalizadas = retiradas.length + expiradas.length;

  return {
    retiradas: retiradas.length,
    pessoas: cpfs.length,
    kg: kg,
    comercios: dados.comercios.length,
    taxaRetirada: totalFinalizadas ? retiradas.length / totalFinalizadas : 0,
    porDia: porDia,
    porComercio: porComercio
  };
}
