# Skill de testes de unidade e de componente com Vitest e Testing Library

> Status: implementada (código aprovado pelo reviewer, sem achado bloqueante; T4, pedida pelo reviewer, pendente)
> Tipo: funcionalidade
> Tamanho: media
> Branch: feat/125-skill-vitest-testing-library
> Criada em: 2026-11-28

## Objetivo

Criar uma skill que ensina o time a escrever, rodar e depurar testes de unidade, de hook e de componente com Vitest e Testing Library. É o tipo de teste mais comum no frontend e onde mais se erra: consulta frágil à tela, espera por tempo fixo e dublê demais. A skill chega sozinha a todo projeto que usa uma dessas ferramentas, para que cada dev não precise reaprender isso. Para isso, a sincronização passa a reconhecer também a Testing Library pelos pacotes do projeto.

## Regras

- RN-01: Existe uma skill nova de testes de unidade, de hook e de componente, registrada no catálogo. Fonte: issue #125.
- RN-02: A skill é entregue quando o projeto usa Vitest **ou** Testing Library (basta uma das duas). Projeto que não usa nenhuma das duas não a recebe. Isso inclui projeto com Testing Library e Jest, sem Vitest. Fonte: issue #125 e decisão do usuário.
- RN-03: A sincronização reconhece a Testing Library pelos pacotes do projeto, em dependências normais ou de desenvolvimento, como já faz com as outras stacks. Fonte: issue #125 e comportamento atual da detecção.
- RN-04: Pacotes que identificam a Testing Library, os de ambiente e de framework: `@testing-library/dom`, `@testing-library/react`, `@testing-library/vue`, `@testing-library/angular`, `@testing-library/svelte`, `@testing-library/preact` e `@testing-library/react-native`. Todos existem e estão publicados. Fonte: pedido do dev-frontend-1, conferido no registro de pacotes, e decisão do usuário.
- RN-04a: Os complementos `@testing-library/user-event` e `@testing-library/jest-dom`, sozinhos, não fazem a Testing Library ser reconhecida. O antigo `@testing-library/react-hooks` fica fora da detecção. Fonte: decisão do usuário.
- RN-05: O Vitest continua reconhecido só pelo pacote `vitest`, como já está no catálogo. Fonte: catálogo atual (issue #130).
- RN-06: A skill cobre, nesta ordem de assunto: escolher o que testar pela camada (lógica, hook, componente); consultar a tela por papel e texto, como a pessoa a vê; simular o uso real com a biblioteca de interação do usuário; tratar o que é assíncrono sem esperar tempo fixo; usar dublês só nas fronteiras (rede, relógio, serviços externos); organizar os dados de teste; e diagnosticar teste instável. Fonte: issue #125 e pedido do dev-frontend-1.
- RN-06a: O texto da skill é neutro quanto ao executor de testes: vale para Vitest e para Jest, sem depender de recurso exclusivo de um deles. Fonte: decisão do usuário.
- RN-07: A skill não traz caminhos, nomes de pasta nem convenções de um projeto específico, e diz que a convenção do próprio projeto vence quando existir. Fonte: issue #125.
- RN-08: A skill segue o formato das skills atuais: cabeçalho com nome igual ao da pasta e uma descrição que diz quando usar ("Use quando" ou "Use para"), e o corpo diz o que entrega ("Entrega:"). Fonte: checagem de formato e testes atuais.
- RN-09: A skill complementa as regras gerais de teste (teste primeiro, dublês só nas fronteiras, teste independente) e a regra de testes de frontend das telas React, sem repeti-las nem contradizê-las. Fonte: regras atuais do projeto.
- RN-10: Projetos que já eram reconhecidos (React, NestJS, Laravel, AdonisJS, TypeScript, tradução, Playwright, Redux Toolkit) e não usam Vitest nem Testing Library continuam recebendo exatamente o mesmo conteúdo. Fonte: issue #130 (RN-05) e comportamento atual.
- RN-11: Mudança consciente de um comportamento registrado na issue #130: até aqui, um projeto só com Vitest não tinha a stack reconhecida, porque ela não tinha conteúdo. Com esta skill, esse projeto passa a ter a stack Vitest reconhecida e a receber a skill. A regra geral (stack sem conteúdo não aparece como detectada) continua valendo. Fonte: issue #130 (RN-08 e CA-10 de lá) e issue #125.

## Critérios de aceite

- CA-01: QUANDO alguém consulta o catálogo ENTÃO ele DEVE ter a stack Testing Library, com descrição e exatamente os pacotes da RN-04. (RN-03, RN-04)
- CA-02: QUANDO alguém consulta o catálogo ENTÃO ele DEVE ter a skill nova, com descrição, aplicada às stacks Vitest e Testing Library e a nenhuma outra. (RN-01, RN-02)
- CA-03: QUANDO um projeto usa só o Vitest, nas dependências de desenvolvimento ENTÃO a sincronização DEVE reconhecer a stack Vitest e entregar a skill nova junto com as skills gerais. (RN-02, RN-03, RN-11)
- CA-04: QUANDO um projeto usa só um pacote da Testing Library (sem Vitest) ENTÃO a sincronização DEVE reconhecer a stack Testing Library e entregar a skill nova. (RN-02, RN-03, RN-04)
- CA-05: QUANDO um projeto usa qualquer um dos pacotes da RN-04 ENTÃO a sincronização DEVE reconhecer a stack Testing Library, para cada pacote da lista. (RN-04)
- CA-05a: QUANDO um projeto tem só `@testing-library/user-event`, só `@testing-library/jest-dom`, os dois juntos ou só `@testing-library/react-hooks`, sem nenhum pacote da RN-04 e sem Vitest ENTÃO a sincronização NÃO DEVE reconhecer a stack Testing Library nem entregar a skill nova. (RN-04a)
- CA-06: QUANDO um projeto usa Vitest e Testing Library ao mesmo tempo ENTÃO a sincronização DEVE reconhecer as duas stacks e entregar a skill nova uma única vez. (RN-02)
- CA-07: QUANDO um projeto não usa Vitest nem Testing Library ENTÃO a sincronização NÃO DEVE entregar a skill nova nem reconhecer essas duas stacks. (RN-02, RN-10)
- CA-08: QUANDO um projeto React sem Vitest e sem Testing Library é sincronizado ENTÃO ele DEVE receber as mesmas regras e skills de antes desta mudança. (RN-10)
- CA-09: QUANDO um projeto React usa também Vitest e Testing Library ENTÃO ele DEVE receber as skills de React e a skill nova, sem perder nenhuma das que já recebia. (RN-02, RN-10)
- CA-10: QUANDO a pessoa já editou a skill nova no projeto e sincroniza de novo ENTÃO a sincronização NÃO DEVE sobrescrever a edição, e DEVE avisar, como faz com as outras skills. (RN-01)
- CA-11: QUANDO a checagem de formato do conteúdo e a checagem do catálogo rodam ENTÃO elas DEVEM passar sem erro com a skill e a stack novas. (RN-08)
- CA-12: QUANDO alguém lê a skill ENTÃO ela DEVE dizer quando usar, o que entrega e cobrir cada assunto da RN-06. (RN-06, RN-08)
- CA-13: QUANDO alguém lê a skill ENTÃO ela NÃO DEVE citar caminhos de arquivo, nomes de pasta nem convenção de um projeto específico, e DEVE dizer que a convenção do projeto vence. (RN-07)
- CA-14: QUANDO a skill chega a um projeto que usa Testing Library com outro executor de testes que não o Vitest, ou Vitest sem Testing Library (só lógica) ENTÃO as orientações sobre consulta à tela, interação e assíncrono DEVEM continuar fazendo sentido, sem depender de recurso exclusivo do Vitest, e as partes de lógica e hook não DEVEM supor que existe tela. (RN-02, RN-06, RN-06a)
- CA-15: QUANDO a skill trata de dublês, de assíncrono e de teste independente ENTÃO ela NÃO DEVE contradizer a regra geral de testes nem a regra de testes de frontend das telas React. (RN-09)

## Critérios de sucesso

- Um projeto com Vitest ou Testing Library recebe a skill sem configuração extra, e um projeto sem elas não recebe.
- Os testes provam a detecção positiva e negativa das duas stacks, o caso das duas juntas e a instalação da skill, com o catálogo de teste e com o catálogo real.
- Lint, testes e checagem do catálogo passam no CI, e os projetos já reconhecidos recebem o mesmo conteúdo de antes.

## Fora do escopo

- Regra (padrão) de Vitest ou de Testing Library: a issue pede só a skill.
- Skills de Playwright (issue #126) e de Redux Toolkit (issue #129): seguem em outras branches.
- Mudar a regra de que stack sem conteúdo não aparece como detectada (decidida na issue #130).
- Fazer o `dev-frontend`, o `executor` ou outro agente citar a skill: fica para a issue #132, por decisão do usuário.
- README e CLAUDE.md: a regra do repositório só pede atualização ao criar ou renomear papel, e nenhum dos dois lista as skills uma a uma.
- Perfis manuais (`--profile`): a skill não entra em nenhum perfil manual, como as demais skills de stack (decisão do usuário).
- A skill mencionar a verificação de acessibilidade que o padrão de testes de frontend exige: sugestão do reviewer, fica para decisão futura.

## Plano de execução

- Fase 1 (paralelo): T1 [P], T2 [P].
  - T1 só mexe no teste de integração da sincronização, com catálogo de teste.
  - T2 cria a pasta da skill dentro de `stacks/`, que não é fonte sincronizada enquanto não está no catálogo. Por isso as duas não disputam arquivo nem o hook de commit.
- Gate de fase 1: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`.
- Fase 2 (sequencial): T3, depois do commit da T2 (o catálogo precisa apontar para a pasta da skill já existente, e o catálogo é fonte sincronizada).
- Gate de fase 2: `npm run lint`, `npm test`, `node bin/ai-sync.js --check` e `npm pack --dry-run` (confere que a pasta da skill vai no pacote). Depois rode a sincronização em uma pasta temporária com Vitest e confira a skill entregue. Rode tudo uma vez ao fim da fase e antes do reviewer.
- Fase 3 (pedido do reviewer na revisão, sequencial): T4.
- Gate de fase 3: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`.
- O projeto não tem typecheck, build nem formatador: o lint é o oxlint mais a checagem de formato do conteúdo.

## Tarefas

### T1 [P] Testar a skill de duas stacks com catálogo de teste
- O quê: cobrir a entrega de uma skill aplicada a duas stacks: só a primeira detectada, só a segunda, as duas juntas (skill entregue uma vez) e nenhuma.
- Onde: `tests/ai-sync.test.js`.
- Dev: dev-frontend-1 (ou executor).
- Depende de: nada.
- Reaproveita: `makeCore`, `makeTarget` e `run` de `tests/helpers.js`; o padrão de `technologyCore()` e dos testes de detecção da issue #130 no mesmo arquivo; o teste "stack sem conteúdo no catálogo não é detectada".
- Atende: RN-02, RN-03, CA-03, CA-04, CA-06, CA-07.
- Pronto quando: há um teste por caso (só A, só B, A e B, nenhuma), cada um conferindo a linha "Stacks detectadas" e a presença ou ausência da pasta da skill em `.claude/skills/`, e o caso A e B conferindo uma única pasta da skill; o gate passa.
- Teste: integração do `ai-sync` com catálogo de teste. Nenhum teste deve falhar primeiro: `applies` com mais de uma stack já funciona (basta uma delas ser detectada). Para provar que o teste não passa por acaso, troque o pacote de detecção do catálogo de teste, confira que falha e desfaça.
- Gate: `npm run lint` e `npm test`. Sem typecheck nem formatador no projeto.
- Commit: `Test :test_tube: [#125] Cobre a entrega de skill aplicada a duas stacks`, com o caminho explícito.
- Modelo: economico.
- Status: feita (commit bc47903; 4 testes com catálogo de teste; 2 falhas ao trocar o pacote de detecção, desfeito; gate ok: lint, 744 testes).

### T2 [P] Escrever a skill de testes de unidade e de componente
- O quê: criar a skill com o conteúdo da RN-06, no formato das skills atuais.
- Onde: `stacks/vitest/skills/<nome>/SKILL.md`, nova pasta. Nome: `unit-component-testing` (aprovado pelo usuário; em inglês, minúsculas e hífen; o campo `name` do cabeçalho é igual ao nome da pasta). Decisão técnica: fica em `stacks/` e não em `skills/` porque `skills/` é, por convenção, o que vale para todo projeto, e porque `skills/` é fonte sincronizada, o que impediria rodar em paralelo com a T1. A pasta `stacks/vitest/` ainda não existe e é criada aqui.
- Dev: dev-frontend-1.
- Depende de: nada.
- Reaproveita: o formato de `stacks/react/skills/exploratory-qa/SKILL.md` e `stacks/react/skills/react-component/SKILL.md` (cabeçalho, "Entrega:", passos numerados, fechamento); as regras `rules/testing-standard.md` e `stacks/react/rules/frontend-testing-standard.md`, para complementar sem repetir nem contradizer.
- Atende: RN-06, RN-06a, RN-07, RN-08, RN-09, CA-12, CA-13, CA-14, CA-15.
- Pronto quando:
  - O cabeçalho tem `name` igual à pasta e uma `description` com "Use quando" ou "Use para".
  - O corpo tem "Entrega:" e uma seção por assunto da RN-06, na ordem dela.
  - Não cita caminho de arquivo, nome de pasta nem convenção de projeto, e diz que a convenção do projeto vence.
  - O texto é neutro quanto ao executor de testes (Vitest ou Jest), e as orientações de consulta, interação e assíncrono servem com qualquer um deles, e as de lógica e hook não supõem tela (CA-14).
  - Não repete a regra de pasta `test/` da regra de frontend das telas React nem a contradiz.
  - Não há código com comentário em nenhum exemplo.
  - `npm run lint` passa (a checagem de formato lê também as pastas de `stacks/`).
- Teste: nenhum novo nesta tarefa (é texto). O formato é provado pela checagem de formato agora e pelos testes de formato da T3, quando a skill entra no catálogo.
- Gate: `npm run lint` e `npm test`.
- Commit: `Feat :sparkles: [#125] Adiciona a skill de testes de unidade e de componente`, com o caminho explícito. Rode `git status --short` antes: como a skill ainda não está no catálogo, nada em `.claude/` deve mudar.
- Modelo: padrao.
- Status: feita (commit 6558e44; skill unit-component-testing com 7 seções, neutra quanto ao executor de testes; gate ok).

### T3 Registrar a stack Testing Library e a skill no catálogo
- O quê: registrar a stack `testing-library` com os pacotes da RN-04 e a skill com `applies` `["vitest", "testing-library"]`, atualizar os testes com o catálogo real e criar a nota de mudança minor.
- Onde: `catalog.json` (seções `stacks` e `skills`), `tests/standards.test.js`, nova nota em `.changeset/` (nome livre, por exemplo `feat-125-skill-vitest-testing-library.md`).
- Dev: dev-frontend-1.
- Depende de: T2 (commitada).
- Reaproveita: o formato das stacks e skills do catálogo; em `tests/standards.test.js`, o objeto `technologyStacks`, o objeto `stackSkills`, `skillsOf`, `sync` e o teste "cada skill do catálogo diz quando usar e o que entrega"; a nota `.changeset/feat-128-skill-qa-exploratorio.md` como modelo.
- Atende: RN-01, RN-02, RN-03, RN-04, RN-04a, RN-05, RN-08, RN-10, RN-11, CA-01, CA-02, CA-03, CA-04, CA-05, CA-05a, CA-07, CA-08, CA-09, CA-10, CA-11.
- Pronto quando:
  - A stack e a skill estão no catálogo.
  - Os testes com o catálogo real cobrem cada critério desta tarefa. O CA-05 tem um caso por pacote, o CA-05a tem um caso para cada complemento sozinho, para os dois juntos e para o `@testing-library/react-hooks`, e o CA-10 reaproveita o padrão do teste de skill editada.
  - O teste "projeto só com Vitest, sem conteúdo para a stack, recebe só os padrões gerais" foi substituído por um que confere `Stacks detectadas: vitest` e a skill entregue (CA-03). A justificativa vai no commit e na descrição do PR: a RN-11 muda de propósito o comportamento da issue #130, e a regra geral de stack sem conteúdo continua coberta pelo teste com catálogo de teste em `tests/ai-sync.test.js`.
  - Os testes dos projetos já reconhecidos seguem passando sem mudança (CA-08).
  - A nota tem o cabeçalho `"@felipe-sant/claude-kit": minor` e uma ou duas linhas em português simples.
  - O gate passa.
- Teste: unitário de conteúdo e integração do `ai-sync` com o catálogo real, em `tests/standards.test.js`. Falham primeiro:
  - o teste que confere a stack `testing-library` com exatamente os pacotes da RN-04;
  - o que confere a skill aplicada às duas stacks;
  - o de projeto só com um pacote da Testing Library recebendo a skill;
  - o de projeto só com Vitest recebendo a skill;
  - o de projeto só com `@testing-library/user-event` ou `@testing-library/jest-dom` sem receber a skill (este pode já passar antes do registro; para provar que não passa por acaso, inclua de propósito o complemento na lista do catálogo, confira que falha e desfaça).
- Gate: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`. Sem typecheck nem formatador no projeto.
- Commit: `Feat :sparkles: [#125] Registra a stack Testing Library e a skill de testes no catálogo`, com os caminhos explícitos. O catálogo é fonte sincronizada: antes de commitar, rode `npm run sync` e inclua nos caminhos os arquivos de `.claude/` que mudarem. Provavelmente nenhum muda, porque o perfil `tooling` não usa essas stacks. O hook recusa o commit por caminhos sem eles.
- Modelo: padrao.
- Status: feita (commit 6f86be1; stack testing-library com 7 pacotes, skill com applies vitest e testing-library, nota de mudança minor; 13 testes falharam antes; teste da #130 sobre Vitest sem conteúdo trocado de propósito, RN-11; gate ok: lint, 760 testes, --check, sync sem mudança, npm pack inclui a skill).

### T4 Reforçar os testes da detecção (pedido do reviewer)
- O quê: no teste trocado de propósito (projeto só com Vitest), conferir também as regras gerais entregues, e acrescentar o caso de `@testing-library/user-event` e `@testing-library/jest-dom` juntos, sem outro pacote, sem receber a skill.
- Onde: `tests/standards.test.js`.
- Dev: dev-frontend-1.
- Depende de: T3.
- Reaproveita: os testes criados em T3, o auxiliar `rulesOf` e o caso de cada complemento sozinho.
- Atende: RN-04a, RN-10, RN-11; CA-03, CA-05a.
- Pronto quando: o teste do projeto só com Vitest confere as regras gerais além da skill; há teste com os dois complementos juntos que confere que a stack não é reconhecida e a skill não é entregue; o gate passa.
- Teste: integração com o catálogo real. Como o comportamento já existe, os testes podem passar de primeira: para provar que não passam por acaso, inclua de propósito um complemento na lista do catálogo, confira que o teste falha e desfaça.
- Gate: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`. Sem typecheck nem formatador no projeto.
- Commit: um commit de teste, `Test :test_tube: [#125] ...`, só com `tests/standards.test.js` nos caminhos.
- Modelo: economico.
- Status: pendente.

## Riscos

- Conflito com as issues #126 (Playwright) e #129 (Redux Toolkit), feitas em paralelo por outros devs. Elas também mexem no `catalog.json` (seções `stacks` e `skills`), provavelmente em `tests/standards.test.js` (`technologyStacks`, `stackSkills` e testes de projeto só com uma tecnologia) e talvez em `profiles/`. Quem fizer o merge depois resolve o conflito mantendo as entradas das outras branches. Antes do PR, atualize a branch com a `main` e rode o gate de fase 2 de novo.
- A skill vai também para projetos com Testing Library e outro executor de testes (como Jest) e para projetos com Vitest sem tela. O CA-14 cobre isso no texto da skill.

## Dúvidas

Nenhuma. Decisões do usuário registradas na aprovação:

- D-PO-1: a stack `testing-library` é reconhecida pelos pacotes de ambiente e de framework (dom, react, vue, angular, svelte, preact e react-native). `@testing-library/user-event` e `@testing-library/jest-dom` sozinhos não a reconhecem, e o `@testing-library/react-hooks` fica de fora.
- D-PO-2: a skill vale também para projeto com Testing Library e Jest, sem Vitest, com texto neutro quanto ao executor de testes.
- D-PO-3: nenhum agente cita a skill agora. Isso fica para a issue #132.
- D-PO-4: a skill não entra em perfil manual.
- D-US-1: o nome `unit-component-testing` está aprovado.
- O teste "projeto só com Vitest recebe só os padrões gerais" muda de propósito (RN-11), e isso vai na descrição do PR.
