# CLAUDE.md — Instituto Núcleon-line (Projeto 0066)

Este arquivo é o DNA do projeto. Leia-o integralmente antes de qualquer alteração.
Toda decisão aqui documentada já foi aprovada pela Direção Criativa. Não reabra decisões travadas — refine a execução delas.

---

## 1. O QUE É ESTE PROJETO

Site institucional do **Instituto Núcleon-line**, plataforma de qualificação profissional.
Promessa da marca: **"Estude o que dá retorno real."**

- **Versão 1.0 — ESTÁTICA.** Sem vídeos, sem 3D, sem back-end. HTML5 + CSS3 + GSAP (ScrollTrigger).
- Formato: **Scrollytelling cinematográfico** de 6 dobras na Home + 3 páginas internas.
- Padrão de qualidade: "Apple keynote" — contenção, precisão, nada de botões agressivos nem efeitos gratuitos.

### Papéis
- **Direção Criativa (o usuário):** visão, copy, e TODOS os assets visuais finais (fotos fotorrealistas WebP + SVGs). Nunca invente copy nova sem pedir; use a copy oficial da seção 4.
- **Engenharia (Claude):** código limpo, semântico, de altíssima performance, e consultoria técnica honesta.

---

## 2. DECISÕES TRAVADAS (não renegociar)

1. **Arco de Luz Progressivo.** O site NASCE branco luminoso (universo do aluno, Dobras 1–3) e ESCURECE progressivamente até o Deep Dark Studio (universo corporativo/legado, Dobras 4–6). A transição é um gradiente de background global animado pelo scroll (`js/main.js` → `initArcoDeLuz()`). As fotos de fundo branco devem fundir invisível ao fundo claro; as cinematográficas, ao escuro.
   **Execução travada:** três estágios reais — `--cor-branco-luminoso` → `--cor-arco-transicao` (meio-tom) → `--cor-deep-dark` — numa janela que vai de "D4 a 70% da tela" até "D4 encostando no topo". Quando a D4 toma a tela inteira, o fundo já está 100% escuro. A virada de tinta do texto (`initTemaPorDobra`, constante `VIRADA_TEMA`) acontece a 35% da tela, que é **exatamente o meio dessa janela**: é o instante em que o fundo cruza o meio-tom e a tinta clara passa a ter contraste. Mexeu na janela do arco, mexe no `VIRADA_TEMA` junto.
2. **Dobra 2 é imersão pura.** SEM CTA, SEM formulário, SEM botão. Apenas a imagem do olho com o ecossistema refletido na pupila. É a "respiração contemplativa" do site.
3. **Loop narrativo.** O jovem da Dobra 1 e o mentor da Dobra 6 são A MESMA PESSOA (trava de seed na geração das imagens). A Dobra 6 fecha o ciclo: quem despertou agora estende a mão ao visitante.
4. **Alturas fluidas.** Dobras usam `min-height: 100svh` — NUNCA altura fixa em px. (900px era referência de composição, não de código.)
5. **Imagens com overscan.** Toda foto de dobra chega com ~30% de altura extra para o parallax nunca revelar bordas. Ao integrar (Fase 5), o container corta via `overflow: hidden` e o parallax move a imagem dentro dele.
6. **Sem ferramentas de terceiros** além de GSAP (CDN) e Google Fonts. Zero frameworks CSS, zero jQuery.
7. **Composição travada da Dobra 6.** Texto (eyebrow + título + CTA Master) na faixa SUPERIOR; elemento luminoso — o orbe hoje, a mão do mentor segurando o núcleo na Fase 5 — na faixa INFERIOR. Nunca centralizados no mesmo ponto. Regra estrutural, não estética: sem ela, texto e orbe disputam o centro da dobra e o texto perde legibilidade.
   **Execução travada:** `.dobra__conteudo` da D6 recebe `dobra__conteudo--superior` (`align-self: start` + `margin-bottom: clamp(9.5rem, 20vh, 14rem)`). Esse `margin-bottom` participa do fluxo do grid — é o que garante, por construção, que não há colisão em nenhuma largura/altura: em janelas baixas (mobile em paisagem, por exemplo), ele obriga a seção a crescer além de `100svh` em vez de comprimir sobre o orbe, coerente com a decisão 4 (`min-height`, nunca altura fixa). O orbe (`.placeholder--d6`) é ancorado à base via `align-items: end` + `padding-bottom`. Testado sem colisão em 390×844, 1920×1080 e no caso adversarial 844×390 (viewport baixo). Vale para o placeholder atual e para a foto real da Fase 5 — ver a nota de composição no `PROMPTS_FREEPIK.md`.

