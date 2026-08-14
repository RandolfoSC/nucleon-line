# Relatório de Status — Instituto Núcleon-line (Projeto 0066)

**Data deste relatório:** 14 de agosto de 2026
**Para quem é este documento:** qualquer pessoa da equipe que precise entender rapidamente o que já existe no site, o que falta, e onde encontrar cada coisa — sem precisar ler código.

---

## 1. Resumo em uma frase

O site institucional do Instituto Núcleon-line está com sua **página inicial completa e navegável**, mais **duas páginas funcionais extras** (um chat de demonstração e um formulário de inscrição simulado). O projeto ainda está rodando **só no computador local** — nada foi publicado na internet até agora.

---

## 2. Fases do projeto — o que já foi entregue

O trabalho foi planejado em 6 fases, para não misturar decisões de estrutura com decisões de polimento. Aqui está o andamento real:

| Fase | O que é | Status |
|---|---|---|
| **1 — Fundação** | Estrutura da página, cores, fontes, o efeito de "esconder o menu ao rolar", e o gradiente de fundo que escurece a página conforme o visitante rola a tela | ✅ **Concluída** — inclui também o menu mobile (originalmente planejado para a Fase 6, mas adiantado por ser uma correção de acessibilidade, não um polimento) |
| **2 — Movimento das seções** | Efeitos de profundidade (parallax) e pequenas animações de órbita nas 6 seções da Home | ⏳ Não iniciada |
| **3 — Comparação "Antes/Depois"** | A seção de Empresas (B2B) vai ganhar um efeito de "arrastar para revelar" comparando o antes e o depois de treinar uma equipe | ⏳ Não iniciada |
| **4 — Páginas internas** | 3 páginas dedicadas (uma para Jovens, uma para Empresas, uma para Gestão Pública) + navegação entre elas | ⏳ Não iniciada — ver pendências (seção 5) |
| **5 — Fotos reais** | Troca de todos os espaços reservados (placeholders coloridos) pelas fotos profissionais definitivas | ⏳ Não iniciada — ver pendências (seção 5) |
| **6 — Polimento final** | Performance, ajustes finos de celular, revisão de acessibilidade | ⏳ Não iniciada |

Ou seja: **a Fase 1 está pronta**, e o restante do trabalho recente foi em **páginas extras que não estavam no plano original de 6 fases** — explicadas na seção 4.

---

## 3. Decisões de design já travadas

Estas são regras que a Direção Criativa já aprovou e que orientam todo o trabalho técnico daqui para frente:

1. **O site "acorda" e "escurece".** A página começa branca e luminosa (mundo do aluno) e vai escurecendo conforme o visitante rola até chegar num visual escuro e corporativo (mundo institucional).
2. **A segunda seção da Home é só contemplativa.** Uma imagem de um olho, sem nenhum botão — um respiro antes de o site continuar contando sua história.
3. **A história tem um loop.** A pessoa jovem que aparece no início do site é a mesma pessoa (agora como mentora) que aparece no final, estendendo a mão para quem está visitando.
4. **Nada de tamanhos fixos.** O site se adapta à altura de qualquer tela — celular, tablet, monitor grande.
5. **Fotos com margem de segurança.** Toda foto é encomendada com uma "sobra" de imagem (tanto na vertical quanto, mais recentemente, na horizontal) para que o corte automático em diferentes tamanhos de tela nunca esconda o que importa na cena.
6. **Sem ferramentas externas além do estritamente necessário.** Nada de bibliotecas visuais de terceiros — só a fonte do Google e uma biblioteca de animação.
7. **A composição da última seção (Dobra 6) é travada.** O texto de fechamento fica sempre na parte de cima, e o elemento visual (a "mão estendida") sempre na parte de baixo — nunca se sobrepõem, em nenhum tamanho de tela.

---

## 4. Páginas que existem hoje

### 🏠 Home (`index.html`)
A página principal, com as 6 seções ("dobras") planejadas: Herói, Imersão, Diferencial, Empresas (B2B), Gestão Pública (B2G) e Fechamento. É a única página que faz parte do plano original de 6 fases.

### 🤖 Hub de IA (`pages/hub-ia.html`)
Uma página de **demonstração para apresentação** — um chat que parece conversar com um assistente de IA chamado "Núcleon IA", mas na verdade só responde com um roteiro fixo de respostas prontas sobre cursos, metodologia e conexão com empresas. **Não há nenhuma inteligência artificial real nem envio de dados** — é uma simulação visual. Acessível por um link discreto ("Conheça o Hub") na última seção da Home.

