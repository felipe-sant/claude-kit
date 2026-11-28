# Skills de estado no cliente: fatia de estado e endpoint de API (Redux Toolkit)

> Status: implementada (código aprovado pelo reviewer, sem achado bloqueante; T4, pedida pelo reviewer, feita)
> Tipo: funcionalidade
> Tamanho: media
> Branch: feat/129-skills-redux-toolkit
> Criada em: 2026-11-28

## Objetivo

Estado da aplicação e dados vindos do servidor são onde mais aparece código diferente para a mesma coisa. A issue #129 pede duas skills para projetos que usam Redux Toolkit: uma para criar uma fatia de estado e outra para criar endpoints de API com RTK Query. Elas chegam sozinhas aos projetos que usam a biblioteca e mantêm um jeito único de fazer, sem passar por cima da convenção que o projeto já tenha.

## Regras

- RN-01: Duas skills novas, uma para criar uma fatia de estado e outra para criar endpoints de API com RTK Query. Fonte: issue #129.
- RN-02: As duas skills são entregues só aos projetos que usam Redux Toolkit, reconhecidos pelas dependências (o pacote `@reduxjs/toolkit`, em dependências normais ou de desenvolvimento). A stack já existe no catálogo, desde a issue #130. Fonte: issue #129 e issue #130.
- RN-03: A skill de fatia de estado cobre: o registro da fatia no estado geral da aplicação, os hooks tipados para ler e alterar o estado, seletores estreitos (cada tela lê só o pedaço de que precisa) e o teste feito com o estado geral de verdade. Fonte: issue #129.
- RN-04: A skill de endpoint de API cobre: os endpoints agrupados e injetados por assunto (domínio), as etiquetas de cache que dizem o que recarregar depois de uma alteração, o uso dos hooks gerados pela biblioteca e o teste com a requisição simulada. Fonte: issue #129.
- RN-04a: Nas duas skills, os passos com hooks (hooks tipados e hooks gerados do RTK Query) dizem que valem só em projetos com React. As skills não trazem equivalentes sem hooks. Fonte: decisão do usuário.
- RN-04b: Quando o projeto não tem ferramenta de simulação de requisição, a skill de endpoint lembra o roteiro de "Dependência nova" do padrão de segurança e sugere o MSW, sem instalar nada. Fonte: decisão do usuário.
- RN-05: As duas skills dizem que, quando o projeto tem uma convenção própria, ela vence a da skill. Fonte: issue #129.
- RN-06: As duas skills seguem o mesmo formato das skills de stack que já existem: dizem quando usar, o que entregam e os passos, com o teste escrito primeiro. Fonte: padrão das skills atuais do catálogo.
- RN-07: Projetos que não usam Redux Toolkit continuam recebendo exatamente o mesmo conteúdo de antes. Fonte: issue #130 (projeto que não usa a tecnologia não recebe o conteúdo dela).
- RN-08: Comportamento atual, mantido: uma stack só aparece como detectada quando tem conteúdo no catálogo. Com as skills novas, a stack Redux Toolkit passa a aparecer como detectada nos projetos que a usam. Fonte: decisão do usuário na issue #130 (D-PO-1).

## Critérios de aceite

