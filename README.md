# Mesa Comum

Global Solution 2026/2 · Desafio CitizenTech · Engenharia de Software FIAP · Turma 1ESOR

## Descrição

O Mesa Comum liga comércios que têm comida sobrando a famílias de baixa renda que moram perto deles.

- **Comércio** (padaria, mercado, restaurante): se cadastra e publica o que sobrou do dia. No balcão, digita o código da pessoa para confirmar a retirada. Depois de 10 retiradas, ganha o **Selo Apoiador**.
- **Pessoa**: escolhe o bairro e a distância, vê as doações da mais perto para a mais longe e reserva com nome e CPF. Recebe um código (ex.: `TRI-4821`) e tem 2 horas para buscar.

### O problema

Em 2024, 18,9 milhões de lares brasileiros (24,2%) viviam com algum grau de insegurança alimentar, segundo o IBGE. No mesmo país, cerca de 42% dos alimentos são perdidos ou desperdiçados. A comida e quem precisa dela muitas vezes estão a poucos quarteirões, mas um não sabe do outro.

### Regras

| Regra | Motivo |
|---|---|
| 1 reserva por CPF por dia | a comida chega a mais famílias |
| 2 horas para buscar | se a pessoa não vier, o kit volta para a lista |
| Cancelar não tem punição | quem avisa libera a comida para outra família |
| 3 faltas (não foi e não cancelou) = CPF bloqueado por 30 dias | evita comida parada; o desbloqueio é automático |
| O comércio não vê nome nem CPF | protege quem recebe |
| Retirada no local, sem entrega | é o que o comércio pequeno consegue fazer |

## Como abrir

1. Descompacte o `.zip`.
2. Abra o arquivo `index.html` no navegador (Chrome, Edge ou Firefox).

Não precisa instalar nada nem rodar servidor. Os dados ficam salvos no navegador (localStorage).

**Site publicado:** https://gabrielpenov.github.io/mesa-comum/

## Roteiro de teste (o mesmo da demonstração no pitch)

1. **Solução**: escolha um bairro, clique em **Reservar**, preencha nome e um CPF válido e marque os termos. O código aparece na tela.
2. Tente reservar de novo com o mesmo CPF: o site bloqueia (1 por dia). Cancele e reserve de novo.
3. **Comércios**: em **Só quer ver como fica?**, escolha o comércio onde reservou e clique em **Entrar no painel**. Digite o código em **Validar retirada**.
4. **Impacto**: os números aumentaram.
5. Para voltar ao estado inicial, use **Restaurar dados de exemplo** no fim da página Impacto.

CPFs válidos para teste (são números fictícios que passam no cálculo dos dígitos): `529.982.247-25`, `111.444.777-35`, `123.456.789-09`.

## Páginas

| Página | Arquivo | O que tem |
|---|---|---|
| Início | `index.html` | cidadão, problema com dado real e fonte, proposta, ODS, perguntas |
| Solução | `solucao.html` | busca por distância, reserva, código, cancelamento |
| Comércios | `comercio.html` | cadastro, painel, validar código, publicar doação, selo |
| Impacto | `impacto.html` | indicadores, gráfico de 14 dias, ranking, fontes |
| Equipe | `equipe.html` | integrantes, problema, decisões, tecnologias |
| Termos | `termos.html` | termos de uso e privacidade |

## Estrutura de pastas

```
mesa-comum/
├── index.html, solucao.html, comercio.html, impacto.html, equipe.html, termos.html
├── css/
│   └── estilo.css      todo o visual
├── js/
│   ├── dados.js        arrays de objetos, regras, localStorage, distância, CPF, reservas
│   ├── menu.js         menu do celular, tamanho da fonte, alto contraste
│   ├── solucao.js      lista de doações, formulário de reserva, código
│   ├── comercio.js     cadastro, painel, validar código, publicar doação
│   └── impacto.js      indicadores, gráfico e ranking
└── img/
    ├── logo.svg, selo.svg, integrante.svg
```

## Tecnologias

- HTML5 semântico (`header`, `nav`, `main`, `section`, `article`, `footer`, `dl`, `table`, `meter`)
- CSS3 com flexbox, grid, variáveis e media queries (1024px, 860px, 640px)
- JavaScript puro: arrays de objetos, DOM, eventos, `localStorage`
- Fonte Epilogue, do Google Fonts

Nenhum framework nem biblioteca.

## Requisitos do desafio

| Nº | Requisito | Onde está |
|---|---|---|
| 01 | Página inicial com cidadão, problema, dado real com fonte, proposta e ODS | `index.html` |
| 02 | Mínimo 4 páginas, mesmo menu, HTML semântico | 6 páginas com o mesmo `header` e `footer` |
| 03 | Simulação interativa em JS com array de objetos (10+ registros) no DOM | `js/dados.js`: `COMERCIOS_INICIAIS` (10), `DOACOES_INICIAIS` (12), `BAIRROS` (8); lista, reserva, validação de código e impacto em `solucao.js`, `comercio.js` e `impacto.js` |
| 04 | Formulário validado em JS, mensagens na página, sem `alert()` | reserva (nome, CPF com dígito verificador, termos), cadastro do comércio, publicar doação, validar código |
| 05 | Responsivo com media queries e flex/grid | `css/estilo.css`, seção 14 |
| 06 | Acessibilidade | link "pular para o conteúdo", `alt`, `label` em todos os campos, foco visível, menu com `aria-expanded` e tecla Esc, botões de tamanho da fonte e alto contraste |
| 07 | Código organizado e README | pastas `css`, `js` e `img`; este arquivo |

## ODS

- **ODS 2, Fome zero e agricultura sustentável:** comida que ia para o lixo chega a famílias em insegurança alimentar.
- **ODS 10, Redução das desigualdades:** a regra de 1 reserva por dia distribui a comida entre mais famílias.
- **ODS 11, Cidades e comunidades sustentáveis:** liga o comércio do bairro aos moradores e reduz o lixo orgânico.

## Fontes dos dados

- IBGE. PNAD Contínua: Segurança Alimentar 2024. Agência IBGE Notícias, 2025. https://agenciadenoticias.ibge.gov.br/pt/agencia-noticias/44728-mais-de-dois-milhoes-de-lares-saem-da-inseguranca-alimentar-em-2024.html
- Harvard Law School Food Law and Policy Clinic; The Global FoodBanking Network. Atlas Global de Políticas de Doação de Alimentos: Brasil, 2024. https://atlas.foodbanking.org/wp-content/uploads/2024/02/Atlas_Brazil_2024_Policy-Recs_Portuguese.pdf
- Brasil. Lei nº 15.224, de 2025. https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15224.htm

Os comércios, doações e retiradas do site são fictícios, criados para a simulação.

## Limites do protótipo

- Os dados ficam no navegador de quem abre o site. Numa versão real, eles ficariam num servidor.
- O CPF é validado pelos dígitos verificadores, o que barra números inventados. Confirmar se o CPF existe exigiria consultar a Receita Federal.
- A localização é pelo bairro escolhido. Numa versão real, seria pelo GPS do celular.

## Uso de IA generativa

Usamos o Claude como apoio para:

- revisar os textos do site;
- sugerir a estrutura das páginas e partes do código, todas revisadas por nós do grupo;

## Integrantes

| Nome | RM |
|---|---|
| Gabriel Penov | RM574270 |
| Allyson Rafael de Abreu Leite | RM576572 |
| Kauan Lins da Silva | RM576053 |
| Anderson Menezes | RM576512 |

## Vídeo pitch

Link: https://youtu.be/n7Wfikc_0lw