---

## 3. IDENTIDADE VISUAL

### Paleta (as cores funcionam como "practical lights" — luzes de cena, não decoração)
Definidas em `css/tokens.css`:

| Token | Hex | Papel narrativo |
|---|---|---|
| `--cor-laranja` | `#FF7A29` | O núcleo de energia. Cor do despertar e da ação (CTAs primários no mundo claro) |
| `--cor-ciano` | `#38DCE6` | Tecnologia, o ecossistema. Luz rebatida das Dobras 1–2 |
| `--cor-verde` | `#8FE07A` | Eficiência, o "Depois" B2B. Domina a Dobra 4B |
| `--cor-mostarda` | `#E5B13F` | Prosperidade, conexões. Dobras 3 e 4B |
| `--cor-azul-escuro` | `#0B1B33` | Institucional, B2G. Dobra 5 |
| `--cor-branco-luminoso` | `#FAFBFC` | Fundo do universo do aluno (Dobras 1–3) |
| `--cor-deep-dark` | `#06080F` | Fundo do universo corporativo (Dobras 4–6) |
| `--cor-arco-transicao` | `#3A4150` | Meio-tom do Arco de Luz. Não é cor de cena — é o estágio 2 da passagem D3 → D4 |

Regra: **uma cor dominante por dobra**, ecoando a luz da foto daquela cena. Nunca as sete juntas.

Tokens de apoio (também em `tokens.css`, nunca soltos no CSS): `--nucleo-brilho-*` (o highlight dos orbes), `--cinza-juxtapose-*` (cena do par D4), `--tinta-tag`, `--tinta-sobre-laranja`.

### Tipografia
- **Display:** `Sora` (700/800) — títulos das dobras. Geométrica, energética, tracking levemente negativo em tamanhos grandes.
- **Texto:** `Figtree` (400/500) — parágrafos e UI.
- Eyebrows/labels usam `Sora` 600 em caps com `letter-spacing: 0.14em` (ex.: "NÚCLEO 01 — O DESPERTAR"). A numeração é legítima: as dobras SÃO uma sequência narrativa.
- Escala tipográfica fluida via `clamp()` — já definida em `tokens.css`. Não criar tamanhos avulsos.

### Assinatura visual
O **núcleo** (orbe de luz). Aparece como elemento gráfico recorrente: placeholder radial nas dobras, bullet dos CTAs, favicon futuro. É o único "enfeite" permitido — todo o resto é disciplina.

---

## 4. COPY OFICIAL (usar literalmente)

- **D1 (Hero):** "O mercado não espera. Ele seleciona." — CTAs: [Inicie Sua Trajetória] [Saiba Mais]
- **D2:** sem copy dominante, sem CTA (ver decisão 2). Eyebrow apenas.
- **D3:** "Você é o Hub." + "Metodologia ágil que acelera a conexão com as oportunidades reais." — CTAs: [Conecte-se ao Mercado] [Saiba Mais]
- **D4 (B2B):** "Treinar custa. Não treinar custa o dobro." + "Transforme o custo do retrabalho no lucro da eficiência." — CTAs: [Potencialize Sua Equipe] [Saiba Mais]
- **D5 (B2G):** "Invista na qualificação. Fortaleça sua gestão e construa um legado social." — CTAs: [Transforme Sua Cidade] [Saiba Mais]
- **D6:** "Chegou a sua vez de estar no centro." — CTA Master: [INSCREVA-SE NO HUB AGORA]