- CA-01: QUANDO um projeto lista o Redux Toolkit nas dependências normais e é sincronizado ENTÃO a sincronização DEVE informar a stack Redux Toolkit como detectada e entregar as duas skills novas, além das skills gerais. (RN-01, RN-02, RN-08)
- CA-02: QUANDO um projeto lista o Redux Toolkit só nas dependências de desenvolvimento ENTÃO a sincronização DEVE entregar as duas skills novas do mesmo jeito. (RN-02)
- CA-03: QUANDO um projeto usa React e Redux Toolkit ao mesmo tempo ENTÃO ele DEVE receber as skills das duas stacks e de mais nenhuma. (RN-02)
- CA-04: QUANDO um projeto não usa Redux Toolkit (por exemplo, só React, só NestJS, ou só o pacote `redux` sem o Toolkit) ENTÃO ele NÃO DEVE receber nenhuma das duas skills novas. (RN-02, RN-07)
- CA-05: QUANDO alguém abre a skill de fatia de estado ENTÃO ela DEVE dizer quando usá-la, o que entrega e trazer passos que cubram registro no estado geral, hooks tipados, seletores estreitos e teste com o estado geral de verdade, com o teste escrito primeiro. (RN-03, RN-06)
- CA-06: QUANDO alguém abre a skill de endpoint de API ENTÃO ela DEVE dizer quando usá-la, o que entrega e trazer passos que cubram endpoints injetados por assunto, etiquetas de cache, hooks gerados e teste com a requisição simulada, com o teste escrito primeiro. (RN-04, RN-06)
- CA-07: QUANDO alguém abre qualquer uma das duas skills ENTÃO ela DEVE dizer, com a mesma frase nas duas, que a convenção própria do projeto vence a da skill. (RN-05)
- CA-07a: QUANDO alguém abre qualquer uma das duas skills ENTÃO os passos com hooks DEVEM dizer que valem só com React, e a skill NÃO DEVE trazer equivalentes sem hooks. (RN-04a)
- CA-07b: QUANDO alguém abre a skill de endpoint e o projeto não tem ferramenta de simulação de requisição ENTÃO a skill DEVE lembrar o roteiro de "Dependência nova" e sugerir o MSW, sem mandar instalar nada por conta própria. (RN-04b)
- CA-08: QUANDO a checagem de formato do conteúdo e a checagem do catálogo rodam ENTÃO elas DEVEM passar sem erro com as duas skills novas registradas. (RN-06)
- CA-09: QUANDO a pessoa edita no projeto uma das skills novas e sincroniza de novo ENTÃO a sincronização NÃO DEVE sobrescrever a edição, como já acontece com as outras skills. (RN-07)

## Critérios de sucesso

- Um projeto com Redux Toolkit passa a receber as duas skills sem nenhuma configuração manual.
- Os testes provam a entrega das skills para quem usa a biblioteca, a ausência para quem não usa e o formato das duas skills.
- Lint, testes e checagem do catálogo passam no CI, e os projetos sem Redux Toolkit recebem o mesmo conteúdo de antes.

## Fora do escopo

- Regra de padrão (arquivo de regras) para Redux Toolkit: a issue pede só as skills.
- Skills e regras de Vitest e Playwright: outras issues.
- Mudar a detecção das stacks: ela já existe desde a issue #130.
- Atualizar o README: ele não lista as skills uma a uma, só fala em "skills gerais" e nas de cada stack.
- Entregar as skills ao próprio repositório do `claude-kit`: o perfil que ele usa não tem Redux Toolkit.

## Plano de execução

- Fase 1 (paralelo): T1 [P] e T2 [P]. Cada uma cria só um arquivo novo, em pastas diferentes. Conferido no hook de commit: ele compara só o que o perfil `tooling` gera, e esse perfil não usa as skills de stack, então os dois commits não disputam os arquivos gerados.
- Gate de fase 1: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`, uma vez ao fim da fase.
- Fase 2 (sequencial): T3, depois do commit de T1 e de T2 (o registro no catálogo exige que as pastas das skills existam).
- Gate de fase 2: `npm run lint`, `npm test`, `node bin/ai-sync.js --check` e `npm pack --dry-run` (confirma que as duas skills vão no pacote), uma vez ao fim da fase e antes do reviewer.
- Fase 3 (pedido do reviewer na revisão, sequencial): T4.
- Gate de fase 3: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`.
- O projeto não tem typecheck, build nem formatador: é JavaScript puro, sem TypeScript, e o lint é o oxlint mais a checagem de formato do conteúdo. Por isso os gates não têm typecheck nem checagem de formatação.

