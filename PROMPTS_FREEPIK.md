# PROMPTS_FREEPIK.md — Base Técnica dos Prompts de Imagem
## Instituto Núcleon-line · Redigido pela Engenharia Front-end

**Dinâmica:** esta é a base técnica (luz, enquadramento, matemática do parallax, travas de identidade).
A Direção de Arte aplica o refinamento de texturização/fotorrealismo por cima e roda a geração no Freepik.

---

## ⚙️ REGRAS GLOBAIS (valem para TODAS as gerações)

1. **OVERSCAN 30%:** toda imagem de dobra precisa de margem vertical extra para o parallax (deslocamento de ±12% via GSAP dentro de container `overflow: hidden`). Todos os prompts abaixo já incluem o comando de composição estendida. **Na exportação:** mínimo 2560px de largura; proporção final mais alta que 16:9 (alvo: ~16:11 ou 4:3 vertical-friendly). O sujeito principal deve ocupar a faixa central — os 15% do topo e os 15% da base são "zona de sacrifício" que o corte pode revelar ou esconder.
2. **MARGEM HORIZONTAL DE SEGURANÇA (nova):** além do overscan vertical (regra 1), toda imagem precisa de espaço negativo generoso nas laterais. O sujeito principal deve ocupar **no máximo 50–55% da largura do frame**, centralizado horizontalmente, com **no mínimo 20–22% de margem livre de cada lado**. Motivo: as composições de hoje são pensadas para telas largas (desktop paisagem), mas em produção o CSS aplica `object-fit: cover` na dobra — em telas estreitas (mobile retrato) o corte que sobra é **lateral**, não vertical, e sem essa margem ele alcançaria o sujeito. Todos os prompts abaixo já incluem a frase `generous horizontal negative space on both sides, subject occupying no more than 55% of frame width`.
3. **MÁSCARA EM GRADIENTE (CLAUDE.md §8.1):** o container `.dobra__media` dissolve **os 12% do topo e os 12% da base** até a transparência total, para que nenhuma imagem apareça como retângulo de borda dura sobre o fundo global. Isso **se soma** à zona de sacrifício do overscan: na prática, considere que só a **faixa central da composição é garantida**. Rosto, olhos, mãos e o núcleo de energia — qualquer coisa que precise ser LIDA — ficam no miolo. Fundos, light trails, bokeh e atmosfera são justamente o que deve ocupar as pontas: eles dissolvem bem. A máscara não dispensa o fundo correto (regra 4) — ela resolve a borda, a luz da cena resolve o miolo.
4. **ILUMINAÇÃO PROGRESSIVA (Arco de Luz):**
   - Dobras 1 e 3 → `pure white infinite studio background` (universo do aluno).
   - Dobra 2 → ponte de transição: **high-key claro** com reflexos ciano (ver nota da D2).
   - Dobras 4, 5 e 6 → `deep dark studio background` (universo corporativo/legado).
   - **Calibragem atual do arco:** o fundo global percorre `#FAFBFC → #3A4150 → #06080F` numa janela curta, fechando exatamente quando a D4 encosta no topo da tela. A D4 portanto **já nasce sobre fundo 100% escuro** — pode e deve ser gerada com o preto mais fundo, sem medo de contraste na entrada.
5. **PRACTICAL LIGHTS:** as cores da marca (Laranja `#FF7A29`, Ciano `#38DCE6`, Verde `#8FE07A`, Mostarda `#E5B13F`, Azul Escuro `#0B1B33`) nunca são "cor de fundo" — são **luzes reais na cena**, rebatendo na pele, tecido e objetos (rim lights + color cast). Uma cor dominante por dobra.
6. **TRAVAS DE IDENTIDADE (Seed / Character Reference):**
   - **SEED-JOVEM:** Dobra 1, Dobra 6 e Interna Jovem → mesma pessoa (o loop narrativo jovem→mentor).
   - **SEED-GESTOR:** Dobras 4A e 4B → mesma pessoa, mesma pose, mesmo ângulo de câmera, matematicamente idênticos (o Juxtapose depende disso).
   Gere primeiro a imagem-mãe (D1 e D4A), salve o Seed, e derive as filhas com Image-to-Image / Structure Reference.
