/* ==========================================================================
   MAIN.JS — Instituto Núcleon-line · Fases 1–3
   Módulos: Movimento reduzido · Header Smart · Menu mobile · Arco de Luz
            · Tema por dobra · Parallax das fotos · Órbita da Dobra 1
            · Juxtapose da Dobra 4 · Âncoras suaves
   Fases futuras adicionam: Scroll-Back (F4), Cross-Nav (F4)
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* --------------------------------------------------------------------------
   MOVIMENTO REDUZIDO (regra do CLAUDE.md §6)
   O usuário pode ligar/desligar a preferência com o site aberto — por isso a
   consulta é observada, não lida uma vez só.
   Expõe o estado (movimentoReduzido()) e um canal de inscrição
   (aoMudarMovimento()). O guard de fato nasce na Fase 2: initParallax(),
   initOrbitaD1() e (Fase 3) initJuxtaposeD4() se inscrevem neste canal em
   vez de ler a media query de novo — cada um destrói/recria seus próprios
   ScrollTriggers ao alternar. Com movimento reduzido, o Juxtapose nem chega
   a criar o pin: fica no split 50/50 estático definido em CSS (§6).
   -------------------------------------------------------------------------- */
const consultaMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
let movimentoReduzidoAtivo = consultaMovimento.matches;
const ouvintesMovimento = [];

/** Estado atual da preferência de movimento. */
function movimentoReduzido() {
  return movimentoReduzidoAtivo;
}

/** Registra um callback disparado quando a preferência muda. */
function aoMudarMovimento(callback) {
  ouvintesMovimento.push(callback);
}

consultaMovimento.addEventListener("change", (evento) => {
  movimentoReduzidoAtivo = evento.matches;
  ouvintesMovimento.forEach((callback) => callback(movimentoReduzidoAtivo));
  // As fases futuras criam/destroem triggers ao reagir: remedir posições.
  ScrollTrigger.refresh();
});

/* --------------------------------------------------------------------------
   TOKENS DE COR
   Fonte única de verdade é o tokens.css (§9). O JS lê, nunca duplica.
   -------------------------------------------------------------------------- */
function lerToken(nome) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

const ARCO = {
  claro:     lerToken("--cor-branco-luminoso"),
  transicao: lerToken("--cor-arco-transicao"),
  escuro:    lerToken("--cor-deep-dark"),
};

/* Fechamento do menu mobile, compartilhado com o Header Smart. */
let fecharMenu = () => {};

/* --------------------------------------------------------------------------
   HEADER SMART
   Esconde ao rolar para baixo, reaparece ao rolar para cima.
   Ganha fundo com blur quando fora do topo.
   -------------------------------------------------------------------------- */
function initHeaderSmart() {
  const header = document.getElementById("header");
  if (!header) return;

  ScrollTrigger.create({
    start: "top top-=10",
    end: "max",
    onUpdate(self) {
      // direção 1 = descendo → esconde; -1 = subindo → mostra.
      // Com o menu mobile aberto o header nunca se esconde: levaria o painel junto.
      const deveEsconder =
        self.direction === 1 &&
        self.scroll() > 120 &&
        !header.classList.contains("menu-aberto");

      header.classList.toggle("oculto", deveEsconder);
      header.classList.toggle("rolado", self.scroll() > 40);
    },
  });
}

/* --------------------------------------------------------------------------
   MENU MOBILE (antecipado da Fase 6)
   Abaixo de 640px a nav horizontal vira painel. Fechado, sai da ordem de
   tabulação; o botão com aria-expanded é o substituto acessível.
   -------------------------------------------------------------------------- */
function initMenuMobile() {
  const header = document.getElementById("header");
  const botao = document.getElementById("header-toggle");
  const nav = document.getElementById("header-nav");
  if (!header || !botao || !nav) return;

  const abrir = () => {
    header.classList.add("menu-aberto");
    header.classList.remove("oculto");
    botao.setAttribute("aria-expanded", "true");
    // Leva o foco para dentro do painel: sem isso o Tab pularia o menu inteiro,
    // porque o botão vem DEPOIS da nav no DOM (ordem correta para o desktop).
    const primeiroLink = nav.querySelector("a");
    if (primeiroLink) primeiroLink.focus();
  };

  fecharMenu = (devolverFoco) => {
    if (!header.classList.contains("menu-aberto")) return;
    header.classList.remove("menu-aberto");
    botao.setAttribute("aria-expanded", "false");
    if (devolverFoco) botao.focus();
  };

  botao.addEventListener("click", () => {
    if (header.classList.contains("menu-aberto")) fecharMenu();
    else abrir();
  });

  // Escolher um destino fecha o painel (a rolagem suave é do initAncorasSuaves)
  nav.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) fecharMenu();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharMenu(true);
  });

  document.addEventListener("click", (evento) => {
    if (!header.contains(evento.target)) fecharMenu();
  });

  // Ao voltar para o desktop, a nav retoma a forma horizontal: limpar o estado.
  window
    .matchMedia("(min-width: 641px)")
    .addEventListener("change", (evento) => {
      if (evento.matches) fecharMenu();
    });
}

