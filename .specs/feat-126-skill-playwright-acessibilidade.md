# Skill de testes de ponta a ponta com Playwright e verificação de acessibilidade

> Status: implementada (código aprovado pelo reviewer, sem achado bloqueante)
> Tipo: funcionalidade
> Tamanho: media
> Branch: feat/126-skill-playwright-acessibilidade
> Criada em: 2026-11-28

## Objetivo

Teste de ponta a ponta mal escrito é lento e instável. A issue #126 pede uma skill que reúna as boas práticas para criar e depurar esses testes no navegador, com a verificação automática de acessibilidade em cada tela. A skill chega sozinha a todo projeto que usa Playwright, reconhecido pelas dependências (a detecção já existe desde a issue #130), e a nenhum outro.

## Regras

- RN-01: Uma skill nova, registrada no catálogo e entregue a todo projeto que usa Playwright. Fonte: issue #126.
- RN-02: O projeto é reconhecido como usuário de Playwright por qualquer um dos dois pacotes da ferramenta, nas dependências normais ou nas de desenvolvimento. Fonte: issue #126 e issue #130 (detecção já registrada no catálogo).
- RN-03: A skill orienta, nesta ordem de assuntos: escolher os fluxos que valem o custo de um teste no navegador e, no mesmo passo, decidir quando o navegador de verdade é necessário e quando basta um teste de componente ou de unidade; esperar por um estado da tela, nunca por um tempo fixo; encontrar os elementos pelo papel e pelo texto que a pessoa vê; rodar a verificação automática de acessibilidade em cada tela visitada; testar mais de um tamanho de tela e mais de um tema, quando existirem; e lidar com instabilidade (descobrir a causa em vez de repetir o teste até passar). Fonte: issue #126; ordem ajustada na revisão para refletir a skill entregue.
- RN-04: A skill não cita caminhos, nomes de pastas nem a estrutura de um projeto específico: vale para qualquer projeto que use a ferramenta. Fonte: issue #126.
- RN-05: A skill é curta, no tamanho das outras skills de stack do kit. Fonte: pedido do dev (dev-frontend-2).
- RN-06: A skill é coerente com o padrão de testes do kit: teste primeiro quando há comportamento novo, um comportamento por teste, testes independentes entre si, sem depender de serviço externo de verdade nem de dados que o teste não criou. Fonte: documento padrão de testes (`testing-standard`).
- RN-07: A skill é coerente com a skill de auditoria de acessibilidade: deixa claro que a verificação automática pega só parte dos problemas e termina indicando o que fica para conferência manual por uma pessoa. Fonte: documento skill de auditoria de acessibilidade e pedido do dev.
- RN-08: Se o projeto ainda não tem o verificador automático de acessibilidade instalado, a skill orienta a seguir o roteiro de dependência nova do kit e pedir a decisão antes de instalar, nunca a instalar por conta própria. Fonte: documento padrão de segurança (roteiro "Dependência nova").
- RN-09: Como toda skill do catálogo, a descrição diz quando usar e o texto diz o que a skill entrega. Fonte: formato do catálogo (teste existente "cada skill do catálogo diz quando usar e o que entrega").
- RN-10: Projeto que não usa Playwright não recebe a skill, e os projetos que já eram reconhecidos continuam recebendo exatamente o mesmo conteúdo de antes. Fonte: issue #130 (RN-05) e comportamento atual.
- RN-11: Os perfis escolhidos à mão não mudam: skills de stack chegam pela detecção, e só um perfil manual que liste a skill a receberia. Fonte: documento de orientação do repositório (`CLAUDE.md`) e o que já acontece com as outras skills de stack.

## Critérios de aceite