Copy das páginas internas (Jovem, Empresário B2B, Gestor Público B2G): está no briefing original; será inserida na Fase 4.

---

## 5. ARQUITETURA DE UX (implementar nas fases indicadas)

- **Header Smart (Fase 1 — feito):** minimalista, esconde no scroll para baixo, reaparece no scroll para cima. Ganha leve blur/fundo quando fora do topo. Adapta cor ao tema claro/escuro da dobra atual.
- **Menu mobile (antecipado da Fase 6 — feito):** abaixo de 640px a nav horizontal vira painel sob o header, comandado por um botão com `aria-expanded`/`aria-controls`. Fechado, o painel sai da ordem de tabulação; abrir move o foco para o primeiro link; `Esc` fecha e devolve o foco ao botão. Com o menu aberto o header não se esconde. **Links de navegação nunca podem simplesmente sumir num breakpoint.**
- **Âncoras suaves (Fase 1 — feito):** não existe `scroll-behavior: smooth` global (conflita com o ScrollTrigger e com o Scroll-Back da Fase 4). A rolagem é feita no `initAncorasSuaves()` via GSAP ScrollToPlugin, descontando a altura do header, com salto instantâneo sob `prefers-reduced-motion`.
- **Parallax das fotos (Fase 2 — feito):** `.dobra__foto` desloca-se dentro do seu container (`.dobra__media[data-parallax]`) via `transform`, nunca `top/left` — ±16% da altura do container (§6, valor recalibrado e auditado contra o teto físico do overscan), dentro da folga do overscan de 30% (decisão 5). A centralização original do CSS (`top/left:50%` + `translate(-50%,-50%)`) é replicada em GSAP via `xPercent`/`yPercent`, e só o `y` extra do parallax anima por cima, com `scrub` cobrindo o trajeto inteiro da dobra na viewport. **A D4 fica de fora** — o par Antes/Depois do Juxtapose tem seu próprio movimento controlado pelo `pin` da Fase 3 (abaixo), não pelo parallax; não tem `data-parallax` no HTML.
- **Órbita da Dobra 1 (Fase 2 — feito):** os três núcleos (`.placeholder__nucleo[data-orbita]`) orbitam sua própria posição de repouso (definida em CSS) num círculo achatado, com 120° de defasagem entre eles. Diferente da órbita em `@keyframes` de `pages/em-breve.html` (que gira no tempo), esta é dirigida pelo progresso do `ScrollTrigger` da própria D1 — reverter o scroll reverte o movimento pelo mesmo caminho. O raio é lido do próprio elemento renderizado (`offsetWidth`), nunca duplicado como número fixo.
- **Guard de `prefers-reduced-motion` (Fase 2 — feito):** o parallax e a órbita da D1 são os primeiros consumidores reais do canal `aoMudarMovimento()` preparado na Fase 1 (§6). Cada um expõe um par `construir*()`/`destruir*()`: com movimento reduzido ativo (na carga ou ligado em tempo real), os `ScrollTrigger`s são destruídos e foto/núcleos voltam à pose estática do CSS — sem inércia, sem resíduo de transform.
- **Juxtapose D4 (Fase 3 — feito):** ao chegar na D4, a seção `pin: true` por ~100vh de scroll adicional (`end` como função de `window.innerHeight`, recalculada a cada `refresh`); nesse trecho o scroll deixa de rolar a página e passa a ser o controle direto da revelação — `scrub: true`, `ease: "none"`, zero animação automática. `.placeholder--d4b` anima de `clip-path: inset(0 0 0 100%)` (Depois 100% escondido) até `inset(0 0 0 0%)` (100% revelado), na mesma timeline e nas mesmas posições que a barra divisória (`.juxtapose__divisoria`, 2px, `--cor-ciano`) — garante sincronia perfeita entre a linha de corte e o "cursor" visual que a acompanha. A divisória usa a mesma técnica do parallax da Fase 2 (`xPercent:-50` replica a centralização estática do CSS, só um `x` em px anima por cima — nunca `left`). `anticipatePin: 1` evita o salto/flash comum ao entrar num pin. **Sob `prefers-reduced-motion`:** o pin nem chega a ser criado — fica o estado de repouso do CSS (`clip-path: inset(0 0 0 50%)`, split 50/50 estático, sem interação), que já era o fallback acessível antes da Fase 3 e continua sendo. Testado sem salto de entrada/saída e sem quebrar o Header Smart em desktop, 375px e 390px.
- **Scroll-Back Cirúrgico (Fase 4):** ao clicar em "Saiba Mais", gravar `window.scrollY` em `sessionStorage` (`nucleon:scrollPos`). Ao voltar da interna, restaurar com scroll suave até a posição exata.
- **Cross-Nav (Fase 4):** rodapé "Explore Mais Núcleos" nas internas. Mostra SEMPRE os 2 outros públicos; os já visitados (rastreados em `sessionStorage` → `nucleon:visitados`) ganham badge sutil "visitado" — nunca somem.

