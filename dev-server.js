/* ==========================================================================
   DEV-SERVER.JS — Servidor local de desenvolvimento (temporário)
   Serve os arquivos estáticos do site + expõe POST /api/chat chamando o
   MESMO handler de api/chat.js que roda em produção na Vercel. Existe só
   para testar a integração Groq sem precisar de `vercel login`. Não é
   usado em produção — lá quem serve api/chat.js é a própria Vercel.
   ========================================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Carrega .env.local manualmente (sem dependência de pacote externo).
function carregarEnvLocal() {
  const arquivoEnv = path.join(__dirname, ".env.local");
  if (!fs.existsSync(arquivoEnv)) return;

  fs.readFileSync(arquivoEnv, "utf8")
    .split("\n")
    .forEach((linha) => {
      const linhaLimpa = linha.trim();
      if (!linhaLimpa || linhaLimpa.startsWith("#")) return;
      const indice = linhaLimpa.indexOf("=");
      if (indice === -1) return;
      const chave = linhaLimpa.slice(0, indice).trim();
      const valor = linhaLimpa.slice(indice + 1).trim();
      if (!(chave in process.env)) process.env[chave] = valor;
    });
}

carregarEnvLocal();

// api/chat.js usa `export default` (sintaxe ESM, como a Vercel espera).
// Sob CommonJS, o Node moderno consegue fazer require() de um módulo ESM,
// mas devolve o objeto de namespace — a função real vem em `.default`.
const chatModulo = require("./api/chat.js");
const chatHandler = chatModulo.default || chatModulo;
const PORTA = process.env.PORT || 3000;

const TIPOS_MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".json": "application/json",
};

function servirArquivoEstatico(req, res) {
  let caminhoUrl = decodeURIComponent(req.url.split("?")[0]);
  if (caminhoUrl === "/") caminhoUrl = "/index.html";

  const caminhoArquivo = path.join(__dirname, caminhoUrl);

  // Nunca servir nada fora da raiz do projeto (path traversal).
  if (!caminhoArquivo.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end("Proibido");
  }

  fs.readFile(caminhoArquivo, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Não encontrado: " + caminhoUrl);
    }
    const extensao = path.extname(caminhoArquivo);
    res.writeHead(200, { "Content-Type": TIPOS_MIME[extensao] || "application/octet-stream" });
    res.end(conteudo);
  });
}

/* Adapta req/res do http nativo para a assinatura que api/chat.js espera
   (o mesmo formato que a Vercel entrega às Serverless Functions): req.body
   já parseado, e res.status(n).json(obj). */
function tratarApiChat(req, res) {
  let corpoBruto = "";
  req.on("data", (pedaco) => (corpoBruto += pedaco));
  req.on("end", async () => {
    try {
      req.body = corpoBruto ? JSON.parse(corpoBruto) : {};
    } catch {
      req.body = {};
    }

    res.status = (codigo) => {
      res.statusCode = codigo;
      return res;
    };
    res.json = (objeto) => {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(objeto));
      return res;
    };

    await chatHandler(req, res);
  });
}

const servidor = http.createServer((req, res) => {
  if (req.url.startsWith("/api/chat")) {
    return tratarApiChat(req, res);
  }
  servirArquivoEstatico(req, res);
});

servidor.listen(PORTA, () => {
  console.log(`Servidor local rodando em http://localhost:${PORTA}`);
  console.log(`GROQ_API_KEY carregada: ${process.env.GROQ_API_KEY ? "sim" : "NÃO — verifique .env.local"}`);
});
