/* ==========================================================================
   INSCRICAO.JS — Instituto Núcleon-line · Formulário simulado
   pages/inscricao.html · Sem backend: nenhum dado é lido, transmitido ou
   salvo. Ao enviar, só troca o estado visual do cartão para a confirmação.
   ========================================================================== */

function initInscricao() {
  const cartao = document.querySelector(".cartao-inscricao");
  const form = document.getElementById("form-inscricao");
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

initInscricao();
