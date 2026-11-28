# @felipe-sant/claude-kit

## 1.2.0

### Minor Changes

- [#159](https://github.com/felipe-sant/claude-kit/pull/159) [`3e3cc83`](https://github.com/felipe-sant/claude-kit/commit/3e3cc836475715c56893063bda281fd34ce2ba8b) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Nova skill de TDD para todos os projetos, com o ciclo de teste primeiro, a tabela que liga cada critério a um teste e a prova de que os testes falham quando o comportamento quebra. Os devs, o executor e o revisor passam a usá-la.

- [#164](https://github.com/felipe-sant/claude-kit/pull/164) [`6f86be1`](https://github.com/felipe-sant/claude-kit/commit/6f86be17f6d49542a9fc2bb3144c0ab17facd685) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Nova skill de testes de unidade, de hook e de componente com Vitest e Testing Library, entregue a projetos que usam uma das duas ferramentas. A Testing Library passa a ser reconhecida pelos pacotes do projeto.

- [#162](https://github.com/felipe-sant/claude-kit/pull/162) [`6877a70`](https://github.com/felipe-sant/claude-kit/commit/6877a70239302c11083b0355acdb362f976a2647) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Nova skill de testes de ponta a ponta com Playwright e verificação de acessibilidade, entregue aos projetos que usam Playwright.

- [#153](https://github.com/felipe-sant/claude-kit/pull/153) [`46311b2`](https://github.com/felipe-sant/claude-kit/commit/46311b242f061335bf002b5ac41925e95d88024f) Thanks [@ajudante-jerry](https://github.com/apps/ajudante-jerry)! - Nova skill de QA exploratório de uma tela para projetos React, com as combinações a conferir e o relatório de falhas em formato fixo. O agente de QA passa a usá-la ao validar telas.

- [#163](https://github.com/felipe-sant/claude-kit/pull/163) [`a7b97e3`](https://github.com/felipe-sant/claude-kit/commit/a7b97e3c01fe1ff4ceecd488dad666b6314aff64) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Duas novas skills para projetos com Redux Toolkit: uma para criar fatias de estado e outra para criar endpoints de API com RTK Query. Elas chegam sozinhas aos projetos que usam a biblioteca.

- [#157](https://github.com/felipe-sant/claude-kit/pull/157) [`dccccd6`](https://github.com/felipe-sant/claude-kit/commit/dccccd62d5667ccd30b9e6c0f441978a318c58f7) Thanks [@felipe-sant](https://github.com/felipe-sant)! - O catálogo passa a reconhecer três tecnologias pelas dependências do projeto, inclusive as de desenvolvimento: Vitest, Playwright e Redux Toolkit. O conteúdo de cada uma chega nas próximas mudanças.

- [#158](https://github.com/felipe-sant/claude-kit/pull/158) [`8adab3a`](https://github.com/felipe-sant/claude-kit/commit/8adab3a1e8bcf1300958a44ac3cb89d68a1dd7b0) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Novo modelo de ganchos, aplicado a todos os projetos: barra commit e envio direto em branch protegida, envio forçado e remoção recursiva de arquivos, e formata e confere cada arquivo editado. A sincronização acrescenta os ganchos sem tirar os que o projeto já tem, e `CLAUDE_KIT_HOOKS_OFF=1` desliga tudo.

### Patch Changes

- [#165](https://github.com/felipe-sant/claude-kit/pull/165) [`854d78c`](https://github.com/felipe-sant/claude-kit/commit/854d78c745bafbc906721b765db32e0f33dd959c) Thanks [@felipe-sant](https://github.com/felipe-sant)! - O dev frontend, o revisor e o QA passam a seguir as regras e skills de frontend quando elas estão instaladas no projeto. O revisor bloqueia a entrega de tela que descumpre acessibilidade ou testes.

- [#156](https://github.com/felipe-sant/claude-kit/pull/156) [`bed9c6a`](https://github.com/felipe-sant/claude-kit/commit/bed9c6a6fb8f764e8818797fb819c58ae043bd60) Thanks [@ajudante-jerry](https://github.com/apps/ajudante-jerry)! - Em modo time, os devs chamam o agente de especificação sem nome, e ele sempre termina com o relatório no retorno. Se o relatório não chegar, o dev confere o arquivo e o último commit.

- [#161](https://github.com/felipe-sant/claude-kit/pull/161) [`18e8631`](https://github.com/felipe-sant/claude-kit/commit/18e8631e56eff55149f6341f719355fe5bde6f4d) Thanks [@ajudante-jerry](https://github.com/apps/ajudante-jerry)! - A regra de git agora explica como fechar uma mesclagem com conflito, que não aceita commit com caminhos.

## 1.1.0

### Minor Changes

- [#134](https://github.com/felipe-sant/claude-kit/pull/134) [`2c97c5e`](https://github.com/felipe-sant/claude-kit/commit/2c97c5e9a680f907447f421839bb7facf1179579) Thanks [@github-actions](https://github.com/apps/github-actions)! - Nova regra de TypeScript, aplicada sozinha aos projetos que usam TypeScript: modo estrito, sem any, sem conversão de tipo para calar erro e tipos explícitos nas funções públicas.

- [#139](https://github.com/felipe-sant/claude-kit/pull/139) [`7aa17c8`](https://github.com/felipe-sant/claude-kit/commit/7aa17c83aa288bb187caf9baa166d8c92e1cbd43) Thanks [@github-actions](https://github.com/apps/github-actions)! - Nova regra de frontend para projetos React, com as convenções de organização de arquivos, exportações e imports.

- [#144](https://github.com/felipe-sant/claude-kit/pull/144) [`6e8f8a9`](https://github.com/felipe-sant/claude-kit/commit/6e8f8a95a6389a48437b14d55c6d8e17a5aa6398) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Nova regra de textos de interface e tradução, aplicada sozinha quando o projeto usa uma biblioteca de tradução.

- [#146](https://github.com/felipe-sant/claude-kit/pull/146) [`74368ed`](https://github.com/felipe-sant/claude-kit/commit/74368ed1b8b805daac86f309a4476056c3370723) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Nova regra de acessibilidade para telas React. O revisor passa a conferir também as regras da stack instaladas, e a conferência visual fica com o QA e o designer.

- [#147](https://github.com/felipe-sant/claude-kit/pull/147) [`2dc529b`](https://github.com/felipe-sant/claude-kit/commit/2dc529bff4f406409a009031b3d3354c3cecba23) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Nova regra de testes de frontend para projetos React, que complementa o padrão de testes geral.

- [#148](https://github.com/felipe-sant/claude-kit/pull/148) [`a49d733`](https://github.com/felipe-sant/claude-kit/commit/a49d7337eb7d960b9248f9f4d7994282b046508a) Thanks [@felipe-sant](https://github.com/felipe-sant)! - A regra de segurança agora traz um roteiro para conferir um pacote novo antes de adicioná-lo: se está bem mantido, sem avisos de segurança, compatível com o projeto e se vale o peso. O resultado é registrado e pacote com problema grave só entra com decisão do dono.

- [#149](https://github.com/felipe-sant/claude-kit/pull/149) [`cedfcdc`](https://github.com/felipe-sant/claude-kit/commit/cedfcdc27ac0528d0e5022603f42d6073c717117) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Nova skill para projetos React que audita a acessibilidade de uma tela, separa o que é verificado automaticamente do que só uma pessoa confere e termina com a lista da conferência manual.

- [#142](https://github.com/felipe-sant/claude-kit/pull/142) [`a3c58b2`](https://github.com/felipe-sant/claude-kit/commit/a3c58b29a5e6870822bf094dd102de253da4df83) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Nova regra de estilo para projetos React: estilos isolados por componente, valores vindos das variáveis de design e sem estilo escrito direto na marcação.

### Patch Changes

- [#133](https://github.com/felipe-sant/claude-kit/pull/133) [`89384cf`](https://github.com/felipe-sant/claude-kit/commit/89384cfc6dbd59656413a72c89a28a378007e109) Thanks [@github-actions](https://github.com/apps/github-actions)! - A regra de React agora exige dependências completas em todos os hooks, lógica em hooks e serviços e item de lista com mais de 3 linhas em componente próprio.

## 1.0.0

### Major Changes

- [#112](https://github.com/felipe-sant/claude-kit/pull/112) [`a649493`](https://github.com/felipe-sant/claude-kit/commit/a649493373c889c38f896289dadc17b58fa2b490) Thanks [@felipe-sant](https://github.com/felipe-sant)! - Publica o claude-kit no npm como @felipe-sant/claude-kit, com versões numeradas e lançamento automático.
