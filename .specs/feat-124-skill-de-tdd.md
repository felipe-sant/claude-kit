# Criar a skill de TDD com ciclo, adequação dos testes e prova de que o teste falha

> Status: implementada (código aprovado pelo reviewer, sem achado bloqueante)
> Tipo: funcionalidade
> Tamanho: media
> Branch: feat/124-skill-de-tdd
> Criada em: 2026-11-28

## Objetivo

O padrão de testes diz o que fazer, mas não ensina o passo a passo nem como julgar se os testes bastam. Esta tarefa cria uma skill de TDD que vale para qualquer projeto e ensina o ciclo completo, a conferência de que os testes cobrem a especificação e a prova de que eles falham quando o comportamento quebra. Os agentes que implementam e o revisor passam a citá-la.

## Regras

- RN-01: a skill é nova, fica registrada no catálogo e vale para todos os projetos. Fonte: issue #124.
- RN-02: a skill ensina o ciclo de TDD: um teste falhando por vez, ver o teste falhar pelo motivo certo, escrever o mínimo para passar e melhorar o código só com todos os testes passando. Fonte: issue #124 e padrão de testes.
- RN-03: a skill diz o que entra em TDD (lógica e comportamento) e o que não entra (aparência). Fonte: issue #124 e padrão de testes.
- RN-04: a skill ensina a tabela de adequação ao fim da tarefa, que liga cada critério da especificação a um teste, com a evidência. Fonte: issue #124.
- RN-05: a skill ensina a provar que os testes falham quando o comportamento quebra, colocando defeitos pequenos de propósito e desfazendo cada um em seguida. Fonte: issue #124.
- RN-06: a skill ensina o caso do bug, que começa por um teste que reproduz o bug e falha. Fonte: issue #124 e padrão de testes.
- RN-07: a skill nunca orienta alterar ou apagar um teste só para ele passar, nem pular um teste. Fonte: issue #124 e padrão de testes.
- RN-08: a skill não traz caminhos nem comandos de um projeto específico. Fonte: issue #124.
- RN-09: os agentes dev que escrevem código, o executor e o revisor passam a citar a skill. O dev de documentação fica de fora, porque o trabalho dele é só documentação. Fonte: issue #124 e decisão do usuário.
- RN-10: a skill segue o padrão de testes já existente e não cria regra nova além dele e da issue. Fonte: pedido do dev.

## Critérios de aceite

- CA-01: QUANDO o kit é instalado em um projeto de qualquer stack, sem perfil escolhido, ENTÃO o sistema DEVE instalar a skill de TDD junto com as demais skills gerais. Cobre RN-01.
- CA-02: QUANDO o kit é instalado com qualquer um dos perfis existentes, ENTÃO o sistema DEVE instalar a skill de TDD. Cobre RN-01.
- CA-03: QUANDO alguém lê a skill, ENTÃO ela DEVE descrever, em ordem, o ciclo: um teste falhando por vez, ver falhar pelo motivo certo, o mínimo para passar e melhorar o código só com tudo passando. Cobre RN-02.
- CA-04: QUANDO alguém lê a skill, ENTÃO ela DEVE dizer que lógica e comportamento entram em TDD e que aparência não entra. Cobre RN-03.
- CA-05: QUANDO alguém lê a skill, ENTÃO ela DEVE trazer o modelo da tabela de adequação, com uma linha por critério da especificação, o teste que o cobre e a evidência, e dizer o que fazer com o critério sem teste. Cobre RN-04.
- CA-06: QUANDO alguém lê a skill, ENTÃO ela DEVE explicar como colocar um defeito pequeno de propósito, conferir que algum teste falha, desfazer o defeito e conferir que os testes voltam a passar, e o que fazer quando nenhum teste falha. Cobre RN-05.
- CA-07: QUANDO alguém lê a skill, ENTÃO ela DEVE dizer que a correção de um bug começa por um teste que o reproduz e falha. Cobre RN-06.
- CA-08: QUANDO alguém lê a skill, ENTÃO ela NÃO DEVE orientar alterar ou apagar teste só para ele passar, nem pular teste, e DEVE dizer o contrário de forma explícita. Cobre RN-07.
- CA-09: QUANDO alguém lê a skill, ENTÃO ela NÃO DEVE citar caminho de arquivo, ferramenta de teste ou comando de um projeto específico. Cobre RN-08.
- CA-10: QUANDO alguém lê as instruções de cada agente dev que escreve código, do executor e do revisor, ENTÃO cada uma DEVE citar a skill de TDD. Cobre RN-09.
- CA-11: QUANDO um dev passa uma tarefa ao executor, ENTÃO a instrução que ele manda DEVE incluir o uso da skill de TDD. Cobre RN-09.
- CA-12: QUANDO a checagem de formato do conteúdo e os testes de instalação rodam, ENTÃO eles DEVEM passar com a skill nova. Cobre RN-01.
- CA-13: QUANDO o pull request é aberto, ENTÃO ele DEVE trazer uma nota de mudança do tipo minor, por ser uma skill nova. Cobre RN-01.

