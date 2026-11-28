# Fazer o dev frontend, o revisor e o QA seguirem as regras e skills de frontend

> Status: em-revisao
> Tipo: funcionalidade
> Tamanho: media
> Branch: feat/132-agentes-de-frontend-seguem-as-regras
> Criada em: 2026-11-28

## Objetivo

Hoje o projeto que tem tela recebe as regras e skills de frontend (React, TypeScript, organização de arquivos, estilo, tradução, acessibilidade e testes de tela), mas nenhum agente diz que precisa usá-las. Elas ficam instaladas e são ignoradas. Esta tarefa liga essas regras e skills aos três agentes que trabalham com tela: o dev frontend lê as regras antes de implementar, o revisor confere a entrega contra elas e o QA usa as skills de teste de tela e de acessibilidade.

Os três agentes são copiados para todos os projetos, inclusive os que não têm tela. Por isso, cada menção ao conteúdo de frontend vale só quando esse conteúdo estiver instalado no projeto, como o QA já faz hoje com a skill de QA exploratório.

## Regras

- RN-01: Antes de implementar, o dev frontend lê as regras de React, TypeScript, organização de arquivos, estilo, tradução, acessibilidade e testes de frontend. Fonte: issue #132.
- RN-02: O revisor confere a mudança contra essas mesmas regras. Fonte: issue #132.
- RN-03: O revisor classifica como bloqueio o descumprimento das regras de acessibilidade e de testes de frontend. Fonte: issue #132.
- RN-04: O QA usa as skills de teste de tela e de acessibilidade. Fonte: issue #132.
- RN-05: O conteúdo de frontend só aparece em projetos que têm frontend. Fonte: issue #132.
- RN-06: Como os três agentes vão para todos os projetos, cada regra ou skill de frontend citada vem com a condição "se estiver instalada", no mesmo formato que o QA já usa para a skill de QA exploratório. O bloqueio do revisor (RN-03) vale só para mudanças que mexem em tela. Fonte: orientação do dev que pediu a especificação, a partir de como a instalação funciona hoje.
- RN-07: As definições dos três agentes continuam em português e sem comentários. Fonte: issue #132.
- RN-08: O teste de formato dos agentes continua passando. Fonte: issue #132.

## Critérios de aceite

- CA-01: QUANDO o dev frontend começa uma tarefa em um projeto que tem as regras de frontend instaladas ENTÃO a definição dele DEVE mandar ler, antes de implementar, as regras de React, organização de arquivos, estilo, acessibilidade e testes de frontend, e também as de TypeScript e de tradução quando o projeto as tiver. Cobre RN-01, RN-06.
- CA-02: QUANDO o dev frontend trabalha em um projeto sem alguma dessas regras ENTÃO a definição dele DEVE deixar claro que a leitura daquela regra não se aplica, sem exigir um arquivo que não existe. Cobre RN-05, RN-06.
- CA-03: QUANDO o revisor revisa uma entrega que mexe em tela, em um projeto com as regras de frontend instaladas, ENTÃO a definição dele DEVE mandar conferir a mudança contra as regras de React, organização de arquivos, estilo, acessibilidade, testes de frontend, TypeScript e tradução que estiverem instaladas. Cobre RN-02, RN-06.
- CA-04: QUANDO o revisor encontra uma tela que descumpre a regra de acessibilidade ou a regra de testes de frontend ENTÃO a definição dele DEVE mandar classificar o achado como bloqueio. Cobre RN-03.
- CA-05: QUANDO o revisor revisa uma entrega sem tela, ou um projeto sem essas regras instaladas, ENTÃO a definição dele NÃO DEVE exigir as regras de frontend nem gerar bloqueio por elas. Cobre RN-05, RN-06.
- CA-06: QUANDO o QA valida uma tela em um projeto com as skills de frontend instaladas ENTÃO a definição dele DEVE mandar usar a skill de QA exploratório e a skill de auditoria de acessibilidade, cada uma com a condição "se estiver instalada". Cobre RN-04, RN-06.
- CA-07: QUANDO o QA valida algo em um projeto sem as skills de frontend ENTÃO a definição dele DEVE continuar valendo sem elas, sem exigir skill que não existe. Cobre RN-05, RN-06.
- CA-08: QUANDO um projeto sem frontend é sincronizado ENTÃO ele NÃO DEVE receber nenhuma regra nem skill de frontend, como já acontece hoje. Cobre RN-05.
- CA-09: QUANDO a suíte de testes e a checagem de formato rodam depois das mudanças ENTÃO elas DEVEM passar, e as três definições DEVEM estar em português e sem comentários. Cobre RN-07, RN-08.
- CA-10: QUANDO qualquer outra parte das três definições é lida depois da mudança ENTÃO ela DEVE continuar dizendo o mesmo que antes (fluxo de especificação, TDD, gate, commits, memória do time). Cobre RN-08.

## Critérios de sucesso