## Tarefas

### T1 [P] Escrever a skill de fatia de estado
- O quê: criar a skill `redux-slice`, que guia a criação de uma fatia de estado com Redux Toolkit.
- Onde: `stacks/redux-toolkit/skills/redux-slice/SKILL.md` (pasta nova).
- Dev: dev-frontend-3.
- Depende de: nada.
- Reaproveita: o formato de `stacks/react/skills/react-component/SKILL.md` (cabeçalho com `name` e `description`, título, linha `Entrega:`, seção `## Passos` numerada, último passo rodando lint, teste e checagem de tipos do projeto).
- Atende: RN-01, RN-03, RN-04a, RN-05, RN-06, CA-05, CA-07, CA-07a.
- Pronto quando:
  - o cabeçalho tem `name: redux-slice` (igual ao nome da pasta) e uma `description` de até 1024 caracteres que contém "Use quando";
  - o texto tem a linha `Entrega:` (a fatia registrada no estado geral, os hooks e seletores e o teste);
  - os passos cobrem, nesta ordem: olhar fatias parecidas e seguir a estrutura do projeto; definir o formato do estado e as ações; escrever primeiro o teste com o estado geral de verdade (montado como na aplicação, não com dublê) e vê-lo falhar; criar a fatia com `createSlice`; registrá-la no estado geral; usar os hooks tipados do projeto (ou criá-los, se não existirem) em vez dos hooks sem tipo, dizendo que este passo vale só com React; criar seletores estreitos, que devolvem só o pedaço usado pela tela; rodar lint, teste e checagem de tipos;
  - o texto contém exatamente a frase `Se o projeto já tem uma convenção própria, ela vence esta skill.`;
  - nenhum código de exemplo tem comentário;
  - o gate passa.