## Critérios de sucesso

- Qualquer projeto que recebe o kit passa a ter a skill de TDD, e os devs, o executor e o revisor a usam.
- O revisor consegue conferir, pela tabela de adequação e pela prova com defeitos, se os testes de uma entrega são suficientes.
- Lint e a suíte completa passando, e o pacote publicado leva a skill.

## Fora do escopo

- Mudar o padrão de testes: a skill o detalha, não o substitui.
- Listas de skills no README, na skill de montagem do time e no guia do projeto: conferido que nenhum deles lista as skills pelo nome. O README só diz que todos os perfis trazem as skills gerais, e isso continua verdade com a skill nos quatro perfis.
- Agentes de stack: nenhuma stack tem agentes próprios hoje.
- Dev de documentação: não cita a skill, porque o trabalho dele é só documentação (decisão do usuário).
- Ferramenta que coloque os defeitos de forma automática: a skill só descreve o método.

## Plano de execução

Typecheck: o projeto não tem. Formatador: não há além do lint.

As tarefas T1 e T2 mexem em fontes do conteúdo sincronizado e não rodam ao mesmo tempo: T2 só começa depois do commit de T1. T3 não mexe em fonte sincronizada e roda em paralelo com qualquer uma.

- Fase 1 (sequencial, com T3 em paralelo): T1 → T2, e T3 [P] a qualquer momento.
- Gate de fase: `npm run lint`, `npm test`, `node bin/ai-sync.js --check` e `npm pack --dry-run` (conferir que o pacote leva `skills/tdd/SKILL.md`), rodados uma vez ao fim da fase e antes do reviewer.

## Tarefas

### T1 Criar a skill de TDD e registrá-la para todos os projetos