- CA-01: QUANDO alguém consulta o catálogo ENTÃO ele DEVE ter a skill nova, com descrição, ligada só à stack Playwright. (RN-01)
- CA-02: QUANDO um projeto lista só o pacote de testes do Playwright nas dependências de desenvolvimento ENTÃO a sincronização DEVE reconhecer a stack Playwright e entregar a skill nova, junto com as skills gerais e mais nenhuma de stack. (RN-01, RN-02)
- CA-03: QUANDO um projeto usa o Playwright pelo outro pacote da ferramenta ENTÃO a sincronização DEVE reconhecer a stack e entregar a skill nova do mesmo jeito. (RN-02)
- CA-04: QUANDO um projeto usa React e Playwright ao mesmo tempo ENTÃO ele DEVE receber as skills de React e a skill nova. (RN-01, RN-10)
- CA-05: QUANDO um projeto não usa Playwright (por exemplo, só React, só NestJS ou sem stack conhecida) ENTÃO ele NÃO DEVE receber a skill nova, e o conteúdo entregue DEVE ser o mesmo de antes. (RN-10)
- CA-06: QUANDO alguém lê a skill ENTÃO ela DEVE tratar de cada um dos assuntos da RN-03, incluindo esperar por estado e nunca por tempo fixo, e encontrar elementos por papel e texto. (RN-03)
- CA-07: QUANDO alguém lê a skill ENTÃO ela NÃO DEVE citar caminhos, pastas nem estrutura de um projeto específico. (RN-04)
- CA-08: QUANDO alguém compara a skill com as outras skills de stack ENTÃO ela DEVE ter tamanho parecido (as atuais têm de 19 a 38 linhas). (RN-05)
- CA-09: QUANDO a skill fala da verificação automática de acessibilidade ENTÃO ela DEVE dizer que essa verificação cobre só parte dos problemas e DEVE terminar com o que fica para conferência manual. (RN-07)
- CA-10: QUANDO o projeto não tem o verificador automático de acessibilidade ENTÃO a skill DEVE orientar a seguir o roteiro de dependência nova e pedir a decisão antes de instalar. (RN-08)
- CA-11: QUANDO a skill trata de testes ENTÃO ela NÃO DEVE contradizer o padrão de testes (teste primeiro, independência, sem rede externa de verdade). (RN-06)
- CA-12: QUANDO a checagem de formato roda ENTÃO a skill DEVE passar: nome igual ao da pasta, descrição com "Use quando" ou "Use para" e o texto com "Entrega:". (RN-09)
- CA-13: QUANDO um projeto é sincronizado com um perfil escolhido à mão ENTÃO ele DEVE receber o mesmo conteúdo de antes, sem a skill nova. (RN-11) Coberto pela regra geral de que skill de stack só chega ao projeto por detecção, nunca por perfil manual, protegida pelos testes de perfil existentes.
- CA-14: QUANDO o catálogo real passa pela checagem ENTÃO ela DEVE terminar sem erro. (RN-01)

## Critérios de sucesso

- A skill existe, é curta, cobre os assuntos da issue e chega só aos projetos que usam Playwright.
- Os testes provam a detecção pelos dois pacotes, a entrega da skill, a ausência dela em quem não usa a ferramenta e o formato.
- Lint, testes e checagem do catálogo passam no CI.

## Fora do escopo

- Regra de padrão (arquivo em regras) para Playwright: a issue pede só a skill.
- Incluir a skill em perfis manuais: as outras skills de stack também não estão neles (RN-11).
- Citar a skill nas definições de agentes (por exemplo, `qa` ou devs): fica para a issue #132, por decisão do usuário.
- Mudar a detecção de stacks: já foi feita na issue #130.
- Atualizar o README: ele não lista as skills de stack uma a uma.

## Plano de execução