- Teste: nenhum novo nesta tarefa. A checagem de formato do conteúdo já varre as skills dentro de `stacks/` e roda no `npm run lint`; os testes de conteúdo e da frase de convenção entram em T3, quando a skill é registrada.
- Gate: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`. Sem typecheck nem formatador no projeto.
- Commit: `Feat :sparkles: [#129] Adiciona a skill de fatia de estado do Redux Toolkit`, com o caminho explícito do arquivo. Rode `git status --short` antes e `git show --stat HEAD` depois.
- Modelo: padrao.
- Status: feita (commit 079c718; skill redux-slice; sem teste novo, coberta pelo teste de formato existente; gate ok: lint, 740 testes, --check).

### T2 [P] Escrever a skill de endpoint de API com RTK Query
- O quê: criar a skill `rtk-query-endpoint`, que guia a criação de endpoints de API com RTK Query.
- Onde: `stacks/redux-toolkit/skills/rtk-query-endpoint/SKILL.md` (pasta nova).
- Dev: dev-frontend-3.
- Depende de: nada.
- Reaproveita: o mesmo formato de `stacks/react/skills/react-component/SKILL.md` e de `stacks/nestjs/skills/nestjs-module/SKILL.md`.
- Atende: RN-01, RN-04, RN-04a, RN-04b, RN-05, RN-06, CA-06, CA-07, CA-07a, CA-07b.
- Pronto quando:
  - o cabeçalho tem `name: rtk-query-endpoint` (igual ao nome da pasta) e uma `description` de até 1024 caracteres que contém "Use quando";
  - o texto tem a linha `Entrega:` (os endpoints injetados, as etiquetas de cache, o uso dos hooks gerados e o teste);
  - os passos cobrem, nesta ordem: achar a API base do projeto e os arquivos de endpoints por assunto e seguir a estrutura deles; definir o contrato (rotas, entradas, saídas e erros); escrever primeiro o teste com a requisição simulada, usando a ferramenta de simulação que o projeto já tem (se não houver, lembrar o roteiro de "Dependência nova" e sugerir o MSW, sem instalar nada), e vê-lo falhar; criar os endpoints em um arquivo do assunto com `injectEndpoints`, sem crescer a API base; declarar as etiquetas de cache (`providesTags` nas consultas e `invalidatesTags` nas alterações); usar nas telas os hooks gerados pela biblioteca, sem chamada manual de requisição, dizendo que este passo vale só com React; rodar lint, teste e checagem de tipos;
  - o texto contém exatamente a frase `Se o projeto já tem uma convenção própria, ela vence esta skill.`;
  - nenhum código de exemplo tem comentário;
  - o gate passa.
- Teste: nenhum novo nesta tarefa, pelo mesmo motivo de T1.
- Gate: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`. Sem typecheck nem formatador no projeto.
- Commit: `Feat :sparkles: [#129] Adiciona a skill de endpoint de API com RTK Query`, com o caminho explícito do arquivo. Rode `git status --short` antes e `git show --stat HEAD` depois.
- Modelo: padrao.
- Status: feita (commit 54e42df; skill rtk-query-endpoint, com MSW sugerido sem instalar e hooks só com React; gate ok).

### T3 Registrar as duas skills no catálogo e cobrir com testes
- O quê: registrar `redux-slice` e `rtk-query-endpoint` no catálogo com `applies` `["redux-toolkit"]`, testar detecção, instalação e formato, e criar a nota de mudança minor.
- Onde: `catalog.json` (seção `skills`), `tests/standards.test.js`, nova nota em `.changeset/` (nome livre, por exemplo `feat-129-skills-redux-toolkit.md`).
- Dev: dev-frontend-3.
- Depende de: T1 e T2 (commitadas).
- Reaproveita: as entradas de skill de stack do catálogo (`react-component`, `nestjs-module`); em `tests/standards.test.js`, os objetos `projects`, `stackRules` e `stackSkills`, os laços "recebe os padrões gerais e só os de" e "recebe as skills gerais e só as da própria stack", o teste "projeto com React e NestJS recebe as skills das duas stacks", o teste "cada skill do catálogo diz quando usar e o que entrega" e o teste "skill editada no projeto não é sobrescrita"; a nota `.changeset/feat-128-skill-qa-exploratorio.md` como modelo.
- Atende: RN-01, RN-02, RN-04a, RN-04b, RN-05, RN-06, RN-07, RN-08, CA-01, CA-02, CA-03, CA-04, CA-07, CA-07a, CA-07b, CA-08, CA-09.
- Pronto quando:
  - o catálogo tem as duas entradas, com `path` `stacks/redux-toolkit/skills/<nome>`, `applies` `["redux-toolkit"]` e `description` curta em português;
  - em `tests/standards.test.js`: `projects` ganha `redux-toolkit` com `@reduxjs/toolkit` nas dependências normais; `stackRules` ganha `redux-toolkit: []` (sem isso o laço de regras quebra com erro de tipo, e não pelo motivo certo); `stackSkills` ganha `redux-toolkit: ['redux-slice', 'rtk-query-endpoint']`. Com isso os laços existentes cobrem CA-01 (inclusive a linha "Stacks detectadas: redux-toolkit") e CA-04 para as outras stacks;
  - há um teste para CA-02 (Redux Toolkit só em dependências de desenvolvimento recebe as duas skills);
  - há um teste para CA-03 com o catálogo real (React e Redux Toolkit no mesmo projeto recebem exatamente as skills gerais, as três de React e as duas novas);
  - há um teste para CA-04 com o pacote `redux` sem o Toolkit (não recebe as skills novas);
  - há um teste para CA-07: toda skill do catálogo com `applies` `redux-toolkit` contém a frase `Se o projeto já tem uma convenção própria, ela vence esta skill.`;
  - há um teste de conteúdo para CA-07a e CA-07b: as duas skills dizem que os passos com hooks valem só com React, e a de endpoint cita o roteiro de "Dependência nova" e o MSW;
  - CA-08 fica coberto pelo teste existente "cada skill do catálogo diz quando usar e o que entrega", pelo teste de formato do repositório em `tests/content.test.js` e pelo `--check`; CA-09 fica coberto pelo teste existente de skill editada, que vale para qualquer skill;
  - o teste "projeto só com Vitest recebe só os padrões gerais" segue passando sem mudança;
  - a nota existe com o cabeçalho `"@felipe-sant/claude-kit": minor` e uma ou duas linhas em português simples;
  - `npm pack --dry-run` lista as duas `SKILL.md`;
  - o gate passa.
- Teste: unitário de conteúdo e integração do `ai-sync` com o catálogo real, em `tests/standards.test.js`. Falha primeiro: o laço "projeto redux-toolkit recebe as skills gerais e só as da própria stack", que espera as duas skills e falha porque elas ainda não estão no catálogo. Depois o de CA-02, o de CA-03 e o de CA-07; o de CA-04 com `redux` puro já passa hoje e protege o limite.
- Gate: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`. Sem typecheck nem formatador no projeto.
- Commit: `Feat :sparkles: [#129] Registra as skills de Redux Toolkit no catálogo`, com os caminhos explícitos (catálogo, teste e nota). O catálogo é fonte sincronizada: antes de commitar, rode `npm run sync` e inclua nos caminhos os arquivos de `.claude/` que mudarem (provavelmente nenhum, já que o perfil `tooling` não usa essa stack). O hook recusa o commit por caminhos sem eles.
- Modelo: padrao.
- Status: feita (commit a7b97e3; catálogo, testes com 5 falhas antes e nota de mudança minor; gate ok: lint, 746 testes, --check, npm pack lista as duas skills).

### T4 Testes de conteúdo de CA-07a e CA-07b e conferência das stacks detectadas (pedido do reviewer)
- O quê: acrescentar os testes de conteúdo que provam CA-07a e CA-07b e conferir a linha "Stacks detectadas" nos testes de entrega das skills.
- Onde: `tests/standards.test.js`.
- Dev: dev-frontend-3.
- Depende de: T3.
- Reaproveita: os testes de conteúdo e de entrega criados em T3.
- Atende: RN-04a, RN-04b, RN-08; CA-01, CA-07a, CA-07b.
- Pronto quando: há teste que confere nas duas skills que os passos com hooks valem só com React; há teste que confere na skill de endpoint o roteiro de "Dependência nova" e o MSW; os testes de entrega conferem "Stacks detectadas: redux-toolkit"; o gate passa.
- Teste: unitário de conteúdo e integração. Como as skills já existem, os testes podem passar de primeira: para provar que não passam por acaso, retire de propósito o trecho conferido da skill, confira que falha e desfaça.
- Gate: `npm run lint`, `npm test` e `node bin/ai-sync.js --check`. Sem typecheck nem formatador no projeto.
- Commit: um commit de teste, `Test :test_tube: [#129] ...`, só com `tests/standards.test.js` nos caminhos.
- Modelo: economico.
- Status: feita (commit de1cd8e; testes de conteúdo para CA-07a e CA-07b e conferência de "Stacks detectadas" no caso de dependências de desenvolvimento; os testes de conteúdo passaram de primeira porque as frases já estavam nas skills, e a prova de retirar o trecho de propósito não foi relatada; gate ok: lint, 748 testes).

## Dúvidas

Nenhuma. Decisões do usuário registradas na aprovação:

- As skills se chamam `redux-slice` e `rtk-query-endpoint`.
- D-PO-1: opção (b). Os passos com hooks valem só com React, e as skills não trazem equivalentes sem hooks (RN-04a).
- D-US-1: sem ferramenta de simulação de requisição, a skill de endpoint lembra o roteiro de "Dependência nova" e sugere o MSW, sem instalar nada (RN-04b).
- O dev-frontend-3 é o único dev da issue, então as tarefas ficam com ele.
