# Relatório de Status — Instituto Núcleon-line (Projeto 0066)

**Data deste relatório:** 14 de agosto de 2026
**Para quem é este documento:** qualquer pessoa da equipe que precise entender rapidamente o que já existe no site, o que falta, e onde encontrar cada coisa — sem precisar ler código.

---

## 1. Resumo em uma frase

O site institucional do Instituto Núcleon-line está com sua **página inicial completa, navegável e agora com todas as 6 fotos reais integradas** (Fase 5 parcialmente concluída), mais **três páginas funcionais extras** (um chat de demonstração, um formulário de inscrição simulado e uma página "Em Breve" para as rotas ainda não construídas). O projeto ainda está rodando **só no computador local** — nada foi publicado na internet até agora. Todo o trabalho passou a ser feito na branch `desenvolvimento`; a `master` fica intocada até uma decisão explícita de merge.

---

## 2. Fases do projeto — o que já foi entregue

O trabalho foi planejado em 6 fases, para não misturar decisões de estrutura com decisões de polimento. Aqui está o andamento real:

| Fase | O que é | Status |
|---|---|---|
| **1 — Fundação** | Estrutura da página, cores, fontes, o efeito de "esconder o menu ao rolar", e o gradiente de fundo que escurece a página conforme o visitante rola a tela | ✅ **Concluída** — inclui também o menu mobile (originalmente planejado para a Fase 6, mas adiantado por ser uma correção de acessibilidade, não um polimento) |
| **2 — Movimento das seções** | Efeitos de profundidade (parallax) e pequenas animações de órbita nas 6 seções da Home | ⏳ Não iniciada |
| **3 — Comparação "Antes/Depois"** | A seção de Empresas (B2B) vai ganhar um efeito de "arrastar para revelar" comparando o antes e o depois de treinar uma equipe | ⏳ Não iniciada — o corte estático (metade/metade) já existe, mas o arrastar interativo ainda não |
| **4 — Páginas internas** | 3 páginas dedicadas (uma para Jovens, uma para Empresas, uma para Gestão Pública) + navegação entre elas | ⏳ Não iniciada — ver pendências (seção 5). Os links "Saiba Mais" da Home hoje levam a uma página "Em Breve" provisória |
| **5 — Fotos reais** | Troca de todos os espaços reservados (placeholders coloridos) pelas fotos profissionais definitivas | 🟡 **Parcialmente concluída** — as 6 fotos da Home já estão integradas (ver seção 4). Faltam as fotos das páginas internas, que ainda nem existem |
| **6 — Polimento final** | Performance, ajustes finos de celular, revisão de acessibilidade | ⏳ Não iniciada — mas uma correção pontual de contraste (Arco de Luz, ver seção 4) já foi feita fora de ordem por ser uma falha de acessibilidade |

Ou seja: **a Fase 1 está pronta**, a **Fase 5 avançou hoje** com a integração das 6 fotos da Home, e o restante do trabalho recente foi em **páginas extras que não estavam no plano original de 6 fases** — explicadas na seção 4.

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

**Novidade de hoje — fotos reais integradas.** As 6 dobras agora exibem a foto profissional definitiva no lugar do placeholder colorido:

| Dobra | Foto | Arquivo |
|---|---|---|
| D1 — Herói | jovem, foto de abertura | `assets/img/d1-hero.webp` |
| D2 — Imersão | o olho com o ecossistema refletido | `assets/img/d2-olho.webp` |
| D3 — Diferencial | "Você é o Hub" | `assets/img/d3-hub.webp` |
| D4A/D4B — Empresas | par Antes/Depois (Juxtapose) | `assets/img/d4a-antes.webp`, `assets/img/d4b-depois.webp` |
| D5 — Gestão Pública | legado institucional | `assets/img/d5-legado.webp` |
| D6 — Fechamento | o mentor (mesma pessoa da D1, loop narrativo) | `assets/img/d6-mentor.webp` |

**Novidade de hoje — scrim de contraste.** Como as fotos reais têm luz e sombra próprias (diferente dos placeholders, que eram gradientes lisos), foi adicionada uma camada de contraste (`.dobra__scrim`) atrás do texto nas Dobras 3, 4, 5 e 6 — uma faixa semi-transparente na cor de fundo daquela dobra (clara ou escura), só na altura onde o texto fica, para garantir que o texto continue legível em cima de qualquer foto. D1 e D2 não precisam: D1 tem botões com fundo opaco e frase curta, D2 não tem texto algum (decisão 2). O scrim já está preparado para sobreviver à Fase 2 (parallax): ele fica parado, alinhado ao texto, mesmo quando a foto se mover por trás dele.

