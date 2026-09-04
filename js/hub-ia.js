/* ==========================================================================
   HUB-IA.JS — Instituto Núcleon-line · Ambiente de IA (Groq)
   pages/hub-ia.html · Chat conectado ao backend em /api/chat (Vercel
   Function), que por sua vez consulta a API da Groq. O front nunca vê a
   chave de API — ela mora só no backend (variável de ambiente).
   ========================================================================== */

const MENSAGEM_BOAS_VINDAS =
  "Olá! Eu sou a Núcleon IA, assistente virtual do Instituto Núcleon-line. Posso te contar sobre nossos cursos, a metodologia ágil ou como conectar com empresas parceiras. O que você quer saber?";

const MENSAGEM_ERRO =
  "Estou com dificuldade para responder agora, tente novamente em instantes.";

const DURACAO_DIGITANDO_MS = 800;
const TAMANHO_MAX_HISTORICO = 6;

/* Histórico simples da conversa (papel + conteúdo), enviado como contexto
   pro backend a cada pergunta — sem isso a IA "esquece" a troca anterior. */
let historicoConversa = [];

/* Consulta o backend (que consulta a Groq) e devolve o texto da resposta.
   Lança erro em qualquer falha (rede, HTTP, corpo inesperado) — quem chama
   decide o que mostrar ao usuário. */
async function buscarResposta(pergunta) {
  const resposta = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pergunta, historico: historicoConversa }),
  });

  if (!resposta.ok) {
    throw new Error(`HTTP ${resposta.status}`);
  }

  const dados = await resposta.json();
  if (!dados.resposta) {
    throw new Error("Resposta vazia");
  }

  return dados.resposta;
}

function initChat() {
  const historicoEl = document.getElementById("chat-historico");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  if (!historicoEl || !form || !input) return;

  function rolarParaBaixo() {
    historicoEl.scrollTop = historicoEl.scrollHeight;
  }

  function criarAvatar() {
    const avatar = document.createElement("span");
    avatar.className = "nucleo-orbe chat__avatar chat__avatar--pequeno";
    avatar.setAttribute("aria-hidden", "true");
    return avatar;
  }

  function adicionarMensagem(texto, autor) {
    const linha = document.createElement("div");
    linha.className = `chat__mensagem chat__mensagem--${autor}`;
    if (autor === "assistente") linha.appendChild(criarAvatar());

    const bolha = document.createElement("p");
    bolha.className = "chat__bolha";
    bolha.textContent = texto;
    linha.appendChild(bolha);

    historicoEl.appendChild(linha);
    rolarParaBaixo();
  }

  function mostrarDigitando() {
    const linha = document.createElement("div");
    linha.className = "chat__mensagem chat__mensagem--assistente";
    linha.id = "chat-digitando";
    linha.appendChild(criarAvatar());

    const bolha = document.createElement("div");
    bolha.className = "chat__bolha chat__bolha--digitando";
    bolha.setAttribute("aria-hidden", "true");
    bolha.innerHTML = "<span></span><span></span><span></span>";
    linha.appendChild(bolha);

    historicoEl.appendChild(linha);
    rolarParaBaixo();
  }

  function esconderDigitando() {
    const linha = document.getElementById("chat-digitando");
    if (linha) linha.remove();
  }

  function aguardar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* Registra a mensagem no histórico enviado como contexto (papéis no
     formato esperado pela API da Groq: "user" / "assistant"). */
  function registrarNoHistorico(papel, conteudo) {
    historicoConversa.push({ role: papel, content: conteudo });
    if (historicoConversa.length > TAMANHO_MAX_HISTORICO) {
      historicoConversa = historicoConversa.slice(-TAMANHO_MAX_HISTORICO);
    }
  }

  /* Mostra "digitando" e só esconde quando a resposta real chegar — nunca
     antes disso. DURACAO_DIGITANDO_MS é só um piso: se a API responder mais
     rápido que isso, o indicador segura até completar a duração mínima,
     pra não "piscar"; se demorar mais, o indicador fica visível até a
     resposta (ou o erro) chegar de fato. */
  async function responderComoAssistente(pergunta) {
    mostrarDigitando();

    const [resultado] = await Promise.allSettled([
      buscarResposta(pergunta),
      aguardar(DURACAO_DIGITANDO_MS),
    ]);

    esconderDigitando();

    if (resultado.status === "fulfilled") {
      adicionarMensagem(resultado.value, "assistente");
      registrarNoHistorico("assistant", resultado.value);
    } else {
      console.error("Erro ao consultar Núcleon IA:", resultado.reason);
      adicionarMensagem(MENSAGEM_ERRO, "assistente");
    }
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const pergunta = input.value.trim();
    if (!pergunta) return;

    adicionarMensagem(pergunta, "usuario");
    registrarNoHistorico("user", pergunta);
    input.value = "";
    input.disabled = true;

    await responderComoAssistente(pergunta);

    input.disabled = false;
    input.focus();
  });

  // Mensagem de boas-vindas ao abrir: fixa, não passa pelo backend nem
  // entra no histórico enviado à API (é só o "oi" da UI).
  mostrarDigitando();
  aguardar(DURACAO_DIGITANDO_MS).then(() => {
    esconderDigitando();
    adicionarMensagem(MENSAGEM_BOAS_VINDAS, "assistente");
  });
}

initChat();