/* --------------------------------------------------------------------------
   ARCO DE LUZ (decisão travada nº 1)
   Três estágios reais: branco luminoso → meio-tom → Deep Dark Studio.
   A janela vai de "D4 a 70% da tela" até "D4 encostar no topo": quando a D4
   assume a tela inteira, o fundo já está 100% escuro. A máscara em gradiente
   da .dobra__media (CLAUDE.md §8) cobre as duas pontas, então não existe
   borda dura entrando nem saindo.
   Scrub: o scroll é o easing. Mesmo com movimento reduzido o arco permanece —
   é cor, não movimento (§6).
   -------------------------------------------------------------------------- */
function initArcoDeLuz() {
  const camada = document.querySelector(".arco-de-luz");
  const d4 = document.getElementById("dobra-4");
  if (!camada || !d4) return;

  gsap.set(camada, { backgroundColor: ARCO.claro });

  const linha = gsap.timeline({
    defaults: { ease: "none", duration: 1 },   // metade da janela para cada estágio
    scrollTrigger: {
      trigger: d4,
      start: "top 70%",
      end: "top top",
      scrub: true,
    },
  });

  linha
    .to(camada, { backgroundColor: ARCO.transicao })
    .to(camada, { backgroundColor: ARCO.escuro });
}

/* --------------------------------------------------------------------------
   TEMA POR DOBRA
   Troca a tinta do texto (claro/escuro) conforme a dobra ativa, lendo o
   data-tema declarado no HTML. Serve ao header e ao rodapé, que estão fora
   das seções; as próprias dobras já resolvem sua tinta pelo seletor genérico
   [data-tema="escuro"] do tokens.css.

   VIRADA_TEMA não é um número solto — mas também NÃO é "o meio matemático da
   janela do Arco" (essa era a lógica original, e estava errada). Correção
   auditada (mobile real, ago/2026): interpolação linear de RGB não é
   perceptualmente uniforme, e o WCAG pesa canais de forma não-linear —
   então "50% do progresso" cai bem mais perto do extremo escuro do que
   parece (a cor no meio do trajeto, #3A4150, já tem luminância WCAG de
   ~0,053, não ~0,5). Com VIRADA_TEMA=35% (=50% de progresso), a tinta
   escura ficava sobre esse fundo já quase-escuro: contraste 1.8:1, uma
   falha severa de acessibilidade, mais perceptível em mobile porque um
   swipe cobre esse trecho todo de uma vez.
   Medido numericamente: existe uma "zona morta" de ~3,6% do progresso do
   arco (entre ~34% e ~37%) onde NENHUMA das duas tintas atinge 4.5:1 contra
   o fundo de transição — não há um ponto de troca perfeito com a paleta
   atual do Arco (--cor-arco-transicao), só um melhor equilíbrio possível.
   35% → 45% do progresso do arco = ~45% de VIRADA_TEMA (fórmula:
   X = 70*(1-P)) cai bem no meio dessa zona morta, deixando os dois lados
   com contraste ~4.1–4.2:1 por uma fração mínima do scroll (~20px) — uma
   falha muito menor e muito mais breve que os 1.8:1 anteriores, mas ainda
   assim abaixo do ideal. Corrigir por completo exigiria ajustar a cor de
   transição do Arco (decisão travada, precisa de sinal da Direção Criativa)
   ou interpolar a cor do texto em vez de trocar num ponto só — nenhum dos
   dois foi feito aqui. Se a janela do arco mudar, este valor precisa ser
   recalculado (não só reescalado) — refaça a auditoria de contraste. */
const VIRADA_TEMA = "45%";