**Novidade de hoje — correção do Arco de Luz.** Foi corrigido um problema de contraste na transição entre o mundo claro (D1–D3) e o mundo escuro (D4–D6): o ponto em que a cor do texto vira de escura para clara (`VIRADA_TEMA`, em `js/main.js`) estava calculado como "o meio matemático" do trajeto de cor, mas essa lógica não considerava que a interpolação de cor não é percebida de forma linear pelo olho humano — na prática, o texto virava de cor sobre um fundo que já estava quase totalmente escuro, causando um contraste ruim (1.8:1, abaixo do mínimo de acessibilidade de 4.5:1), mais perceptível no celular porque um único gesto de rolar a tela cobre esse trecho inteiro. O valor foi recalibrado (de 35% para 45%) com base em medição real em mobile, reduzindo a falha para um intervalo muito menor e mais suave (~4.1–4.2:1). **Isso não é a correção definitiva** — o próprio código documenta que existe uma "zona morta" de contraste nessa transição que só uma mudança na cor de transição do Arco (decisão travada, precisa de aval da Direção Criativa) resolveria por completo.

### 🤖 Hub de IA (`pages/hub-ia.html`)
Uma página de **demonstração para apresentação** — um chat que parece conversar com um assistente de IA chamado "Núcleon IA", mas na verdade só responde com um roteiro fixo de respostas prontas sobre cursos, metodologia e conexão com empresas. **Não há nenhuma inteligência artificial real nem envio de dados** — é uma simulação visual. Acessível por um link discreto ("Conheça o Hub") na última seção da Home.

### 📝 Inscrição (`pages/inscricao.html`)
Um formulário de inscrição (nome, e-mail, telefone, área de interesse) que **também é uma simulação**: ao clicar em enviar, nenhum dado é de fato salvo ou enviado a lugar nenhum — a página só mostra uma tela de "inscrição recebida" para fins de demonstração. É o destino do botão principal ("Inscreva-se no Hub Agora") da última seção da Home.

### 🚧 Em Breve (`pages/em-breve.html`)
Página-teaser criada para os 4 links "Saiba Mais" da Home (Dobras 1, 3, 4 e 5), que antes apontavam para páginas internas (`jovem.html`, `empresario.html`, `gestor-publico.html`) que nunca foram criadas — esses links estavam quebrados. Agora todos apontam para esta página provisória, que avisa que o conteúdo está em construção. Segue o mesmo padrão visual das outras páginas de demonstração (tema escuro fixo, sem Arco de Luz, sem GSAP). Deixa de existir assim que as páginas internas da Fase 4 forem construídas.

---

## 5. Pendências conhecidas

- **Páginas internas da Fase 4** (Jovem, Empresário/B2B, Gestor Público/B2G): ainda não existem. Os links "Saiba Mais" da Home apontam hoje para a página provisória "Em Breve" (ver seção 4). Na pasta `pages/` só há um arquivo de anotação (`LEIA-ME.txt`) lembrando que elas serão criadas nessa fase, junto com a navegação entre elas e o recurso de "voltar exatamente de onde saiu" ao clicar em "Saiba Mais" na Home.
- **Fotos das páginas internas**: as 6 fotos da Home já estão integradas (Fase 5 parcial, ver seção 4), mas as páginas internas da Fase 4 ainda nem existem, então não têm foto.
- **Correção definitiva do contraste do Arco de Luz**: o ajuste de hoje (`VIRADA_TEMA` 35% → 45%) melhorou bastante o contraste na transição claro/escuro, mas não eliminou por completo a "zona morta" de baixo contraste — isso exige uma decisão da Direção Criativa sobre a cor de transição do Arco (`--cor-arco-transicao`) ou uma reformulação de como o texto muda de cor (interpolação em vez de troca num ponto só).
- **GitHub Pages ainda não ativado**: o projeto tem um histórico de versões (Git) salvo apenas **no computador local**. Não existe nenhuma conexão configurada com o GitHub Pages — ou seja, o site não está publicado em nenhum endereço da internet ainda. Esse é um passo separado, que só acontece quando alguém conectar este repositório a uma conta do GitHub e ligar o Pages.

---

## 6. Branch de trabalho