---

## 6. REGRAS DE ANIMAÇÃO

- Easing padrão: `power2.out` (entradas) e `none` para tudo com `scrub` (o scroll É o easing).
- Durações: micro 0.3s · entradas 0.8–1.0s · nada acima de 1.2s.
- Parallax: deslocamento máximo de **±16% da altura do container** (`ALCANCE_PARALLAX` em `main.js`).
  **Teto físico, não estético:** o overscan de 30% (decisão 5) dá exatamente 15% de folga de cada lado — esse é o limite matemático absoluto em que a foto ainda cobre 100% do container; acima dele não é "foto fraca", é vazio real revelando o fundo do Arco de Luz por trás. Auditoria feita ao subir o valor de ±12%: ±15% zera a folga por completo (sem margem para variação de subpixel/zoom/navegador — medido 14.99%–15.02% nas 5 dobras com parallax × 3 breakpoints, desktop/375px/390px); ±18% foi testado e **rejeitado** por criar um vazio de ~3% da altura do container em cada extremo — 25% da faixa de 12% que a máscara em gradiente (§8.1) dissolve, ou seja, um quarto dessa faixa vira ausência total de pixel em vez de fade suave. ±16% ficou escolhido por sobrar ~1% de vazio (8% da faixa da máscara), dentro da região onde ela já está entre 0–8% de opacidade — non-zero, mas imperceptível na prática. **Não subir este valor sem repetir a auditoria** (medir slack real vs. zona da máscara nos 3 breakpoints).
- **`prefers-reduced-motion: reduce` é LEI:** com ele ativo, matar parallax, orbitas e o pin do Juxtapose (mostrar "Antes/Depois" lado a lado estático). O arco de luz pode permanecer (é mudança de cor, não movimento).
  **Estado real do guard:** a consulta observada (`matchMedia` + listener de `change`), o acessor `movimentoReduzido()` e o canal de inscrição `aoMudarMovimento(cb)` são preparo da Fase 1. **O guard nasceu de fato na Fase 2** com `initParallax()`/`initOrbitaD1()`, e a Fase 3 seguiu o mesmo padrão em `initJuxtaposeD4()`: cada um mantém seu par `construir*()`/`destruir*()` — matar os `ScrollTrigger`s (incluindo o `pin`, no caso do Juxtapose) e devolver o elemento à pose estática do CSS quando reduzido, recriá-los quando não. As âncoras suaves continuam consumindo o canal do mesmo jeito.
- Nunca animar `top/left/width` — apenas `transform` e `opacity` (e `clip-path` no Juxtapose).
- Durações vêm de tokens, não de números avulsos: `--transicao-micro` (0,3s), `--transicao-header` (0,45s), `--transicao-tema` (0,6s).

---

## 7. PLANO DE FASES