- Em um projeto React, o dev frontend, o revisor e o QA citam as regras e skills de frontend que estão instaladas, e o revisor bloqueia entrega de tela sem acessibilidade ou sem os testes que a regra pede.
- Em um projeto sem tela, nada muda no comportamento dos três agentes.
- `npm test` e `npm run lint` passam no CI.

## Fora do escopo

- Mudar a instalação (o `ai-sync`, o catálogo ou as regras de detecção de stack): os agentes continuam indo para todos os projetos e a condição fica no texto.
- Incluir as regras de frontend nos perfis manuais (por exemplo, o perfil `frontend`). Hoje, com perfil, nenhuma regra de stack é instalada, então as menções condicionais não se aplicam nesse caso. Ver Dúvidas.
- Alterar o dev fullstack e o dev mobile, que também mexem em tela mas não são citados na issue. Ver Dúvidas.
- Alterar o texto das próprias regras e skills de frontend.
- Ligar o designer às regras de estilo e acessibilidade.

## Plano de execução

Os três agentes são fonte do conteúdo sincronizado (`agents/`) e as três tarefas acrescentam testes ao mesmo arquivo. Por isso elas não rodam em paralelo: seguem uma ordem fixa de commit, e a próxima só começa depois do commit da anterior. A nota de mudança não é conteúdo sincronizado e roda em paralelo.

- Fase 1 (sequencial, com uma tarefa paralela): T1 → T2 → T3, e T4 [P] a qualquer momento.
- Gate de fase: `npm test` (suíte completa), `npm run lint` (oxlint e checagem de formato do conteúdo), `node bin/ai-sync.js --check` e a sincronização em pasta temporária com e sem React:
  `T=$(mktemp -d) && echo '{"dependencies":{"react":"1","typescript":"1","i18next":"1"}}' > "$T/package.json" && node bin/ai-sync.js "$T" && ls "$T/.claude/rules" "$T/.claude/skills"; rm -rf "$T"` e o mesmo sem `package.json`, conferindo que o segundo não recebe regra nem skill de frontend.
- O projeto não tem typecheck, build nem formatador: o gate é testes, lint e a checagem do catálogo. Não procure typecheck.

## Tarefas

### T1. Dev frontend lê as regras de frontend antes de implementar

- O quê: a definição do dev frontend passa a mandar ler, antes de implementar, as regras de frontend instaladas em `.claude/rules/`, cada uma com a condição "se estiver instalada".
- Onde: `agents/dev-frontend.md` (seção Regras ou Execução) e `tests/team.test.js` (ou `tests/agents.test.js`, seguindo onde ficam os testes de agente parecidos). O dev frontend não está no perfil `tooling`, então não há arquivo gerado em `.claude/` nesta tarefa.
- Dev: dev-doc
- Depende de: nada
- Reaproveita: o padrão já usado em `agents/qa.md` ("use a skill `exploratory-qa`, se estiver instalada") e em `agents/dev-frontend.md` com a skill `tdd`. Nomes instalados conferidos em pasta temporária: `.claude/rules/react-standard.md`, `react-organization-standard.md`, `style-standard.md`, `accessibility-standard.md`, `frontend-testing-standard.md`, `typescript-standard.md` e `i18n-standard.md`. A garantia de que projeto sem a stack não recebe as regras já está provada em `tests/standards.test.js` ("projeto sem stack conhecida recebe só os padrões gerais", "projeto sem biblioteca de tradução não recebe o padrão de tradução").
- Atende: RN-01, RN-05, RN-06, RN-07, CA-01, CA-02, CA-08, CA-09, CA-10
- Pronto quando: a definição cita as sete regras pelo nome e a condição de estarem instaladas; o teste novo passa; o gate passa; um commit só com os dois arquivos.
- Teste: unitário de conteúdo. Primeiro escreva o teste que confere, na definição do dev frontend, o nome de cada uma das sete regras e a condição "se estiver instalada" (ou equivalente) na mesma frase, rode e veja falhar porque a definição ainda não cita as regras.
- Gate: `node --test tests/team.test.js` (ou o arquivo onde o teste ficar), `npm run lint`, `node bin/ai-sync.js --check`.
- Modelo: padrao
- Status: pendente

### T2. Revisor confere as regras de frontend e bloqueia acessibilidade e testes