function initTemaPorDobra() {
  document.querySelectorAll(".dobra[data-tema]").forEach((dobra) => {
    ScrollTrigger.create({
      trigger: dobra,
      start: `top ${VIRADA_TEMA}`,
      end: `bottom ${VIRADA_TEMA}`,
      onToggle(self) {
        if (self.isActive) {
          document.body.dataset.tema = dobra.dataset.tema;
        }
      },
    });
  });
}

/* --------------------------------------------------------------------------
   PARALLAX DAS FOTOS (Fase 2)
   Desloca .dobra__foto dentro do próprio container (.dobra__media[data-parallax])
   via transform — nunca top/left/width (§6). A D4 fica de fora: o par
   Antes/Depois é estático até o pin com clip-path da Fase 3 (Juxtapose).
   A foto chega centralizada pelo CSS com height:130% + transform:
   translate(-50%,-50%) (o overscan da decisão 5). Essa centralização é
   replicada aqui via xPercent/yPercent — GSAP compõe percentual e pixels
   num único transform — para o deslocamento do parallax (um `y` em px)
   entrar por cima sem brigar com a base. A própria height:130% do CSS não
   é tocada, só o transform anima dentro dela, como pedido.
   Alcance: ±16% da altura do CONTAINER, não da foto (regra do §6, valor
   recalibrado — auditoria abaixo). Teto físico ABSOLUTO: ±15%, ponto exato
   em que a folga de 15% de cada lado do overscan de 30% (decisão 5) se
   esgota — medido empiricamente em todas as dobras com parallax e nos 3
   breakpoints de referência (14.99%-15.02%, a variação é ruído de
   subpixel/scrollbar, não erro de fórmula). Além de ±15% não sobra foto:
   é vazio real revelando o fundo do Arco de Luz, não "foto fraca" pela
   máscara. ±18% foi testado e REJEITADO: cria um vazio de ~3% da altura do
   container em cada extremo — 25% da zona de 12% que a máscara em
   gradiente (§8.1) dissolve, ou seja, o primeiro quarto dessa faixa vira
   ausência total de pixel em vez de um fade. ±16% tem folga real (~1% de
   vazio, 8% da zona da máscara) bem dentro da faixa onde a máscara já está
   entre 0-8% de opacidade — imperceptível na prática, mas non-zero, ao
   contrário de ±15%, que não deixa margem alguma para variação de
   navegador/zoom. Não subir este valor sem repetir esta auditoria.
   `end`/`start` cobrem o trajeto inteiro da dobra na viewport (de "começa a
   entrar por baixo" a "termina de sair por cima") para o movimento ficar
   perceptível sem ser abrupto. `invalidateOnRefresh` recalcula o alcance
   (função, não valor fixo) sempre que ScrollTrigger.refresh() rodar —
   inclusive no refresh disparado pela troca de prefers-reduced-motion.
   -------------------------------------------------------------------------- */
// Único lugar onde o alcance é declarado — nunca duplicar o número (§9).
const ALCANCE_PARALLAX = 0.16;

let tweensParallax = [];