| Fase | Escopo | Status |
|---|---|---|
| 1 | Fundação: estrutura, tokens, tipografia, grid das dobras, Header Smart, arco de luz | ✅ entregue |
| 2 | Esqueleto narrativo: parallax base nas 6 dobras, órbitas da D1, ritmo do scroll com placeholders | ✅ entregue |
| 3 | Juxtapose da Dobra 4 (pin + clip-path com scrub) | ✅ entregue |
| 4 | Páginas internas (3), Scroll-Back, Cross-Nav | — |
| 5 | Integração das fotos reais + fusão cromática CSS↔imagem | — |
| 6 | Polimento: performance, mobile fino, microinterações, auditoria final de acessibilidade | — · menu mobile JÁ ENTREGUE na Fase 1 |

**Trabalhe UMA fase por vez.** Cada fase merece seu momento criativo — não antecipe escopo de fases futuras.

> **Antecipação registrada:** o menu mobile saiu da Fase 6 para a Fase 1 por decisão da Engenharia — os links de nav estavam com `display: none` abaixo de 640px sem substituto algum, o que é um bug de acessibilidade, não um refinamento adiável. A Fase 6 deve *polir* esse menu, não construí-lo.

---

## 8. ASSETS VISUAIS — DINÂMICA HÍBRIDA

A Engenharia redige a **base técnica dos prompts de imagem** (arquivo `PROMPTS_FREEPIK.md` na raiz): luz, enquadramento com overscan de 30%, travas de seed (SEED-JOVEM: D1/D6/Interna-Jovem · SEED-GESTOR: D4A/D4B) e alinhamento com o Arco de Luz. A Direção de Arte refina texturização/fotorrealismo e gera no Freepik. Ao alterar engenharia que afete imagens (parallax, arco de luz, Juxtapose), atualize o `PROMPTS_FREEPIK.md` na mesma entrega. Nomenclatura e checklist de exportação estão no final daquele arquivo.

### 8.1 MÁSCARA EM GRADIENTE — regra permanente de integração de imagens

Toda mídia de dobra vive dentro de `.dobra__media`, que carrega **obrigatoriamente**:

```css
-webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
        mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
```

**Por quê:** sem ela, uma cena escura entrando numa tela clara (ou o inverso) sobe como um retângulo de borda dura, e qualquer calibragem do Arco de Luz vira escolha entre dois defeitos. Com ela, o topo e a base de cada imagem dissolvem no fundo global — a costura entre dobras deixa de existir **em qualquer direção de scroll**, e o arco fica livre para ser calibrado pela narrativa, não pela ocultação de bordas.

**Consequências que valem para todas as gerações de imagem:**

1. **Faixa útil = 76% central.** Os 12% do topo e os 12% da base são dissolvidos até a transparência total. O sujeito, o rosto, as mãos e qualquer detalhe que precise ser lido moram na faixa central. Isso é *além* da zona de sacrifício do overscan — as duas se somam.
2. **A máscara é do container, não da foto.** Ela corta os 12% da altura da DOBRA. Como a imagem entra com ~130% de altura e desliza no parallax, o que está sendo dissolvido muda conforme o scroll — mais um motivo para nada essencial encostar nas pontas.
3. **Não substitui o fundo correto.** A foto continua tendo que nascer com `pure white infinite studio` (D1–D3) ou `deep dark studio` (D4–D6). A máscara resolve a BORDA; a fusão do miolo continua sendo responsabilidade da luz da cena.
4. **Vale também para as internas** (Fase 4) e para o par do Juxtapose (Fase 3) — o `clip-path` da barra divisória compõe com a máscara sem conflito, porque atua nos filhos.

Elementos de UI **nunca** entram na `.dobra__media` — só mídia. Texto, CTA e eyebrow vivem na `.dobra__conteudo`, que não é mascarada.

### 8.2 SCRIM DA D4 — exceção auditada (65%, não 82%)