- Fase 1 (paralelo): T1 [P] e T2 [P]. Arquivos diferentes, e só a T1 mexe em fonte sincronizada (o catálogo).
- Gate de fase: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`, rodados uma vez ao fim da fase e antes do reviewer. O projeto não tem typecheck, build nem formatador: o lint é o oxlint mais a checagem de formato do conteúdo.
- Conflito previsto: as issues #125 (skill de Vitest e Testing Library, worktree `feat-125-skill-vitest-testing-library`), #129 (skills de Redux Toolkit, worktree `feat-129-skills-redux-toolkit`) e #124 (skill de TDD, worktree `feat-124-skill-de-tdd`) partem do mesmo commit e mexem nos mesmos pontos: a seção `skills` do `catalog.json` e, em `tests/standards.test.js`, o objeto `stackSkills`, o objeto `projects`, o `stackRules` e a lista de skills gerais. Para reduzir o atrito, acrescente as entradas novas no fim de cada objeto ou em teste próprio. Quem fizer o merge depois resolve o conflito mantendo as entradas de todas as issues e roda o gate de fase de novo.

## Tarefas

### T1 [P] Criar a skill e registrá-la no catálogo, com os testes
- O quê: criar a skill de testes de ponta a ponta com Playwright, registrá-la no catálogo ligada à stack `playwright` e cobrir detecção, instalação e formato com testes.
- Onde: nova pasta `stacks/playwright/skills/playwright-e2e/` com `SKILL.md` (nome aprovado pelo usuário; o campo `name` do cabeçalho é igual ao nome da pasta); `catalog.json` (seção `skills`, entrada com `path`, `applies: ["playwright"]` e `description`); `tests/standards.test.js`.
- Dev: dev-frontend-2.
- Depende de: nada.
- Reaproveita: formato de `stacks/react/skills/accessibility-audit/SKILL.md` e `stacks/react/skills/exploratory-qa/SKILL.md` (cabeçalho, linha "Entrega:", seções curtas e fechamento com o que ficou de fora); a stack `playwright` já registrada no catálogo; os auxiliares `h.makeTarget`, `sync`, `skillsOf` e `rulesOf` de `tests/standards.test.js`.
- Atende: RN-01 a RN-11; CA-01 a CA-14.
- Pronto quando: a skill trata cada assunto da RN-03, não cita caminho de projeto, cita o limite da verificação automática e a lista de conferência manual, orienta o roteiro de dependência nova quando falta o verificador, e tem tamanho na faixa das outras skills de stack; os testes abaixo passam e o gate passa.
- Teste: integração, com `node --test`. Escreva primeiro, e veja falhar porque a skill não existe:
  - projeto só com `@playwright/test` em `devDependencies` recebe as skills gerais mais `playwright-e2e` e mais nenhuma de stack, e a saída diz `Stacks detectadas: playwright`;
  - o mesmo com o pacote `playwright`;
  - projeto React mais Playwright recebe as skills de React e `playwright-e2e`.
  Se o projeto Playwright entrar no objeto `projects`, o teste de regras por stack passa a exigir `stackRules.playwright` (use lista vazia) e o de skills usa `stackSkills.playwright`; se preferir, escreva testes próprios fora desses laços, o que também reduz o conflito com as issues paralelas. Os testes existentes de projetos sem Playwright e o de perfil continuam passando sem alteração (CA-05, CA-13). O teste "cada skill do catálogo diz quando usar e o que entrega" passa a cobrir a skill nova sem mudança.
- Gate: `node --test tests/standards.test.js`, `npm run lint` e `node bin/ai-sync.js --check`. Sem typecheck nem formatador no projeto.
- Commit: `Feat :sparkles: [#126] Adiciona a skill de testes de ponta a ponta com Playwright`, com os caminhos explícitos. O catálogo e a pasta `stacks/` são fontes sincronizadas: antes de commitar, rode `npm run sync` e inclua nos caminhos os arquivos de `.claude/` que mudarem (provavelmente nenhum, já que o perfil `tooling` não usa essa stack). Se o hook recusar, siga a mensagem dele.
- Modelo: padrao.
- Status: feita (commit b208b1d; skill playwright-e2e, catálogo e testes; 5 testes falharam antes; gate ok: lint, 746 testes, --check).

### T2 [P] Nota de mudança
- O quê: criar a nota de mudança minor da skill nova.
- Onde: arquivo novo em `.changeset/` (nome livre e único, por exemplo `feat-126-skill-playwright-e2e.md`), com o cabeçalho `"@felipe-sant/claude-kit": minor` e um corpo de uma ou duas linhas em português simples, no formato de `.changeset/feat-128-skill-qa-exploratorio.md`.
- Dev: dev-frontend-2.
- Depende de: nada.
- Reaproveita: o formato das notas existentes.
- Atende: regra de versão do repositório (skill nova é minor).
- Pronto quando: a nota existe, diz em linguagem simples que projetos com Playwright passam a receber a skill de testes de ponta a ponta com verificação de acessibilidade, e o gate passa.
- Teste: nenhum (só texto).
- Gate: `npm run lint`. Sem typecheck nem formatador no projeto.
- Commit: `Docs :bulb: [#126] Adiciona a nota de mudança da skill de Playwright`, só com a nota nos caminhos.
- Modelo: economico.
- Status: feita (commit 6877a70; nota de mudança minor).

## Dúvidas

Nenhuma. Decisões do usuário registradas na aprovação:

- D-U-1: o nome `playwright-e2e` está aprovado.
- D-U-2: nenhum agente cita a skill agora. Isso fica para a issue #132.