7. **PROIBIÇÕES UNIVERSAIS** (adicionar a todo prompt negativo): `text, typography, watermark, logo on objects, natural daylight, cartoon, illustration, 3d render look, low resolution, distorted anatomy, extra fingers`.

---

## 🎬 HOME PAGE

### DOBRA 1 — Hero: O Despertar do Jovem `[SEED-JOVEM — imagem-mãe]`
*Luz dominante: Laranja + Ciano · Fundo: branco infinito*

**Positivo:**
```
High-end commercial advertising photography, dynamic medium shot of a determined young Brazilian adult (early 20s) with an awakening, ambitious expression, hands raised as if orchestrating three floating glowing nuclei of energy (orange, cyan, green spheres of pure light) hovering around them without touching. Practical lighting ONLY from the nuclei themselves: strong orange key light and cyan rim light bouncing realistically on the face, hair and clothing fabric. Pure white infinite studio background, high-key, no visible floor line. Extended vertical composition with 30% extra vertical headroom and footroom around the subject (safe margin for parallax cropping), subject centered in the middle band of the frame, generous horizontal negative space on both sides, subject occupying no more than 55% of frame width. Photorealistic, f/2.8, 8k resolution, cinematic masterpiece, Apple-style premium design philosophy.
```
**Negativo:**
```
touching the nuclei, physical holograms, screens, tablets, phones, chaotic background, dark background, harsh shadows, tight crop, subject filling the whole frame, cut-off limbs at frame edges, text, typography, watermark, natural daylight, cartoon, illustration, low resolution, distorted anatomy, extra fingers.
```
> **Nota de engenharia:** salve o SEED desta geração. Ele será reutilizado na Dobra 6 e na Interna Jovem.

---

### DOBRA 2 — A Porta de Entrada: O Olho (macro fotográfico)
*Luz dominante: Ciano + Azul Escuro · Ponte do arco de luz (high-key claro)*

**Positivo:**
```
Dramatic extreme macro close-up photography of a single human eye, wide open, focused, conveying ambition and discovery. Crisply reflected inside the pupil and iris: a glowing futuristic digital interface and data hub (the ecosystem), rendered ONLY as a reflection — no physical screens in the scene. High-key bright skin tones on a light, softly luminous background (this frame bridges the white universe into the dark one), with cyan and dark blue practical lights casting a sleek high-tech color cast on the skin around the eye. Extended vertical composition with 30% extra vertical margin above the eyebrow and below the lower lid (safe margin for parallax cropping), generous horizontal negative space on both sides, subject occupying no more than 55% of frame width. Photorealistic macro photography, extreme sharpness on the iris, 8k resolution, cinematic masterpiece, Apple-style premium design.
```
**Negativo:**
```
full face, second eye, literal login forms, physical screens, dark black background, unsharp iris, dry skin texture exaggeration, tight crop on the eye filling the frame, text, typography, watermark, natural daylight, cartoon, illustration, low resolution.
```
> **Nota de engenharia:** o prompt original pedia cena escura, mas a D2 está na zona clara do Arco de Luz (o fundo global só escurece na D4). Por isso travei **high-key claro com reflexos ciano** — a imagem funde no fundo claro e o ciano já anuncia a tecnologia. Se a Direção de Arte preferir a versão escura, precisamos mover o início do escurecimento do CSS para a D2 (mudança de 1 linha no `main.js` — me avise).

---

### DOBRA 3 — O Diferencial: Você é o Hub
*Luz dominante: Mostarda + toques de verde e azul escuro · Fundo: branco infinito*

**Positivo:**
```
High-end commercial advertising photography, dynamic medium-wide shot. A calm, highly focused young student sitting perfectly static at the exact center of the frame while elegant sweeping long-exposure light trails (light painting style) orbit around them like a futuristic web of corporate connections. The orbiting trails act as the ONLY practical lights, casting mustard/gold, dark blue and light green reflections onto the student's face and clothing. Pure white infinite studio background, high-key, no visible floor line. Extended vertical composition with 30% extra vertical headroom and footroom (safe margin for parallax cropping); the orbital trails may cross into the top and bottom margins, the student stays in the central band, with generous horizontal negative space on both sides, subject occupying no more than 55% of frame width (the orbiting trails may extend further into the lateral margins). Ultra-sharp focus on the static student versus motion-blurred trails. Photorealistic, 8k resolution, cinematic masterpiece, Apple-style product design philosophy.
```
**Negativo:**
```
moving student, blurry face, chaotic background, dark background, uncentered subject, holding phones, physical screens, harsh shadows, tight crop, text, typography, watermark, natural daylight, cartoon, illustration, low resolution, distorted anatomy.
```