- O quê: criar a skill de TDD com todos os pontos da issue, registrá-la no catálogo para todos e incluí-la nos quatro perfis.
- Onde: `skills/tdd/SKILL.md` (novo), `catalog.json` (seção `skills`, `applies: ["all"]`), `profiles/default.json`, `profiles/backend.json`, `profiles/frontend.json`, `profiles/tooling.json`, `tests/standards.test.js` (lista `generalSkills`) e um teste novo de conteúdo da skill (em `tests/standards.test.js` ou `tests/team.test.js`). Gerados: `.claude/skills/tdd/SKILL.md` e `.claude/claude-kit.lock.json` via `npm run sync`.
- Dev: dev-doc
- Modelo: padrao
- Depende de: nada
- Reaproveita: formato de `skills/bug-investigation/SKILL.md` (cabeçalho `name` e `description`, entrega, passos, formato da resposta); conteúdo de `rules/testing-standard.md`; o padrão do commit da skill `exploratory-qa` (#128) para catálogo e testes.
- Atende: RN-01 a RN-08, RN-10, CA-01 a CA-09, CA-12.
- Pronto quando: a skill cobre ciclo, o que entra e o que não entra, tabela de adequação, prova com defeitos e caso do bug; não tem caminho nem comando de projeto; diz de forma explícita que nunca se altera, apaga ou pula teste para passar; o passo de desfazer o defeito é só descrito ("desfaça e confira que os testes voltam a passar"), sem comando de git; catálogo e os quatro perfis têm `tdd`; `.claude/` regenerado e commitado junto; gate passando.
- Teste: integração. Falha primeiro: incluir `'tdd'` em `generalSkills` faz os testes "projeto <stack> recebe as skills gerais..." falharem antes da skill existir. Junto, um teste de conteúdo que lê a skill pelo catálogo e confere `applies` igual a `["all"]`, a presença de `tdd` nos quatro perfis, que o texto cita os pontos da issue (motivo certo, mínimo, tabela de adequação, defeito, bug) e que não contém orientação de pular teste.
- Gate: `npm run lint`, `node --test tests/standards.test.js` (e o arquivo do teste de conteúdo, se for outro), `node bin/ai-sync.js --check`. Typecheck: o projeto não tem.
- Status: feita (commit b5be1f0; teste falhou com 7 falhas antes e passou depois; gate final: lint ok, 633 testes, --check ok, npm pack leva a skill)

### T2 Fazer os devs, o executor e o revisor citarem a skill

- O quê: acrescentar a cada agente dev que escreve código, ao executor e ao revisor uma linha que manda usar a skill de TDD, e incluir a skill na instrução que o dev passa ao executor.
- Onde: `agents/dev-frontend.md`, `agents/dev-backend.md`, `agents/dev-mobile.md`, `agents/dev-devops.md`, `agents/dev-database.md`, `agents/dev-fullstack.md`, `agents/executor.md`, `agents/reviewer.md` e `tests/agents.test.js`. Gerados: `.claude/agents/` e `.claude/claude-kit.lock.json` via `npm run sync`. `agents/dev-doc.md` fica de fora (RN-09).
- Dev: dev-doc
- Modelo: economico
- Depende de: T1 (commit feito)
- Reaproveita: a frase da skill `exploratory-qa` em `agents/qa.md` ("use a skill `...`, se estiver instalada, ..."); a linha de TDD que já existe em cada dev e no executor; a linha de testes do revisor (conferir tabela de adequação e prova com defeitos pela skill); a lista de chamada do executor em cada dev ("TDD em lógica e comportamento, ...").
- Atende: RN-09, CA-10, CA-11.
- Pronto quando: os oito agentes citam `tdd`; a instrução ao executor em cada dev cita a skill; `.claude/` regenerado e commitado junto; gate passando.
- Teste: unitário de conteúdo. Falha primeiro: um teste novo em `tests/agents.test.js` que confere que cada um dos oito agentes cita a skill `tdd` e que a linha de chamada do executor nos devs a cita.
- Gate: `npm run lint`, `node --test tests/agents.test.js`, `node bin/ai-sync.js --check`. Typecheck: o projeto não tem.
- Status: feita (commit 65b1e49; teste falhou com 2 falhas antes e passou depois; gate final: lint ok, 633 testes, --check ok)

### T3 [P] Adicionar a nota de mudança minor

- O quê: criar a nota de mudança minor da skill nova.
- Onde: `.changeset/` (arquivo novo, nome livre e único, criado à mão com a linha `"@felipe-sant/claude-kit": minor` e um corpo em português simples de uma ou duas linhas).
- Dev: dev-doc
- Modelo: economico
- Depende de: nada
- Reaproveita: `.changeset/feat-128-skill-qa-exploratorio.md` como modelo.
- Atende: CA-13.
- Pronto quando: a nota existe com tipo minor e o corpo diz que há uma skill nova de TDD usada pelos devs, executor e revisor; gate passando.
- Teste: nenhum (o teste da checagem de changeset já cobre o formato).
- Gate: `npm run lint`, `node --test tests/changeset-check-workflow.test.js`. Typecheck: o projeto não tem.
- Status: feita (commit 3e3cc83; nota de mudança minor; gate final: lint ok, 633 testes, --check ok)

## Dúvidas

Nenhuma. Decisão do usuário registrada na aprovação: o dev de documentação fica fora da lista de agentes que citam a skill de TDD, porque o trabalho dele é só documentação.
