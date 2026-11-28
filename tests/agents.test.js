const { test, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const h = require('./helpers')

afterEach(h.cleanup)

const catalog = JSON.parse(fs.readFileSync(path.join(h.repoRoot, 'catalog.json'), 'utf8'))

function body(name) {
  return fs.readFileSync(path.join(h.repoRoot, catalog.agents[name].path), 'utf8')
}

const committers = ['dev-frontend', 'dev-backend', 'dev-mobile', 'dev-devops', 'dev-database', 'dev-fullstack', 'dev-doc', 'executor']

test('todo agente que commita manda adicionar e commitar só os próprios arquivos, por caminho exato', () => {
  for (const name of committers) {
    const text = body(name)
    assert.match(text, /git-standard\.md/, `${name} deve citar o padrão de git`)
    assert.match(text, /git commit -m "\.\.\." -- caminhos/, `${name} deve mandar commitar por caminho`)
    assert.match(text, /git add \.`, `git add -A`, `git add -N`, `git add -u` nem `git commit -a/, `${name} deve proibir git add ., -A, -N, -u e commit -a`)
  }
})

test('todo agente que commita cita a exceção de tirar arquivo do controle de versão e remete à regra, sem repetir o passo a passo', () => {
  for (const name of committers) {
    const text = body(name)
    assert.match(text, /tirar um arquivo do controle de versão mantendo-o na pasta/, `${name} deve citar o caso`)
    assert.match(text, /git rm --cached/, `${name} deve citar git rm --cached`)
    assert.match(text, /tirar um arquivo do controle de versão mantendo-o na pasta[^\n]*\.claude\/rules\/git-standard\.md/, `${name} deve remeter à regra na mesma frase`)
    assert.match(text, /confira o stage antes, como manda `\.claude\/rules\/git-standard\.md`/, `${name} deve mandar conferir o stage antes, como manda a regra`)
    assert.ok(!text.includes('git diff --cached --name-status'), `${name} não deve repetir a conferência do stage`)
    assert.ok(!text.includes('git diff HEAD -- .gitignore'), `${name} não deve repetir a conferência do .gitignore`)
  }
})

test('o reviewer confere commit a commit se só há arquivos da própria tarefa', () => {
  assert.match(body('reviewer'), /commit a commit.*git-standard\.md/)
})

test('o padrão de git proíbe adicionar tudo, manda commitar por caminho e traz o rebase sem editor', () => {
  const text = fs.readFileSync(path.join(h.repoRoot, catalog.rules['git-standard'].path), 'utf8')

  for (const forbidden of ['git add .', 'git add -A', 'git add -N', '--intent-to-add', 'git add -u', 'git commit -a']) assert.ok(text.includes(forbidden), forbidden)
  assert.match(text, /git commit -m "[^"]+" -- caminho\/a\.ts caminho\/b\.ts/)
  assert.match(text, /git show --stat --name-status HEAD/)
  for (const recipe of ['GIT_SEQUENCE_EDITOR=true', "s/^pick/squash/", "s/^pick/drop/", "s/^pick/reword/", 'git cherry-pick', '--fixup=']) {
    assert.ok(text.includes(recipe), recipe)
  }
})

test('o padrão de git prevê como fechar uma mesclagem com conflito', () => {
  const text = fs.readFileSync(path.join(h.repoRoot, catalog.rules['git-standard'].path), 'utf8')

  assert.match(text, /fechar uma mesclagem em andamento/)
  assert.match(text, /git commit --no-edit/)
  assert.match(text, /worktree própria da tarefa/)
})

test('as receitas de commit por caminho e de histórico sem editor funcionam em um repositório', () => {
  const dir = h.tempDir('git')
  const git = (...args) => spawnSync('git', args, { cwd: dir, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } })
  const write = (file, content) => h.write(path.join(dir, file), content)

  git('init', '-q', '-b', 'main')
  for (const name of ['a', 'b', 'c']) {
    write(`${name}.txt`, `${name}\n`)
    git('add', `${name}.txt`)
    git('commit', '-q', '-m', `Base ${name}`)
  }

  write('deles.txt', 'outro\n')
  git('add', 'deles.txt')
  git('rm', '-q', 'c.txt')
  write('a.txt', 'a\nmudou\n')
  write('meu.txt', 'novo\n')
  git('add', 'a.txt', 'meu.txt')
  git('commit', '-q', '-m', 'Meu commit', '--', 'a.txt', 'meu.txt')

  const committed = git('show', '--name-only', '--format=', 'HEAD').stdout.trim().split('\n').sort()
  assert.deepEqual(committed, ['a.txt', 'meu.txt'])
  const staged = git('diff', '--cached', '--name-only').stdout.trim().split('\n').sort()
  assert.deepEqual(staged, ['c.txt', 'deles.txt'])

  git('reset', '-q')
  git('add', '-A')
  git('commit', '-q', '-m', 'Resto')
  for (const n of [1, 2, 3]) {
    write(`f${n}.txt`, `${n}\n`)
    git('add', `f${n}.txt`)
    git('commit', '-q', '-m', `Commit ${n}`)
  }
  const sequence = (script, editor) => spawnSync('git', ['rebase', '-i', 'HEAD~3'], {
    cwd: dir,
    encoding: 'utf8',
    env: { ...process.env, GIT_SEQUENCE_EDITOR: script, GIT_EDITOR: editor, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' }
  })
  const subjects = () => git('log', '--format=%s', '-3').stdout.trim().split('\n')

  assert.equal(sequence("sed -i '2s/^pick/drop/'", 'true').status, 0)
  assert.deepEqual(subjects().slice(0, 2), ['Commit 3', 'Commit 1'])
})

test('os agentes que commitam sabem que estão autorizados a commitar', () => {
  for (const name of committers) {
    const text = body(name)
    assert.match(text, /Você está autorizado a commitar/, `${name} deve saber que pode commitar`)
    assert.match(text, /não dependem de liberação do usuário/, `${name} não deve pedir liberação para commitar`)
  }
})

test('o padrão de git manda seguir a regra de coautoria do repositório e conferir o commit', () => {
  const text = fs.readFileSync(path.join(h.repoRoot, 'rules', 'git-standard.md'), 'utf8')

  assert.match(text, /## Coautoria/)
  assert.match(text, /Se ele proíbe a coautoria do Claude, nunca inclua `Co-Authored-By`/)
  assert.match(text, /confira com `git log -1` depois de cada commit/)
  assert.match(text, /Sem proibição no repositório/)
})

test('o padrão de git diz que a coautoria varia entre agentes e que um não impõe a atribuição ao outro', () => {
  const text = fs.readFileSync(path.join(h.repoRoot, 'rules', 'git-standard.md'), 'utf8')

  assert.match(text, /A coautoria pode variar entre os agentes da mesma branch/)
  assert.match(text, /Nunca peça a outro agente que troque a atribuição dele/)
})

test('os devs dizem que o formato da especificação, IDs incluídos, é do sdd', () => {
  const devs = committers.filter((name) => name.startsWith('dev-'))

  for (const name of devs) {
    assert.match(body(name), /formato da especificação, IDs de regra e critério incluídos, é definido pelo `sdd`/, `${name} deixa o formato com o sdd`)
  }
})

test('devs e executor proíbem stash, reset, restore e clean na worktree compartilhada e indicam a alternativa', () => {
  for (const name of committers) {
    const text = body(name)
    assert.match(text, /Na worktree compartilhada, nunca use `git stash`, `git reset`, `git restore` nem `git clean`/, `${name} proíbe stash e afins`)
    assert.match(text, /worktree própria, criada a partir do último commit/, `${name} indica a worktree própria para isolar falha`)
    assert.match(text, /avise o dono do arquivo/, `${name} avisa o dono do arquivo`)
  }
})

test('o padrão de git explica como isolar uma falha de teste sem tocar nos arquivos dos outros', () => {
  const text = fs.readFileSync(path.join(h.repoRoot, catalog.rules['git-standard'].path), 'utf8')

  assert.match(text, /## Isolar uma falha/)
  assert.match(text, /git worktree add/)
  assert.match(text, /avise o dono do arquivo e espere ele commitar/)
})

test('o sdd manda ordenar as tarefas que mudam fontes do conteúdo sincronizado, sem marcá-las como paralelas', () => {
  const text = body('sdd')

  assert.match(text, /mesmo arquivo gerado/)
  assert.match(text, /Não as marque com `\[P\]` entre si/)
  assert.match(text, /ordem fixa de commit/)
})

test('o padrão de git explica como commitar ao tirar um arquivo do controle de versão mantendo-o na pasta', () => {
  const text = fs.readFileSync(path.join(h.repoRoot, catalog.rules['git-standard'].path), 'utf8')

  assert.match(text, /git rm --cached/)
  assert.match(text, /git diff --cached --name-status/)
  assert.match(text, /apenas essa remoção e, quando houver, a linha que você mesmo acrescentou ao `\.gitignore` para esse arquivo/)
  assert.match(text, /git diff HEAD -- \.gitignore/)
  assert.match(text, /não adicione o `\.gitignore` e peça ao dono que commite antes/)
  assert.match(text, /peça ao dono que commite antes e espere ele commitar/)
  assert.match(text, /`git add \.`/)
  assert.match(text, /`git add -A`/)
  assert.match(text, /`git add -N`/)
  assert.match(text, /--intent-to-add/)
  assert.match(text, /`git add -u`/)
  assert.match(text, /`git commit -a`/)
  assert.match(text, /git commit -m "Feat :sparkles: \[#1\] Adiciona X" -- caminho\/a\.ts caminho\/b\.ts/)
})

const tddCiters = ['dev-frontend', 'dev-backend', 'dev-mobile', 'dev-devops', 'dev-database', 'dev-fullstack', 'executor', 'reviewer']
const executorCallers = ['dev-frontend', 'dev-backend', 'dev-mobile', 'dev-devops', 'dev-database', 'dev-fullstack']

test('devs que escrevem código, executor e reviewer citam a skill tdd', () => {
  for (const name of tddCiters) {
    assert.match(body(name), /skill `tdd`/, `${name} deve citar a skill tdd`)
  }
})

test('a instrução que o dev passa ao executor inclui a skill tdd', () => {
  for (const name of executorCallers) {
    assert.match(body(name), /as regras deste time: nunca escrever comentários, TDD em lógica e comportamento \(skill `tdd`\)/, `${name} deve mandar o executor usar a skill tdd`)
  }
})