---

### DOBRA 4A — B2B "O Antes" `[SEED-GESTOR — imagem-mãe]`
*Luz: cinza frio dessaturado + azul pálido · Fundo: deep dark studio*

**Positivo:**
```
High-end commercial advertising photography, strict medium shot of a stressed corporate manager sitting at a desk, tense, overwhelmed, worn expression. Desk and background (bokeh) subtly disorganized and chaotic. Deep dark studio background. Harsh high-contrast studio lighting dominated by cold desaturated gray and pale blue practical lights, casting dramatic heavy shadows across the face. Camera locked at eye level, subject perfectly centered. Extended vertical composition with 30% extra vertical headroom and footroom (safe margin for parallax and pinned scroll section), generous horizontal negative space on both sides, subject occupying no more than 55% of frame width. Photorealistic, 8k resolution, cinematic masterpiece, corporate reality style.
```
**Negativo:**
```
green lighting, warm lighting, orange lighting, happy, relaxed, clean desk, white background, changed camera angle, tilted camera, tight crop, text, typography, watermark, natural daylight, cartoon, illustration, low resolution, distorted anatomy, extra fingers.
```
> **Nota de engenharia:** salve o SEED. A 4B DEVE ser gerada por Image-to-Image / Structure Reference desta imagem. O Juxtapose desliza um `clip-path` entre as duas — qualquer desvio de enquadramento quebra a mágica.

---

### DOBRA 4B — B2B "O Depois" `[SEED-GESTOR — derivada da 4A]`
*Luz: Verde vibrante + Mostarda · Fundo: deep dark studio (mesmo cenário, transformado)*

**Positivo:**
```
High-end commercial advertising photography, strict medium shot of the EXACTLY SAME corporate manager from the reference image: identical face, identical pose, identical camera angle and framing, identical eye-level lockoff. His expression is now relieved, confident, in absolute control. The desk is completely organized with a sleek minimal digital workspace; the background (bokeh) shows clean futuristic architectural lines. Deep dark studio background. High-end practical lighting derived from the brand: vibrant light green key light and warm mustard/gold rim light bathing his face and the scene in an efficient, successful glow. Extended vertical composition with 30% extra vertical headroom and footroom, generous horizontal negative space on both sides, subject occupying no more than 55% of frame width, mathematically matching the reference framing. Photorealistic, 8k resolution, cinematic masterpiece, Apple-style product design philosophy.
```
**Negativo:**
```
cold lighting, gray tones, pale blue light, stressed expression, cluttered desk, messy background, changed camera angle, changed pose, changed person, different framing, white background, text, typography, watermark, natural daylight, cartoon, illustration, low resolution.
```

---

### DOBRA 5 — B2G: O Legado
*Luz dominante: Azul Escuro + Ciano · Fundo: deep dark studio com cidade em bokeh*

**Positivo:**
```
High-end commercial advertising photography, extreme close-up of a powerful, firm handshake between two leaders over a sleek dark conference table. The grip conveys absolute trust and institutional partnership. Deep dark studio atmosphere; the background in extreme bokeh reveals a futuristic prosperous city skyline at night with diffused lights, heavily emphasizing dark blue and cyan tones. Cinematic hero lighting: subtle cyan rim lights tracing the texture of the hands and suit sleeves, dark blue color cast filling the shadows. Razor-sharp focus locked on the handshake. Extended vertical composition with 30% extra vertical margin above and below the hands (safe margin for parallax cropping), generous horizontal negative space on both sides, subject occupying no more than 55% of frame width. Photorealistic, 8k resolution, premium corporate institutional style, masterpiece.
```
**Negativo:**
```
outdoor scene, natural daylight, loose grip, visible faces, wide shot, messy table, warm orange lighting, white background, tight crop on hands filling the frame, text, typography, watermark, cartoon, illustration, low resolution, distorted anatomy, extra fingers.
```

---

