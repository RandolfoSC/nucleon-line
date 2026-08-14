/* ==========================================================================
   MAIN.JS — Instituto Núcleon-line · Fase 1 (Fundação)
   Módulos: Movimento reduzido · Header Smart · Menu mobile · Arco de Luz
            · Tema por dobra · Âncoras suaves
   Fases futuras adicionam: parallax/órbitas (F2), Juxtapose (F3), Scroll-Back (F4)
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* --------------------------------------------------------------------------
   MOVIMENTO REDUZIDO (regra do CLAUDE.md §6)
   O usuário pode ligar/desligar a preferência com o site aberto — por isso a
   consulta é observada, não lida uma vez só.
   Isto é a PREPARAÇÃO do guard: expõe o estado e um canal de inscrição.
   O guard de fato (matar parallax, órbitas e o pin) chega na Fase 2/3, que
   se inscreve aqui via aoMudarMovimento().
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

   VIRADA_TEMA não é um número solto: 35% da altura da tela é exatamente o meio
   da janela do Arco de Luz (D4 a 70% → D4 no topo), o instante em que o fundo
   global cruza o meio-tom. Virar antes jogaria tinta clara sobre fundo claro.
   Se a janela do arco mudar, este valor muda junto.
   -------------------------------------------------------------------------- */
const VIRADA_TEMA = "35%";

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
initAncorasSuaves();

aoMudarMovimento((reduzido) => {
  console.info(
    `Núcleon-line: prefers-reduced-motion ${reduzido ? "ativado" : "desativado"} em tempo real.`
  );
});

if (movimentoReduzido()) {
  console.info("Núcleon-line: prefers-reduced-motion ativo — rolagem suave desligada.");
}
