const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const repoRoot = path.resolve(__dirname, '..')
const catalog = JSON.parse(fs.readFileSync(path.join(repoRoot, 'catalog.json'), 'utf8'))

function body(name) {
  return fs.readFileSync(path.join(repoRoot, catalog.agents[name].path), 'utf8')
}

function teamSetup() {
  return fs.readFileSync(path.join(repoRoot, catalog.skills['team-setup'].path, 'SKILL.md'), 'utf8')
}

const devs = ['dev-frontend', 'dev-backend', 'dev-mobile', 'dev-devops', 'dev-database', 'dev-fullstack']

test('a orchestrator fecha cada tarefa concluída com a skill closed-in-context, sem delegar e sem avisar se faltar', () => {
  const text = teamSetup()
  assert.match(text, /`closed-in-context`/)
  assert.match(text, /você mesma a roda/)
  assert.match(text, /nunca delegue o fechamento/i)
  assert.match(text, /um fechamento por tarefa/i)
  assert.match(text, /sem avisar/)
})

test('a orchestrator só escreve o fechamento depois da entrega, com o link do pull request, e diz que a sessão continua', () => {
  const text = teamSetup()
  assert.match(text, /depois da entrega/i)
  assert.match(text, /link do pull request/i)
  assert.match(text, /resultado real/i)
  assert.match(text, /a sessão continua/i)
})

function deliveryComesBeforeClosing(text) {
  const offer = text.search(/ofereça entregar o trabalho \(abrir o pull request ou fazer o merge\)/)
  const closing = text.search(/escreva o fechamento da tarefa depois da entrega/)
  return offer !== -1 && closing !== -1 && offer < closing
}

test('a oferta de entrega vem antes do fechamento e só a remoção da worktree depende do pedido do usuário', () => {
  const text = teamSetup()
  const swapped = text
    .replace('ofereça entregar o trabalho (abrir o pull request ou fazer o merge)', 'XX')
    .replace('escreva o fechamento da tarefa depois da entrega', 'ofereça entregar o trabalho (abrir o pull request ou fazer o merge)')
    .replace('XX', 'escreva o fechamento da tarefa depois da entrega')

  assert.ok(deliveryComesBeforeClosing(text))
  assert.ok(!deliveryComesBeforeClosing(swapped))
  assert.match(text, /Só remova a worktree se o usuário pedir/)
  assert.doesNotMatch(text, /e só então remova a worktree, e apenas se o usuário pedir/)
})

test('o gate de cada tarefa inclui o typecheck e o de fase roda uma vez ao fim da fase', () => {
  for (const name of devs) {
    const text = body(name)
    assert.match(text, /Nunca commite sem o typecheck/, `${name} não pode commitar sem o typecheck`)
    assert.match(text, /`Typecheck lento`/, `${name} deve respeitar o aviso de typecheck lento`)
    assert.match(text, /`Gate de fase`.*build, suíte completa, lint completo e checagem de formatação completa/, `${name} deve rodar o gate de fase`)
    assert.match(text, /o lint e a checagem de formatação dos arquivos alterados \(quando o projeto tem formatador\)/, `${name} deve conferir a formatação no gate da tarefa`)
    assert.match(text, /incluindo o typecheck/, `${name} deve registrar o typecheck no status`)
  }
})

test('o executor não commita sem o typecheck e registra a evidência dele', () => {
  const text = body('executor')

  assert.match(text, /Nunca commite sem o typecheck/)
  assert.match(text, /incluindo o typecheck/)
  assert.match(text, /o lint e a checagem de formatação dos arquivos alterados \(quando o projeto tem formatador\)/)
})

test('o sdd escreve o gate rápido com typecheck e o gate de fase, e trata o typecheck lento', () => {
  const text = body('sdd')

  assert.match(text, /typecheck do projeto, quando existe, o teste da tarefa, o lint e a checagem de formatação dos arquivos alterados \(quando o projeto tem formatador\), nunca sem o typecheck/)
  assert.match(text, /`Gate de fase`: build, suíte completa, lint completo e checagem de formatação completa/)
  assert.match(text, /mesmas checagens que o CI/)
  assert.match(text, /`Typecheck lento`/)
  assert.doesNotMatch(text, /rápido, completo ou build/)
})

