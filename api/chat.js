export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { pergunta, historico } = req.body || {};
  if (!pergunta || typeof pergunta !== 'string') {
    return res.status(400).json({ error: 'Pergunta é obrigatória' });
  }

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          {
            role: 'system',
            content: `Você é a Núcleon IA, assistente virtual do Instituto Núcleon-line — plataforma de QUALIFICAÇÃO PROFISSIONAL cuja promessa de marca é "Estude o que dá retorno real."

O que o Instituto Núcleon-line oferece, especificamente:
- Trilhas de qualificação profissional: Tecnologia & Dados, Gestão Ágil, Vendas & Growth e Operações.
- Metodologia ágil: ciclos curtos, projetos reais e feedback constante — aprender fazendo, não teoria empilhada.
- Conexão direta com empresas parceiras: a cada trilha concluída, o perfil do aluno entra numa vitrine para empresas que buscam talento qualificado ("Você é o Hub").
- Também atende empresas (B2B — treinamento de equipes, redução de retrabalho) e gestão pública (B2G — qualificação para fortalecer cidades).

Regras de resposta:
- Responda SEMPRE em português do Brasil, de forma clara, direta e encorajadora.
- NUNCA invente cursos, disciplinas, matérias ou parcerias que não foram listados acima (nada de "Matemática", "ENEM", "Vestibular" etc. — não é esse tipo de plataforma).
- Se não souber um detalhe específico (preço, datas, carga horária), diga que a pessoa pode confirmar isso se inscrevendo pelo botão "Inscreva-se no Hub Agora" no site, em vez de inventar um número.
- Mantenha respostas objetivas (até 200 palavras, salvo se pedirem mais detalhe).
- Responda em TEXTO PURO, sem markdown (sem **negrito**, sem #, sem listas com "-" ou "*", sem tabelas) — a resposta é exibida como texto simples numa bolha de chat, e qualquer símbolo de formatação apareceria literalmente na tela.`
          },
          ...(Array.isArray(historico) ? historico.slice(-6) : []),
          { role: 'user', content: pergunta }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Erro Groq:', errText);
      return res.status(502).json({ error: 'Erro ao consultar a IA. Tente novamente.' });
    }

    const data = await groqRes.json();
    const resposta = data.choices?.[0]?.message?.content?.trim() || 'Desculpe, não consegui gerar uma resposta agora.';
    return res.status(200).json({ resposta });
  } catch (err) {
    console.error('Erro interno:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