- O quê: a definição do revisor passa a mandar conferir mudanças de tela contra as regras de frontend instaladas e a classificar como bloqueio o descumprimento das regras de acessibilidade e de testes de frontend, só quando a mudança mexe em tela e as regras estão instaladas.
- Onde: `agents/reviewer.md` (seção Regras), `tests/team.test.js` e o arquivo gerado `.claude/agents/reviewer.md`. O revisor está no perfil `tooling`: rode `npm run sync` e inclua o gerado nos caminhos do commit, senão o gancho de commit o recusa.
- Dev: dev-doc
- Depende de: T1 (commitada)
- Reaproveita: o `review-standard` já manda conferir "as regras da stack instaladas em `.claude/rules/`"; esta tarefa só acrescenta os nomes e a classificação de bloqueio de `accessibility-standard` e `frontend-testing-standard`. Os testes do revisor que já existem em `tests/team.test.js`.
- Atende: RN-02, RN-03, RN-05, RN-06, RN-07, CA-03, CA-04, CA-05, CA-09, CA-10
- Pronto quando: a definição cita as sete regras com a condição de estarem instaladas, diz que o descumprimento de `accessibility-standard` e `frontend-testing-standard` bloqueia, e limita isso a mudanças de tela; o teste novo passa; o gate passa; um commit com a fonte, o teste e o gerado em `.claude/agents/reviewer.md`.
- Teste: unitário de conteúdo. Primeiro escreva o teste que confere, na definição do revisor, os nomes das regras com a condição de estarem instaladas e, na mesma frase, `accessibility-standard`, `frontend-testing-standard` e "bloqueia" (ou "bloqueio") ligado a mudança de tela; veja falhar porque a definição ainda não os cita.
- Gate: `node --test tests/team.test.js`, `npm run lint`, `node bin/ai-sync.js --check`.
- Modelo: padrao
- Status: pendente

### T3. QA usa as skills de teste de tela e de acessibilidade

- O quê: a definição do QA passa a mandar usar a skill de auditoria de acessibilidade, além da de QA exploratório que já cita, cada uma com a condição "se estiver instalada".
- Onde: `agents/qa.md` (seção Regras), `tests/team.test.js` e o arquivo gerado `.claude/agents/qa.md`. O QA está no perfil `tooling`: rode `npm run sync` e inclua o gerado nos caminhos do commit.
- Dev: dev-doc
- Depende de: T2 (commitada)
- Reaproveita: a linha atual do QA sobre a skill `exploratory-qa`, que já segue o formato condicional. Nome instalado conferido: `.claude/skills/accessibility-audit`.
- Atende: RN-04, RN-05, RN-06, RN-07, CA-06, CA-07, CA-09, CA-10
- Pronto quando: a definição cita `exploratory-qa` e `accessibility-audit`, cada uma com "se estiver instalada"; o teste novo passa; o gate passa; um commit com a fonte, o teste e o gerado em `.claude/agents/qa.md`. Se o product-owner decidir que entram outras skills (ver Dúvidas), elas entram aqui com a mesma condição.
- Teste: unitário de conteúdo. Primeiro escreva o teste que confere, na definição do QA, `accessibility-audit` e "se estiver instalada" na mesma frase, e que a citação de `exploratory-qa` continua; veja falhar porque a skill de acessibilidade ainda não é citada.
- Gate: `node --test tests/team.test.js`, `npm run lint`, `node bin/ai-sync.js --check`.
- Modelo: economico
- Status: pendente

### T4. [P] Nota de mudança

- O quê: cria a nota de mudança do pull request, do tipo `patch` pela regra de versão do repositório (ajuste de texto em agentes que já existem, sem item novo e sem quebra), com uma ou duas linhas em português simples dizendo que o dev frontend, o revisor e o QA passam a seguir as regras e skills de frontend quando estão instaladas.
- Onde: um arquivo novo em `.changeset/`, com nome único, criado à mão no formato do repositório.
- Dev: dev-doc
- Depende de: nada
- Reaproveita: o formato das notas que já existem em `.changeset/`.
- Atende: RN-08
- Pronto quando: o arquivo tem só a linha `"@felipe-sant/claude-kit": patch` no cabeçalho e o corpo curto; a checagem de nota de mudança do CI aceita; um commit só com ele.
- Teste: nenhum (texto).
- Gate: `npm run lint` e `node --test tests/changeset-check-workflow.test.js`.
- Modelo: economico
- Status: pendente

## Dúvidas

Para o product-owner:

- Quais são as "skills de teste de tela" do QA? A especificação considera a de QA exploratório (já citada) e a de auditoria de acessibilidade. Devem entrar também a de testes de ponta a ponta com Playwright e a de testes de unidade e componente, que escrevem testes (e o QA hoje não altera código)?
- O dev frontend também deve citar as skills de frontend (criação de componente, testes de unidade e componente, testes de ponta a ponta, fatia de estado e endpoints com Redux Toolkit)? A issue cita skills no título, mas no corpo só fala das regras para o dev.
- As "regras de testes" cujo descumprimento bloqueia são só a regra de testes de frontend, ou também a regra geral de testes, que vale para todo projeto?
- Todo item da regra de acessibilidade bloqueia (por exemplo, tamanho de alvo de toque de 44 pixels), ou só parte dela?

Para o usuário:

- Com perfil manual (por exemplo, o `frontend`), nenhuma regra de stack é instalada, então as menções condicionais nunca se aplicam. Os perfis devem passar a levar as regras e skills de frontend, em outra tarefa?
- O dev fullstack e o dev mobile também mexem em tela. Devem receber a mesma ligação às regras de frontend, em outra tarefa?
- A forma escolhida para "conteúdo de frontend só em projetos com frontend" é a menção condicional no texto dos agentes (os agentes continuam indo para todos os projetos). Isso atende, ou a expectativa era que o próprio texto não aparecesse em projetos sem frontend, o que exigiria mudar a instalação?