Todo o trabalho a partir de hoje acontece na branch **`desenvolvimento`**, criada a partir da `master`. A `master` não recebe nenhum commit novo até uma decisão explícita de fazer o merge — ela continua representando o último estado revisado/estável do projeto.

---

## 7. Histórico de commits (registros de trabalho salvos)

Cada linha abaixo é um "commit" — um ponto salvo no histórico do projeto, com data, resumo do que mudou, e quais arquivos foram afetados.

| Commit | Data/Hora | O que foi feito | Arquivos principais |
|---|---|---|---|
| `d2138b0` | 14/08, 05:44 | Ponto de partida salvo: toda a Fase 1 (estrutura, cores, fontes, header, gradiente) + a correção de um problema visual na última seção (o texto e o "orbe" luminoso se sobrepunham em algumas telas) | `index.html`, `css/`, `js/main.js`, `CLAUDE.md`, logos, documento de prompts de imagem |
| `8c2b52b` | 14/08, 06:06 | Criação da página Hub de IA (chat de demonstração) + troca dos ícones de marca no topo do site pelas logos reais | `pages/hub-ia.html`, `js/hub-ia.js`, `css/style.css`, `index.html` |
| `7b96922` | 14/08, 06:09 | Ajuste nas instruções de geração de imagem: toda foto agora também precisa de margem de segurança nas laterais (não só em cima/embaixo), para o corte automático em celular nunca esconder o assunto principal | `PROMPTS_FREEPIK.md` |
| `741411c` | 14/08, 06:18 | Criação da página de Inscrição (formulário simulado) + o botão principal da última seção da Home passou a apontar para ela | `pages/inscricao.html`, `js/inscricao.js`, `css/style.css`, `index.html` |
| `046dae4` | 14/08, 06:36 | Correção de um problema técnico: em celulares com tela mais estreita (por volta de 346 a 390 pixels), o formulário de inscrição "estourava" a lateral da tela e cortava o botão e o título | `css/style.css` |
| `369f1d0` | 14/08, 06:36 | Adição da primeira foto real do projeto (da seção de abertura da Home) — guardada, ainda não usada no site | `assets/img/d1-hero.webp` |
| `48dffe4` | 14/08, 07:15 | Criação da página "Em Breve" (teaser) + correção dos 4 links "Saiba Mais" da Home, que apontavam para páginas internas inexistentes | `pages/em-breve.html`, `css/style.css`, `index.html`, `RELATORIO_STATUS.md` |
| `aa4fff0` | 14/08, 08:08 | **Fase 5 parcial:** as 6 fotos reais da Home integradas (substituindo os placeholders coloridos) + scrim de contraste atrás do texto nas Dobras 3–6 | `assets/img/*.webp`, `css/style.css`, `index.html` |
| `8192519` | 14/08, 08:36 | **Correção do Arco de Luz:** recalibração do ponto de virada da cor do texto (`VIRADA_TEMA`) na transição claro/escuro, corrigindo uma falha de contraste mais perceptível em mobile | `js/main.js` |

**Estado atual:** os 9 commits acima estão na branch `master`. A partir de agora, novos commits acontecem na branch `desenvolvimento` (criada a partir da `master` de hoje) — ver seção 6. Não há nenhum commit pendente de revisão nem conflito; o histórico está limpo e sequencial.

---

## 8. Onde encontrar cada coisa (mapa rápido de pastas)

```
index.html                → a Home (6 dobras, todas com foto real)
pages/hub-ia.html         → o chat de demonstração
pages/inscricao.html      → o formulário simulado
pages/em-breve.html       → teaser para os links "Saiba Mais" (provisório, até a Fase 4)
pages/LEIA-ME.txt         → lembrete de que faltam 3 páginas internas (Fase 4)
assets/img/               → as 6 fotos reais da Home (d1 a d6)
assets/svg/                → as duas versões da logo (clara e escura)
css/tokens.css            → todas as cores e medidas do site, num só lugar
css/style.css             → todo o visual do site, incluindo o scrim de contraste
js/main.js                → comportamento da Home (menu, gradiente, Arco de Luz, etc.)
js/hub-ia.js               → lógica do chat de demonstração
js/inscricao.js            → lógica do formulário simulado
CLAUDE.md                  → o documento-guia com todas as regras e decisões do projeto
PROMPTS_FREEPIK.md         → as instruções técnicas para gerar as fotos profissionais
```