test('o reviewer confere a evidência do typecheck e roda o gate de fase uma vez no último commit', () => {
  const text = body('reviewer')

  assert.match(text, /evidência do gate, incluindo o typecheck/)
  assert.match(text, /`Gate de fase`.*uma vez no último commit/)
})

test('o orquestrador exige o gate com typecheck e o gate de fase', () => {
  assert.match(teamSetup(), /nunca sem o typecheck.*`Gate de fase`/s)
  assert.match(teamSetup(), /checagem de formatação/)
})

test('quem chama executor ou sdd avisa a orchestrator quando o agente não está disponível, e ela orienta o usuário', () => {
  for (const name of [...devs, 'dev-doc']) {
    const text = body(name)
    assert.match(text, /não está disponível na sessão/, `${name} deve avisar quando um agente faltar`)
    assert.match(text, /abrir uma sessão nova/, `${name} deve dizer a causa provável`)
    assert.match(text, /registrando no resumo final que não houve delegação/, `${name} deve registrar a falta de delegação`)
  }
  const orchestrator = teamSetup()
  assert.match(orchestrator, /não está disponível na sessão/)
  assert.match(orchestrator, /rodar o `ai-sync` e abrir uma sessão nova/)
})

test('o orquestrador identifica cada agente pelo nome seguido da função abreviada', () => {
  const text = teamSetup()

  assert.match(text, /## Nome com a função/)
  assert.match(text, /`Rika \(PO\)`/)
  for (const abbreviation of ['PO', 'Dev Front', 'Dev Back', 'Dev Mobile', 'Dev Ops', 'Dev DB', 'Dev Full', 'Dev Doc', 'Rev', 'QA', 'Design']) {
    assert.match(text, new RegExp(`\`${abbreviation}\``), `falta a abreviação ${abbreviation}`)
  }
  assert.match(text, /use `rika-po`/)
})

test('o orquestrador mostra uma tabela do que cada agente do time está fazendo', () => {
  const text = teamSetup()

  assert.match(text, /## Painel do time/)
  assert.match(text, /\| Agente \| Fazendo \| Estado \| Espera por \|/)
  assert.match(text, /trabalhando.*aguardando.*bloqueado.*pronto/s)
  assert.match(text, /antes de fazer uma pergunta ao usuário/)
  assert.match(text, /não repita a tabela se nada mudou/)
})

test('o modelo base não nega a leitura do .env e as regras mandam copiar sem expor o conteúdo', () => {
  const template = fs.readFileSync(path.join(repoRoot, 'templates', 'settings.base.json'), 'utf8')
  const security = fs.readFileSync(path.join(repoRoot, 'rules', 'security-standard.md'), 'utf8')

  assert.doesNotMatch(template, /\.env/)
  assert.match(security, /O `\.env` pode ser lido e copiado/)
  assert.match(security, /nunca imprima os valores/)
  assert.match(teamSetup(), /copia para ela, com `cp`, os arquivos de configuração locais/)
})

test('o padrão de segurança traz o roteiro de checagem antes de adicionar uma dependência', () => {
  const rule = ruleText('security-standard')

  assert.match(rule, /## Dependência nova/)
  assert.match(rule, /bem mantido/)
  assert.match(rule, /arquivado/)
  assert.match(rule, /avisos de segurança/)
  assert.match(rule, /compatível com as versões/)
  assert.match(rule, /poucas linhas/)
  assert.match(rule, /especificação ou na descrição do pull request/)
  assert.match(rule, /decisão do dono/)
})

test('só o sdd escreve na especificação e commita só o arquivo dela', () => {
  for (const name of [...devs, 'dev-doc']) {
    assert.match(body(name), /Não edite a especificação nem o `Status` dela/, `${name} não edita a especificação`)
    assert.match(body(name), /relate à orchestrator \(SendMessage para `main`\)/, `${name} relata o andamento à orchestrator em main`)
    assert.match(body(name), /Se o envio falhar, ponha a mesma evidência no relatório final/, `${name} tem alternativa se o envio falhar`)
  }
  assert.match(body('executor'), /Não edite a especificação nem o `Status` dela/)

  const sdd = body('sdd')
  assert.match(sdd, /^tools: .*Bash/m)
  assert.match(sdd, /`sdd` de andamento/)
  assert.match(sdd, /único agente que escreve no arquivo da especificação/)
  assert.match(sdd, /commite só o arquivo da especificação/)
  assert.match(sdd, /-- \.specs\/<arquivo>\.md/)

  const orchestrator = teamSetup()
  assert.match(orchestrator, /nunca editam a especificação/)
  assert.match(orchestrator, /única instância do `sdd` de andamento/)
})

test('devs e executor guardam a evidência do vermelho antes do código e o reviewer a cobra', () => {
  for (const name of [...devs, 'executor']) {
    const text = body(name)
    assert.match(text, /Não escreva código de produção antes de ter rodado o teste e visto falhar/, `${name} não escreve código antes do teste`)
    assert.match(text, /o teste que falhou antes/, `${name} relata o teste que falhou antes`)
  }
  assert.match(body('reviewer'), /a evidência do vermelho \(nome do teste e mensagem da falha\)/)
})

test('os relatórios são curtos e a orchestrator repassa resultado preso e ignora duplicata', () => {
  const orchestrator = teamSetup()
  assert.match(orchestrator, /## Relatórios e avisos/)
  assert.match(orchestrator, /de até 30 linhas/)
  assert.match(orchestrator, /repasse o conteúdo ao dev na hora/)
  assert.match(orchestrator, /aviso de ociosidade que repete um relatório já recebido é duplicata/)
  assert.match(orchestrator, /não reenvie a mesma tarefa mais de uma vez/)
  for (const name of devs) assert.match(body(name), /relatório final tem no máximo 30 linhas/, name)
})

test('o sdd sempre devolve o relatório e os devs conferem a especificação quando ele não chega', () => {
  assert.match(body('sdd'), /A última ação é sempre devolver esse relatório curto como o retorno da chamada a quem o chamou \(inclusive em modo time, sem nome\)/)
  for (const name of devs) {
    assert.match(body(name), /Se o `sdd` encerrar sem devolver o relatório, confira o arquivo da especificação em `\.specs\/` e o último commit dele/, name)
  }
})

test('os devs esperam o relatório do sdd antes de chamar outro e o sdd relê a especificação antes de editar', () => {
  assert.match(body('sdd'), /Antes de editar, confira se o arquivo da especificação mudou desde a sua última leitura/)
  for (const name of devs) {
    assert.match(body(name), /Depois de mandar mensagem a um `sdd` já existente, espere o relatório dele/, name)
  }
})

test('o README documenta a permissão de commit, a coautoria por repositório e o .env', () => {
  const readme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8')

  assert.match(readme, /### Commits, coautoria e `\.env`/)
  assert.match(readme, /"Bash\(git commit \*\)"/)
  assert.match(readme, /"attribution": \{ "commit": "", "pr": "" \}/)
})

test('a sessão principal vira a orchestrator pela skill team-setup, sem agente orchestrator', () => {
  const text = teamSetup()
  const profiles = fs.readdirSync(path.join(repoRoot, 'profiles'))
  const sync = fs.readFileSync(path.join(repoRoot, 'bin', 'ai-sync.js'), 'utf8')

  assert.equal(catalog.agents.orchestrator, undefined)
  assert.deepEqual(catalog.skills['team-setup'].applies, ['all'])
  for (const file of profiles) {
    const profile = JSON.parse(fs.readFileSync(path.join(repoRoot, 'profiles', file), 'utf8'))
    assert.ok(!profile.agents.includes('orchestrator'), `${file} não deve citar o agente orchestrator`)
    assert.ok(profile.skills.includes('team-setup'), `${file} deve incluir a skill team-setup`)
  }
  assert.match(sync, /\/team-setup/)
  assert.doesNotMatch(sync, /claude --agent orchestrator/)

  assert.match(text, /^name: team-setup$/m)
  assert.match(text, /a sessão principal/)
  assert.match(text, /`product-owner` não aparecer na lista de agentes/)
  assert.match(text, /Não use os agentes genéricos do Claude Code/)
  assert.doesNotMatch(text, /só porque, no modo time/)
  assert.match(text, /## Subagentes ou time de agentes/)
  assert.match(text, /`ai-sync --teams`/)
  assert.match(text, /A especificação continua sendo a única fonte de verdade/)
  assert.match(text, /consome bem mais/)
  assert.match(text, /Chame sempre cada agente com o nome escolhido/)
  assert.match(text, /SendMessage.*pelo nome/s)
})

test('os devs chamam o sdd e o executor com nome, com alternativa sem nome, e tratam o modo time', () => {
  for (const name of devs) {
    const text = body(name)
    assert.match(text, /Em modo time, chame-o sem nome, porque um integrante do time não pode criar agente com nome, e guarde o identificador/, `${name} chama o sdd sem nome em modo time`)
    assert.match(text, /Em time de agentes, se o `product-owner` for integrante/, `${name} pergunta ao product-owner direto no modo time`)
    assert.match(text, /rodarem um depois do outro/, `${name} aceita executores em sequência`)
  }
})

test('o README documenta os dois modos e o .claude/CLAUDE.md que o time é opcional', () => {
  const readme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8')
  const claude = fs.readFileSync(path.join(repoRoot, '.claude', 'CLAUDE.md'), 'utf8')

  assert.match(readme, /### Subagentes ou time de agentes/)
  assert.match(readme, /`node bin\/ai-sync\.js --teams`/)
  assert.match(readme, /O `ai-sync` nunca o liga sozinho/)
  assert.match(readme, /\| `--teams` \/ `--no-teams` \|/)
  assert.match(claude, /nunca é ligado sozinho/)
})

test('o reviewer pode criar worktrees descartáveis para as provas sem tocar na pasta principal nem na branch revisada', () => {
  const text = body('reviewer')

  assert.match(text, /worktree descartável/)
  assert.match(text, /sem tocar na pasta principal nem na branch revisada/)
})

test('o reviewer usa os jobs do CI, incluindo o build, como gate quando não há especificação', () => {
  const text = body('reviewer')

  assert.match(text, /Sem especificação.*mesmos jobs que o CI do repositório roda, incluindo o build/)
})

test('o reviewer confere quantos commits a branch está atrás da base e simula o merge', () => {
  const text = body('reviewer')

  assert.match(text, /quantos commits a branch está atrás da base/)
  assert.match(text, /simule o merge/)
  assert.match(text, /mudança de regra incompatível/)
})

test('o reviewer remove a worktree de revisão que criou e o orquestrador não mexe nela', () => {
  assert.match(body('reviewer'), /Remova ao fim da revisão a worktree de revisão que você criou, se não houver alteração sem commit/)
  assert.match(teamSetup(), /worktrees de revisão criadas pelo reviewer são removidas por ele/)
})

test('o sdd grava a especificação nova em em-revisao e o ciclo de vida não tem rascunho', () => {
  const sdd = body('sdd')

  assert.match(sdd, /Você grava a spec nova sempre como `em-revisao`/)
  assert.match(sdd, /Ciclo de vida: `em-revisao` → `aprovada`/)
  assert.doesNotMatch(sdd, /`rascunho`/)
  for (const name of devs) assert.doesNotMatch(body(name), /`rascunho`/, `${name} não cita rascunho como status`)
})

test('o perfil tooling serve repositórios de ferramentas, scripts e conteúdo, sem telas nem banco', () => {
  const profile = JSON.parse(fs.readFileSync(path.join(repoRoot, 'profiles', 'tooling.json'), 'utf8'))
  const readme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8')

  for (const agent of ['product-owner', 'sdd', 'executor', 'dev-backend', 'dev-devops', 'dev-doc', 'reviewer', 'qa']) {
    assert.ok(profile.agents.includes(agent), `tooling deve incluir ${agent}`)
  }
  for (const agent of ['dev-frontend', 'dev-mobile', 'dev-database', 'dev-fullstack', 'designer']) {
    assert.ok(!profile.agents.includes(agent), `tooling não deve incluir ${agent}`)
  }
  assert.ok(profile.skills.includes('team-setup'))
  assert.deepEqual(profile.settings, ['base', 'hooks'])
  assert.match(readme, /- `tooling`:/)
})

test('problema no próprio time vira issue no claude-kit, sem dado do projeto', () => {
  const rule = fs.readFileSync(path.join(repoRoot, catalog.rules['feedback-standard'].path), 'utf8')
  const readme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8')

  assert.deepEqual(catalog.rules['feedback-standard'].applies, ['all'])
  for (const file of fs.readdirSync(path.join(repoRoot, 'profiles'))) {
    const profile = JSON.parse(fs.readFileSync(path.join(repoRoot, 'profiles', file), 'utf8'))
    assert.ok(profile.rules.includes('feedback-standard'), `${file} deve incluir feedback-standard`)
  }
  assert.match(rule, /felipe-sant\/claude-kit/)
  assert.match(rule, /é público/)
  assert.match(rule, /gh issue list --repo felipe-sant\/claude-kit --state all --search/)
  assert.match(rule, /gh issue create --repo felipe-sant\/claude-kit --label bug/)
  assert.match(rule, /sem pedir confirmação/)
  assert.match(rule, /Nunca coloque na issue/)
  assert.match(rule, /`issue-standard`/)
  assert.doesNotMatch(rule, /## Impacto/)
  assert.match(rule, /relate o problema à orchestrator/)
  assert.match(teamSetup(), /`feedback-standard`/)
  assert.match(readme, /`feedback-standard`/)
})

function ruleText(name) {
  return fs.readFileSync(path.join(repoRoot, catalog.rules[name].path), 'utf8')
}

function assertGeneralRuleInAllProfiles(name) {
  assert.deepEqual(catalog.rules[name].applies, ['all'])
  for (const file of fs.readdirSync(path.join(repoRoot, 'profiles'))) {
    const profile = JSON.parse(fs.readFileSync(path.join(repoRoot, 'profiles', file), 'utf8'))
    assert.ok(profile.rules.includes(name), `${file} deve incluir ${name}`)
  }
}

test('o padrão de pull request e comentários define as seções, o fechamento da issue e o tom dos comentários', () => {
  const rule = ruleText('pull-request-standard')

  assertGeneralRuleInAllProfiles('pull-request-standard')
  assert.match(rule, /## O que muda.*## Como foi verificado.*## Observações/s)
  assert.doesNotMatch(rule, /\*\*O que muda\*\*/)
  assert.match(rule, /o que foi rodado, o resultado e o que não foi testado/)
  assert.match(rule, /Closes #/)
  assert.match(rule, /linguagem simples/)
  assert.match(rule, /sem caminhos/)
  assert.match(rule, /`commit-standard`/)
  assert.match(rule, /Uma ideia por comentário/)
  assert.match(rule, /código, não .* pessoa/)
  assert.match(rule, /`review-standard`/)
  assert.doesNotMatch(rule, /\*\*bloqueia\*\*/)
})

test('o padrão de issues define título, seções de bug e de funcionalidade, etiquetas e tamanho', () => {
  const rule = ruleText('issue-standard')

  assertGeneralRuleInAllProfiles('issue-standard')
  assert.match(rule, /issues do GitHub/)
  assert.match(rule, /frase em português simples/)
  assert.match(rule, /## O que aconteceu.*## Impacto.*## Causa provável.*## Sugestão/s)
  assert.match(rule, /## O que se quer.*## Por que.*## Critérios de aceite/s)
  assert.match(rule, /`bug`/)
  assert.match(rule, /`enhancement`/)
  assert.match(rule, /etiquetas que o projeto já tem/)
  assert.doesNotMatch(rule, /`feature`/)
  assert.match(rule, /Nunca defina tamanho nem prioridade/)
  assert.match(rule, /dono do projeto/)
  assert.match(rule, /agente de issues/)
  assert.match(rule, /`feedback-standard`/)
})

function skillText(name) {
  return fs.readFileSync(path.join(repoRoot, catalog.skills[name].path, 'SKILL.md'), 'utf8')
}

test('as skills de abrir pull request e de revisão seguem o pull-request-standard sem repetir o texto dele', () => {
  const create = skillText('create-pull-request')
  const review = skillText('code-review')

  assert.match(create, /`pull-request-standard`/)
  assert.match(review, /`pull-request-standard`/)
  assert.doesNotMatch(create, /O que muda/)
  assert.doesNotMatch(create, /Como foi verificado/)
  assert.doesNotMatch(create, /Observações/)
  assert.doesNotMatch(review, /Seja objetivo e fale do código, não da pessoa/)
})

test('não existe skill de criar issue', () => {
  assert.ok(!Object.keys(catalog.skills).some((name) => /issue/.test(name)))
})

test('o padrão de revisão aponta para o pull-request-standard na parte de comentários', () => {
  assert.match(ruleText('review-standard'), /`pull-request-standard`/)
})

test('o README lista as regras de pull request e de issues e a contagem das regras gerais', () => {
  const readme = fs.readFileSync(path.join(repoRoot, 'README.md'), 'utf8')

  assert.match(readme, /`pull-request-standard`/)
  assert.match(readme, /`issue-standard`/)
  assert.match(readme, /9 gerais e as de cada stack/)
  assert.match(readme, /as nove regras gerais/)
  assert.match(readme, /O que muda.*Como foi verificado.*Observações/s)
})

const frontendRules = ['react-standard', 'react-organization-standard', 'style-standard', 'accessibility-standard', 'frontend-testing-standard', 'typescript-standard', 'i18n-standard']
const frontendSkills = ['react-component', 'unit-component-testing', 'playwright-e2e', 'redux-slice', 'rtk-query-endpoint']

test('o dev-frontend lê as regras de frontend instaladas antes de implementar e cita as skills de frontend', () => {
  const text = body('dev-frontend')

  for (const rule of frontendRules) assert.match(text, new RegExp('`' + rule + '`'), `deve citar ${rule}`)
  for (const skill of frontendSkills) assert.match(text, new RegExp('`' + skill + '`'), `deve citar ${skill}`)
  assert.match(text, /Antes de implementar, leia as regras de frontend que estiverem instaladas em `\.claude\/rules\/`/)
  assert.match(text, /se estiverem instaladas/)
  assert.match(text, /Regra que não está instalada não se aplica/)
})

test('o reviewer confere mudança de tela contra as regras de frontend instaladas e bloqueia descumprimento de acessibilidade e de testes', () => {
  const text = body('reviewer')

  for (const rule of frontendRules) assert.match(text, new RegExp('`' + rule + '`'), `deve citar ${rule}`)
  assert.match(text, /Em mudança que mexe em tela, confira a entrega contra as regras de frontend que estiverem instaladas/)
  assert.match(text, /Descumprir qualquer item de `accessibility-standard`, de `frontend-testing-standard` ou de `testing-standard` em mudança de tela bloqueia a entrega/)
  assert.match(text, /Sem tela ou sem essas regras instaladas, não exija as regras de frontend nem bloqueie por elas/)
})

test('o qa cita as skills de QA exploratório e de auditoria de acessibilidade, cada uma se estiver instalada', () => {
  const text = body('qa')

  assert.match(text, /use a skill `exploratory-qa`, se estiver instalada/)
  assert.match(text, /use a skill `accessibility-audit`, se estiver instalada/)
  assert.doesNotMatch(text, /playwright-e2e/)
  assert.doesNotMatch(text, /unit-component-testing/)
})

test('o reviewer só bloqueia pelo que o código mostra e deixa o que depende de ver a tela com o qa e o designer', () => {
  assert.match(body('reviewer'), /no que o código mostra.*o que depende de ver a tela \(aparência, foco na prática, leitor de tela\) fica com o `qa` e o `designer`/)
})