function construirParallax() {
  document.querySelectorAll(".dobra__media[data-parallax]").forEach((media) => {
    const dobra = media.closest(".dobra");
    if (!dobra) return;

    // querySelectorAll, não querySelector: a D1 (v1.1) tem DOIS candidatos
    // na mesma .dobra__media — o vídeo (.hero__video) e o fallback estático
    // mobile (.hero__foto-mobile) — e o CSS decide via display:none/block
    // qual aparece em cada largura de tela (§ HERO EM VÍDEO). Animar os
    // dois em paralelo é inofensivo: o que estiver com display:none não
    // é pintado, e destruirParallax() já fazia essa varredura completa
    // (era só construirParallax() que ainda pegava um único elemento).
    media.querySelectorAll(".dobra__foto").forEach((foto) => {
      gsap.set(foto, { xPercent: -50, yPercent: -50 });

      const tween = gsap.fromTo(
        foto,
        { y: () => -(media.offsetHeight * ALCANCE_PARALLAX) },
        {
          y: () => media.offsetHeight * ALCANCE_PARALLAX,
          ease: "none",
          scrollTrigger: {
            trigger: dobra,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      tweensParallax.push(tween);
    });
  });
}

function destruirParallax() {
  // kill() na tween criada com scrollTrigger nas vars também mata o
  // ScrollTrigger associado — não precisa matar os dois separadamente.
  tweensParallax.forEach((tween) => tween.kill());
  tweensParallax = [];

  // Estado exigido sob movimento reduzido: foto parada, centralizada, sem
  // nenhum resquício do deslocamento de parallax.
  document.querySelectorAll(".dobra__media[data-parallax] .dobra__foto").forEach((foto) => {
    gsap.set(foto, { xPercent: -50, yPercent: -50, y: 0 });
  });
}

function initParallax() {
  if (!movimentoReduzido()) construirParallax();

  aoMudarMovimento((reduzido) => {
    if (reduzido) destruirParallax();
    else construirParallax();
  });
}

/* --------------------------------------------------------------------------
   ÓRBITA DA DOBRA 1 (Fase 2)
   Os três núcleos flutuantes (.placeholder__nucleo[data-orbita]) já têm uma
   posição de repouso fixada via top/right no CSS — essa posição É o centro
   da órbita, não o ponto animado em si. Só o deslocamento extra (um círculo
   achatado ao redor desse centro) é animado, sempre via transform.
   Diferente da órbita em CSS de pages/em-breve.html (que gira no tempo, com
   @keyframes), esta é sincronizada ao scroll da própria Dobra 1: o ângulo é
   uma função direta do progresso do ScrollTrigger, então reverter o scroll
   reverte o movimento exatamente pelo mesmo caminho — sem inércia, sem
   estado próprio de animação.
   Raio = metade do diâmetro do próprio núcleo, lido do layout renderizado a
   cada atualização (nunca duplicado como número fixo em JS, mesma regra do
   §9 aplicada a uma medida em vez de uma cor) — por isso acompanha sozinho
   o clamp() do CSS em qualquer largura de tela, do mobile ao desktop, sem
   precisar ouvir resize à parte.
   Defasagem de 120° entre os três (mesma linguagem visual da órbita do Em
   Breve), para não orbitarem em bloco, como um único corpo rígido.
   -------------------------------------------------------------------------- */
let triggersOrbitaD1 = [];

function construirOrbitaD1() {
  const dobra1 = document.getElementById("dobra-1");
  const nucleos = dobra1 ? dobra1.querySelectorAll("[data-orbita]") : [];
  if (!nucleos.length) return;

  nucleos.forEach((nucleo, indice) => {
    const faseInicial = (indice / nucleos.length) * Math.PI * 2;

    const trigger = ScrollTrigger.create({
      trigger: dobra1,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate(self) {
        const raio = nucleo.offsetWidth * 0.5;
        const angulo = faseInicial + self.progress * Math.PI * 2;
        gsap.set(nucleo, {
          x: Math.cos(angulo) * raio,
          y: Math.sin(angulo) * raio * 0.6, // achata a órbita — mais "suave" que um círculo perfeito
        });
      },
    });

    triggersOrbitaD1.push(trigger);
  });
}

function destruirOrbitaD1() {
  triggersOrbitaD1.forEach((trigger) => trigger.kill());
  triggersOrbitaD1 = [];

  // Estado exigido sob movimento reduzido: núcleos parados na posição
  // central definida pelo CSS (top/right), sem deslocamento nenhum.
  document.querySelectorAll("#dobra-1 [data-orbita]").forEach((nucleo) => {
    gsap.set(nucleo, { x: 0, y: 0 });
  });
}

function initOrbitaD1() {
  if (!movimentoReduzido()) construirOrbitaD1();

  aoMudarMovimento((reduzido) => {
    if (reduzido) destruirOrbitaD1();
    else construirOrbitaD1();
  });
}

/* --------------------------------------------------------------------------
   LOGO SINCRONIZADA AO HERO EM VÍDEO (D1 · v1.1)
   Aos 4s do vídeo (momento em que ela sorri olhando pro celular), a logo
   sobreposta (.hero__logo) faz fade-in via classe CSS (~0.6s, --transicao-tema).
   Como o vídeo está em loop, o mesmo listener de timeupdate resolve o
   fade-out sozinho: ao reiniciar, currentTime volta a ficar abaixo de 4s,
   a classe é removida, e a transição de opacity cuida do fade suave — sem
   precisar detectar o evento de loop à parte (o <video> não emite um
   evento nativo confiável pra isso).
   Não depende do guard de prefers-reduced-motion (§6): é troca de opacity
   sincronizada ao tempo do vídeo, não parallax/scroll — o mesmo raciocínio
   que mantém o Arco de Luz ativo sob movimento reduzido (é cor/estado, não
   deslocamento).
   -------------------------------------------------------------------------- */
const MOMENTO_LOGO_HERO = 4; // segundos — ver nota de composição do vídeo

/* --------------------------------------------------------------------------
   VÍDEO DO HERO SÓ EM DESKTOP (D1 · v1.1)
   Testado nos dois breakpoints (CLAUDE.md exige): um vídeo 16:9 forçado a
   cobrir uma tela retrato estreita precisa cortar tanto da lateral pra
   cobrir a altura que ela (a jovem) some do enquadramento por completo —
   por isso <768px usa o fallback estático (.hero__foto-mobile, ver CSS).
   O <video> nasce sem `src` (só `data-src`) e sem `autoplay`: um <video>
   com autoplay começa a baixar dados assim que o navegador processa a tag,
   MESMO com display:none no CSS — só esconder visualmente não evita o
   gasto de dados de quem está no fallback mobile. Atribuir o src (e dar
   play) só quando a media query bate é o que garante que o vídeo nunca é
   baixado por quem nunca vai vê-lo rodar; encolher a janela de volta pro
   mobile remove o src e libera o buffer já baixado.
   -------------------------------------------------------------------------- */
function initHeroVideoResponsivo() {
  const video = document.querySelector(".hero__video");
  if (!video) return;

  const src = video.dataset.src;
  const consultaDesktop = window.matchMedia("(min-width: 768px)");

  function sincronizar(desktop) {
    if (desktop) {
      if (!video.getAttribute("src")) video.src = src;
      video.play().catch(() => {}); // sem gesto do usuário alguns navegadores recusam — fallback visual já é o primeiro frame do próprio vídeo
    } else {
      video.pause();
      if (video.getAttribute("src")) {
        video.removeAttribute("src");
        video.load(); // libera o buffer já baixado
      }
    }
  }

  sincronizar(consultaDesktop.matches);
  consultaDesktop.addEventListener("change", (evento) => sincronizar(evento.matches));
}

function initHeroLogoSync() {
  const video = document.querySelector(".hero__video");
  const logo = document.querySelector(".hero__logo");
  if (!video || !logo) return;

  video.addEventListener("timeupdate", () => {
    logo.classList.toggle("hero__logo--visivel", video.currentTime >= MOMENTO_LOGO_HERO);
  });
}

/* --------------------------------------------------------------------------
   JUXTAPOSE DA DOBRA 4 (Fase 3)
   A D4 "congela" (pin: true) por ~100vh de scroll adicional; nesse trecho o
   scroll deixa de rolar a página e passa a ser o controle direto da barra
   divisória — scrub: true, ease: "none", sem nenhuma animação automática.
   Estado de repouso (CSS): .placeholder--d4b em clip-path: inset(0 0 0 50%)
   e .juxtapose__divisoria centralizada na mesma linha — é o ponto de
   partida ANTES do pin começar, e é o fallback completo sob movimento
   reduzido (ver initJuxtaposeD4()). Do repouso, a timeline anima os dois
   EXTREMOS reais: inset(0 0 0 100%) (Depois 100% escondido) até
   inset(0 0 0 0%) (Depois 100% revelado) — não do meio para as pontas.
   Divisória: mesma técnica de .dobra__foto e do parallax (Fase 2) —
   xPercent:-50 replica a centralização estática do CSS, e só um `x` em
   px anima por cima (nunca left — regra do §6). A barra varre a largura
   inteira do container (.dobra__media), então seu alcance É a própria
   largura medida em tempo real, não um número fixo — a mesma lógica de
   "ler o layout renderizado, nunca duplicar" da órbita da D1.
   Clip-path e divisória vivem na MESMA timeline, nas mesmas posições (0),
   com a mesma duration — garante sincronia perfeita entre a revelação e o
   "cursor" que a acompanha, sem dependerem de dois ScrollTriggers distintos
   que pudessem divergir por arredondamento.
   `anticipatePin: 1` evita o salto/flash comum ao entrar num pin (recomendação
   oficial do GSAP) — é exatamente o defeito que a Fase 3 pediu para não ter.
   `end` como função (não string fixa) recalcula ~100vh de verdade a cada
   ScrollTrigger.refresh(); `invalidateOnRefresh` faz o mesmo para os valores
   de `x` da divisória, que dependem da largura medida do container.
   -------------------------------------------------------------------------- */
let timelineJuxtaposeD4 = null;

function construirJuxtaposeD4() {
  const dobra4 = document.getElementById("dobra-4");
  const media = dobra4 ? dobra4.querySelector(".dobra__media") : null;
  const depois = dobra4 ? dobra4.querySelector(".placeholder--d4b") : null;
  const divisoria = dobra4 ? dobra4.querySelector(".juxtapose__divisoria") : null;
  if (!dobra4 || !media || !depois || !divisoria) return;

  gsap.set(divisoria, { xPercent: -50 });

  const timeline = gsap.timeline({
    defaults: { ease: "none", duration: 1 },
    scrollTrigger: {
      trigger: dobra4,
      start: "top top",
      end: () => "+=" + window.innerHeight,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  timeline
    .fromTo(depois, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)" }, 0)
    .fromTo(
      divisoria,
      { x: () => media.offsetWidth / 2 },
      { x: () => -(media.offsetWidth / 2) },
      0
    );

  timelineJuxtaposeD4 = timeline;
}

function destruirJuxtaposeD4() {
  // kill() na timeline também mata o ScrollTrigger (com pin) associado a
  // ela — mesmo mecanismo do parallax, não precisa matar os dois à parte.
  if (timelineJuxtaposeD4) {
    timelineJuxtaposeD4.kill();
    timelineJuxtaposeD4 = null;
  }

  // Estado exigido sob movimento reduzido: split 50/50 estático, sem pin,
  // sem scrub — exatamente o clip-path/posição já declarados em CSS.
  // clearProps (em vez de reescrever "50%" aqui) devolve o controle ao CSS
  // sem duplicar um valor que já vive só na folha de estilos.
  const depois = document.querySelector("#dobra-4 .placeholder--d4b");
  const divisoria = document.querySelector("#dobra-4 .juxtapose__divisoria");
  if (depois) gsap.set(depois, { clearProps: "clipPath" });
  if (divisoria) gsap.set(divisoria, { clearProps: "transform" });
}

function initJuxtaposeD4() {
  if (!movimentoReduzido()) construirJuxtaposeD4();

  aoMudarMovimento((reduzido) => {
    if (reduzido) destruirJuxtaposeD4();
    else construirJuxtaposeD4();
  });
}

/* --------------------------------------------------------------------------
   ÂNCORAS SUAVES
   Substitui o `scroll-behavior: smooth` global, que conflitava com o
   ScrollTrigger e atrapalharia o Scroll-Back da Fase 4.
   Desconta a altura do header fixo e respeita prefers-reduced-motion.
   -------------------------------------------------------------------------- */
function initAncorasSuaves() {
  const header = document.getElementById("header");

  document.addEventListener("click", (evento) => {
    const link = evento.target.closest('a[href^="#"]');
    if (!link || evento.metaKey || evento.ctrlKey || evento.shiftKey) return;

    const alvo = link.getAttribute("href");

    // O CTA Master ainda não tem destino (o formulário chega depois).
    // Sem o scroll-behavior global, um "#" solto saltaria para o topo.
    if (alvo === "#") {
      evento.preventDefault();
      return;
    }

    const destino = document.querySelector(alvo);
    if (!destino) return;

    evento.preventDefault();
    const recuo = header ? header.offsetHeight : 0;

    if (movimentoReduzido()) {
      window.scrollTo(0, destino.getBoundingClientRect().top + window.scrollY - recuo);
    } else {
      gsap.to(window, {
        duration: 1,                       // dentro da faixa de entradas (§6)
        ease: "power2.out",
        scrollTo: { y: destino, offsetY: recuo },
      });
    }

    // O foco acompanha o destino (leitores de tela e teclado), sem roubar a rolagem.
    destino.setAttribute("tabindex", "-1");
    destino.focus({ preventScroll: true });
  });
}

/* --------------------------------------------------------------------------
   BOOT
   -------------------------------------------------------------------------- */
initHeaderSmart();
initMenuMobile();
initArcoDeLuz();
initTemaPorDobra();
initParallax();
initOrbitaD1();
initHeroVideoResponsivo();
initHeroLogoSync();
initJuxtaposeD4();
initAncorasSuaves();

aoMudarMovimento((reduzido) => {
  console.info(
    `Núcleon-line: prefers-reduced-motion ${reduzido ? "ativado" : "desativado"} em tempo real.`
  );
});

if (movimentoReduzido()) {
  console.info("Núcleon-line: prefers-reduced-motion ativo — rolagem suave desligada.");
}