### DOBRA 6 — Fechamento: A 4ª Parede `[SEED-JOVEM — derivada da D1]`
*Luz dominante: Laranja (o núcleo como fonte primária) + rim ciano · Fundo: deep dark studio*
*Composição travada (CLAUDE.md §2, decisão 7): o texto de fechamento ocupa a faixa superior da dobra por cima da foto — o terço superior do enquadramento precisa ficar livre para ele. A mão e o núcleo vivem na faixa inferior.*

**Positivo:**
```
Dramatic extreme close-up portrait, commercial masterpiece. The EXACTLY SAME young person from the Fold 1 reference image (same face, same identity — now slightly more mature and visionary, the mentor), positioned in the upper-middle portion of the frame, making intense direct eye contact with the viewer, breaking the 4th wall with absolute confidence. The face occupies the top third of the composition against a clean, uncluttered deep dark studio background — this upper zone must stay visually calm and empty enough to hold overlaid text. One hand extended forward and DOWNWARD toward the lower third of the frame, palm up, holding a single intensely glowing orange nucleus of energy — both the hand and the nucleus sit clearly in the BOTTOM band of the composition, well below the face, never centered and never crossing into the top third. Deep dark studio background with subtle distant light trails. Chiaroscuro lighting where the orange nucleus is the PRIMARY practical light source, reflecting brilliantly on the face and open palm, with a sharp cyan rim light separating the silhouette from the darkness. Extended vertical composition with 30% extra vertical headroom and footroom (safe margin for parallax cropping); face anchored in the upper band, hand and nucleus anchored in the lower band, with clear open negative space between them, and generous horizontal negative space on both sides, subject occupying no more than 55% of frame width. Photorealistic, highly detailed eyes, 8k resolution, premium advertising style.
```
**Negativo:**
```
hand centered in frame, hand in upper half, nucleus at eye level, nucleus touching or overlapping the face, symmetrical centered composition, looking away, profile view, closed hand, hand hidden, different person from reference, white background, soft focus on eyes, multiple people, chaotic background, cluttered upper third, tight crop, text, typography, watermark, natural daylight, cartoon, illustration, low resolution, distorted anatomy, extra fingers.
```
> **Nota de engenharia:** usar o SEED-JOVEM da D1 + Character Reference. É o fechamento do loop narrativo — o rosto PRECISA ser reconhecível como o mesmo da abertura. A separação rosto-em-cima / mão-embaixo não é só estética: o CSS reserva a faixa inferior estruturalmente (`margin-bottom` no bloco de texto, que força a seção a crescer além de `100svh` em janelas baixas em vez de comprimir) — se a foto entregar a mão no centro ou no topo, ela some atrás do texto ou cria um vazio errado embaixo.

---

## 📄 PÁGINAS INTERNAS
*Regra do desdobramento: cada interna é um NOVO ÂNGULO (close-up de detalhe) do mesmo universo da dobra-mãe — mesma luz, mesmo sujeito, novo recorte.*

### INTERNA JOVEM — derivada da D1 `[SEED-JOVEM]`
*Luz: mesmas da D1 (Laranja/Ciano + núcleo verde em foco) · Fundo: branco infinito*

**Positivo:**
```
High-end commercial advertising photography, strict close-up on one determined hand of the same subject from the Fold 1 reference, maintaining the exact same practical lighting scheme (orange, green, cyan nuclei as light sources). Focus locked on a single green floating nucleus near the open hand, never touching it. Beside it, the subtle silhouette of a corporate shirt forming from thin lines of light, suggesting the first job materializing. Pure white infinite studio background. Extended vertical composition with 30% extra vertical margin around the hand (safe margin for parallax cropping), generous horizontal negative space on both sides, subject occupying no more than 55% of frame width. Extreme resolution, f/1.4 shallow depth of field, photorealistic, 8k, masterpiece.
```
**Negativo:**
```
touching the nuclei, physical holograms, screens, tablets, phones, full body, wide shot, dark background, chaotic background, hands covered in anything, text, typography, watermark, natural daylight, cartoon, illustration, low resolution, distorted anatomy, extra fingers.
```

### INTERNA EMPRESÁRIO (B2B) — derivada da D4B `[SEED-GESTOR]`
*Luz: Verde + Mostarda · Fundo: deep dark studio*

