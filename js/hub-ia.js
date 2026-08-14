/* ==========================================================================
   HUB-IA.JS — Instituto Núcleon-line · Demo do Ambiente de IA
   pages/hub-ia.html · Chat 100% front-end: sem backend, sem chamada de API.
   Respostas vêm de um roteiro local, por busca de palavra-chave.
   ========================================================================== */

const ROTEIRO = [
  {
    palavrasChave: ["curso", "cursos", "aula", "aulas", "trilha", "trilhas", "disciplina", "ensina", "ensinam"],
    resposta:
      "Temos trilhas voltadas para quem quer entrar no mercado com retorno real: Tecnologia & Dados, Gestão Ágil, Vendas & Growth e Operações. Cada trilha combina prática guiada com mentoria — o objetivo não é só aprender, é te conectar com quem está contratando.",
  },
  {
    palavrasChave: ["metodologia", "agil", "metodo", "funciona"],
    resposta:
      "Nossa metodologia é ágil: ciclos curtos, projetos reais e feedback constante — nada de teoria empilhada sem aplicação. Você aprende fazendo, no ritmo do mercado, não no ritmo de um currículo engessado.",
  },
  {
    palavrasChave: ["empresa", "empresas", "contratar", "contratacao", "vaga", "vagas", "emprego", "mercado", "conectar", "conexao"],
    resposta:
      "Você é o Hub: a cada trilha concluída, seu perfil entra na vitrine para empresas parceiras que buscam talento qualificado. A conexão acontece dentro da própria plataforma — sem depender só de currículo frio.",
  },
];

const RESPOSTA_PADRAO =
  "Ainda não tenho uma resposta pronta pra essa pergunta, mas posso te contar sobre nossos cursos, a metodologia ágil ou como conectamos você a empresas parceiras. Quer tentar por aí?";

const MENSAGEM_BOAS_VINDAS =
  "Olá! Eu sou a Núcleon IA, assistente virtual do Instituto Núcleon-line. Posso te contar sobre nossos cursos, a metodologia ágil ou como conectar com empresas parceiras. O que você quer saber?";

const DURACAO_DIGITANDO_MS = 800;

/* Remove acentos para tornar a busca por palavra-chave tolerante a como a
   pessoa digita ("metodo" ou "método" batem na mesma entrada do roteiro). */
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function buscarResposta(pergunta) {
  const textoNormalizado = normalizar(pergunta);
  const entrada = ROTEIRO.find((item) =>
    item.palavrasChave.some((chave) => textoNormalizado.includes(chave))
  );
  return entrada ? entrada.resposta : RESPOSTA_PADRAO;
}

function initChat() {
  const historico = document.getElementById("chat-historico");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  if (!historico || !form || !input) return;

  function rolarParaBaixo() {
    historico.scrollTop = historico.scrollHeight;
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

    historico.appendChild(linha);
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

    historico.appendChild(linha);
    rolarParaBaixo();
  }

  function esconderDigitando() {
    const linha = document.getElementById("chat-digitando");
    if (linha) linha.remove();
  }

  function responderComoAssistente(texto) {
    mostrarDigitando();
    setTimeout(() => {
      esconderDigitando();
      adicionarMensagem(texto, "assistente");
    }, DURACAO_DIGITANDO_MS);
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const pergunta = input.value.trim();
    if (!pergunta) return;

    adicionarMensagem(pergunta, "usuario");
    input.value = "";
    input.focus();

    responderComoAssistente(buscarResposta(pergunta));
  });

  // Mensagem de boas-vindas ao abrir: a assistente "digita" antes de se apresentar.
  responderComoAssistente(MENSAGEM_BOAS_VINDAS);
}

initChat();