O `.dobra__scrim` genérico (`[data-tema="escuro"]`, `--cor-deep-dark` a 82%) serve D5 e D6 sem ajuste. A **D4 é exceção**, escopada por `#dobra-4 .dobra__scrim` — investigação de ago/2026, motivada por suspeita de que o scrim estivesse achatando a diferença tonal entre "Antes" e "Depois" (o par Juxtapose).

**Medição (canvas, luminância WCAG relativa, pixel a pixel, na região real coberta pelo texto — eyebrow/título/parágrafo — replicando o recorte `object-fit: cover` + overscan de 130% da foto real):**

1. **Sem scrim, o texto falha:** pior caso de contraste (pixel mais claro sob o texto, tipicamente o halo da luminária acesa em "Depois" ou o brilho do notebook) cai para **1,08–1,33:1** — muito abaixo do mínimo de 4,5:1. **O scrim não é decoração, é necessidade de leitura**: sem ele, o texto seria ilegível em cima das fotos reais.
2. **Achatamento confirmado:** a 82%, a diferença de luminância média entre A e B na região do texto cai entre 38% e 55% (varia por breakpoint — ex.: de 43,8% "bruto" para 27% em 1280×800). O halo quente da luminária, que é o principal sinal visual de "Depois", fica visualmente abafado.
3. **Piso de leitura, medido em 5 tamanhos de tela** (375px, 390px, 1280×800, 1366×768, 1920×1080 — a proporção da tela muda QUAL parte da foto o `object-fit: cover` revela sob o texto, então o piso varia por breakpoint, não é constante): pior caso ≈ **57,5–58%**, nos dois breakpoints de laptop mais comuns (1280×800 e 1366×768) — não é uma relação simples de "tela mais larga = mais exigente": 1920×1080 testou mais folgado (~53%) que os dois anteriores, porque muda o eixo que o `cover` corta (largura vs. altura).
4. **65% escolhido:** folga real acima do piso medido (pior caso ≥5,9:1 nos breakpoints mais exigentes — ~30% de margem sobre os 4,5:1 mínimos) e recupera parte da diferenciação tonal (35,6% de diferença preservada em 1280×800, contra 27% em 82%). Não é o mínimo absoluto (~58%) — a folga é deliberada, dado que a medição amostra alguns tamanhos de tela reais, não todos os possíveis.

**Resultado:** a diferença entre "Antes" e "Depois" ficou mais perceptível, mas **ainda é modesta mesmo sem nenhum scrim** — as duas fotos são, por composição, cenas "deep dark studio" (decisão travada), então o diferencial real está concentrado na luz da luminária (localizada), não num clareamento geral do quadro. Se a Direção Criativa quiser uma diferença tonal mais dramática entre A e B, isso é decisão de **regerar as fotos** com mais contraste de cor/luz entre si — fora do escopo desta auditoria, que tratou só do CSS.

**Se a janela do scrim mudar** (a faixa 12%–76%/rampa até 92%, ou a posição do texto na D4), refaça esta auditoria — o piso de 65% foi calibrado para a composição atual, não é uma constante universal.

## 9. CONVENÇÕES DE CÓDIGO

- HTML semântico: `<section class="dobra">`, `<header>`, `<main>`, `<footer>`. Cada dobra tem `id` e `data-tema="claro|escuro"`.
- CSS: metodologia BEM simplificada (`.dobra__conteudo`, `.cta--primario`). Tokens SEMPRE via custom properties — nenhum hex solto fora de `tokens.css`.
- JS: vanilla, módulos por função (`initHeaderSmart()`, `initArcoDeLuz()`...), comentários em PT-BR.
- **Cor no JS: ler, nunca duplicar.** O `main.js` obtém as cores do Arco de Luz com `lerToken()` (`getComputedStyle` sobre as custom properties). Constante de cor hardcoded em JS é a mesma violação que hex solto no CSS.
- Commits/entregas: descrever a fase e o que mudou.
- Testar em: Chrome, Firefox, e viewport mobile 390px no mínimo.
