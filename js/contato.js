/* ==========================================================================
   CONTATO.JS — Instituto Núcleon-line · Formulário simulado
   pages/contato.html · Mesmo padrão de js/inscricao.js: sem backend,
   nenhum dado é lido, transmitido ou salvo. Ao enviar, só troca o estado
   visual do cartão para a confirmação.
   ========================================================================== */

function initContato() {
  const cartao = document.querySelector(".cartao-inscricao");
  const form = document.getElementById("form-contato");
  const sucesso = document.querySelector(".inscricao-etapa--sucesso");
  if (!cartao || !form || !sucesso) return;

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    cartao.dataset.estado = "sucesso";
    // Move o foco para a confirmação: quem usa teclado/leitor de tela
    // precisa saber que o envio (simulado) aconteceu.
    sucesso.focus();
  });
}

initContato();