### 📝 Inscrição (`pages/inscricao.html`)
Um formulário de inscrição (nome, e-mail, telefone, área de interesse) que **também é uma simulação**: ao clicar em enviar, nenhum dado é de fato salvo ou enviado a lugar nenhum — a página só mostra uma tela de "inscrição recebida" para fins de demonstração. É o destino do botão principal ("Inscreva-se no Hub Agora") da última seção da Home.

### ⚠️ "Em Breve" — não encontrada
O pedido deste relatório menciona uma quarta página chamada "Em Breve". **Ela não existe no projeto** — não foi criada em nenhum momento até agora. Se ela é necessária, precisa ser solicitada como um novo item de trabalho.

---

## 5. Pendências conhecidas

- **Páginas internas da Fase 4** (Jovem, Empresário/B2B, Gestor Público/B2G): ainda não existem. Na pasta `pages/` só há um arquivo de anotação (`LEIA-ME.txt`) lembrando que elas serão criadas nessa fase, junto com a navegação entre elas e o recurso de "voltar exatamente de onde saiu" ao clicar em "Saiba Mais" na Home.
- **Fotos reais da Fase 5**: as seções da Home ainda usam espaços reservados coloridos (placeholders) no lugar das fotos profissionais definitivas. **Uma primeira foto real já foi entregue** (`assets/img/d1-hero.webp`, a foto da primeira seção), mas **ainda não foi encaixada no site** — ela está guardada na pasta de assets, pronta para a Fase 5 de integração.
- **GitHub Pages ainda não ativado**: o projeto tem um histórico de versões (Git) salvo apenas **no computador local**. Não existe nenhuma conexão configurada com o GitHub — ou seja, o site não está publicado em nenhum endereço da internet ainda. Esse é um passo separado, que só acontece quando alguém conectar este repositório a uma conta do GitHub e ligar o Pages.

---

## 6. Histórico de commits (registros de trabalho salvos)

Cada linha abaixo é um "commit" — um ponto salvo no histórico do projeto, com data, resumo do que mudou, e quais arquivos foram afetados.

| Commit | Data/Hora | O que foi feito | Arquivos principais |
|---|---|---|---|
| `d2138b0` | 14/08, 05:44 | Ponto de partida salvo: toda a Fase 1 (estrutura, cores, fontes, header, gradiente) + a correção de um problema visual na última seção (o texto e o "orbe" luminoso se sobrepunham em algumas telas) | `index.html`, `css/`, `js/main.js`, `CLAUDE.md`, logos, documento de prompts de imagem |
| `8c2b52b` | 14/08, 06:06 | Criação da página Hub de IA (chat de demonstração) + troca dos ícones de marca no topo do site pelas logos reais | `pages/hub-ia.html`, `js/hub-ia.js`, `css/style.css`, `index.html` |
| `7b96922` | 14/08, 06:09 | Ajuste nas instruções de geração de imagem: toda foto agora também precisa de margem de segurança nas laterais (não só em cima/embaixo), para o corte automático em celular nunca esconder o assunto principal | `PROMPTS_FREEPIK.md` |
| `741411c` | 14/08, 06:18 | Criação da página de Inscrição (formulário simulado) + o botão principal da última seção da Home passou a apontar para ela | `pages/inscricao.html`, `js/inscricao.js`, `css/style.css`, `index.html` |
| `046dae4` | 14/08, 06:36 | Correção de um problema técnico: em celulares com tela mais estreita (por volta de 346 a 390 pixels), o formulário de inscrição "estourava" a lateral da tela e cortava o botão e o título | `css/style.css` |
| `369f1d0` | 14/08, 06:36 | Adição da primeira foto real do projeto (da seção de abertura da Home) — guardada, ainda não usada no site | `assets/img/d1-hero.webp` |

**Estado atual:** todos os 6 commits estão na branch `master`, que é a única branch do projeto. Não há nenhum commit pendente de revisão nem conflito — o histórico está limpo e sequencial.

---

## 7. Onde encontrar cada coisa (mapa rápido de pastas)

```
index.html              → a Home
pages/hub-ia.html        → o chat de demonstração
pages/inscricao.html     → o formulário simulado
pages/LEIA-ME.txt        → lembrete de que faltam 3 páginas internas (Fase 4)
assets/img/               → fotos reais (só 1 até agora, ainda não usada)
assets/svg/                → as duas versões da logo (clara e escura)
css/tokens.css           → todas as cores e medidas do site, num só lugar
css/style.css             → todo o visual do site
js/main.js                → comportamento da Home (menu, gradiente, etc.)
js/hub-ia.js               → lógica do chat de demonstração
js/inscricao.js            → lógica do formulário simulado
CLAUDE.md                  → o documento-guia com todas as regras e decisões do projeto
PROMPTS_FREEPIK.md         → as instruções técnicas para gerar as fotos profissionais
```