**Positivo:**
```
High-end commercial advertising photography, strict close-up on the confident hand of the same corporate manager from the Fold 4B reference, resting decisively on a sleek organized dark desk beside a minimal digital workspace. Same lighting scheme as the reference: vibrant light green key light and warm mustard/gold rim light reflecting on the skin, the watch and the suit sleeve, conveying control and efficiency. Deep dark studio background with clean futuristic bokeh lines. Extended vertical composition with 30% extra vertical margin around the hand and desk surface (safe margin for parallax cropping), generous horizontal negative space on both sides, subject occupying no more than 55% of frame width. Photorealistic, f/2.0 shallow depth of field, 8k resolution, cinematic masterpiece, Apple-style premium design.
```
**Negativo:**
```
stressed clenched fist, cluttered desk, papers everywhere, cold gray lighting, pale blue light, white background, visible face, wide shot, text, typography, watermark, natural daylight, cartoon, illustration, low resolution, distorted anatomy, extra fingers.
```

### INTERNA GESTOR PÚBLICO (B2G) — derivada da D5
*Luz: Azul Escuro + Ciano, com um toque de mostarda (o legado nascendo) · Fundo: deep dark studio*

**Positivo:**
```
High-end commercial advertising photography, strict close-up derived from the Fold 5 handshake universe: two hands over the same sleek dark conference table, one hand formally passing a single glowing cyan nucleus of energy to the other open hand — the moment the partnership becomes legacy. Same lighting scheme as the reference: dark blue color cast, cyan rim lights on skin and suit sleeves, plus a faint warm mustard/gold glow rising from the table surface suggesting social prosperity. Background in extreme bokeh: the prosperous city skyline at night. Extended vertical composition with 30% extra vertical margin above and below the hands (safe margin for parallax cropping), generous horizontal negative space on both sides, subject occupying no more than 55% of frame width. Photorealistic, razor-sharp focus on the nucleus exchange, 8k resolution, premium institutional style, masterpiece.
```
**Negativo:**
```
handshake grip, visible faces, outdoor scene, natural daylight, white background, wide shot, messy table, physical documents with readable text, loose composition, text, typography, watermark, cartoon, illustration, low resolution, distorted anatomy, extra fingers.
```

---

## ✅ CHECKLIST DE EXPORTAÇÃO (antes de entregar à Engenharia)

- [ ] Largura mínima **2560px**, formato final **WebP** (qualidade 80–85)
- [ ] Proporção com folga vertical (≥ 16:11) — conferir se topo e base têm conteúdo "sacrificável"
- [ ] **Teste da máscara:** cubra os 12% do topo e os 12% da base da imagem com uma faixa lisa. A cena continua legível e o sujeito intacto? Se algo essencial sumiu, recomponha antes de entregar
- [ ] **Teste da margem horizontal:** cubra ~22% de cada lateral da imagem com uma faixa lisa. O sujeito principal continua inteiro, sem nada essencial cortado? Isso simula o `object-fit: cover` em mobile retrato, onde o corte que sobra é lateral — se o sujeito ultrapassar a faixa central de 55% da largura, recompor antes de entregar
- [ ] **Teste da composição D6:** cubra o terço superior da imagem com uma faixa lisa (é onde o texto de fechamento vai sobrepor). A mão e o núcleo continuam claramente na faixa inferior, sem nada essencial no terço de cima? Se a mão aparecer no centro ou no topo, a foto colide com o texto em qualquer breakpoint — recompor antes de entregar
- [ ] SEED-JOVEM idêntico em D1, D6 e Interna Jovem
- [ ] SEED-GESTOR + enquadramento matematicamente idêntico em 4A/4B (teste: alternar as duas em abas — nada além da luz/expressão/mesa pode "pular")
- [ ] Fundos das D1/D3/Interna-Jovem fundem com `#FAFBFC`; fundos das D4–D6/internas escuras fundem com `#06080F`
- [ ] Nomenclatura: `d1-hero.webp`, `d2-olho.webp`, `d3-hub.webp`, `d4a-antes.webp`, `d4b-depois.webp`, `d5-legado.webp`, `d6-mentor.webp`, `int-jovem.webp`, `int-empresario.webp`, `int-gestor.webp` → salvar em `assets/img/`
