const { test, afterEach } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const h = require('./helpers')

afterEach(h.cleanup)

const script = path.join(h.repoRoot, 'bin', 'ai-sync.js')
const catalog = JSON.parse(fs.readFileSync(path.join(h.repoRoot, 'catalog.json'), 'utf8'))
const general = ['code-standard', 'testing-standard', 'security-standard', 'review-standard', 'commit-standard', 'git-standard', 'feedback-standard', 'pull-request-standard', 'issue-standard']
const stackRules = {
  react: ['react-standard', 'style-standard', 'react-organization-standard', 'frontend-testing-standard', 'accessibility-standard'],
  nestjs: ['nestjs-standard'],
  laravel: ['laravel-standard'],
  adonisjs: ['adonisjs-standard'],
  typescript: ['typescript-standard']
}

function sync(target, ...args) {
  const result = spawnSync('node', [script, target, ...args], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return result.stdout
}

function rulesOf(target) {
  const dir = path.join(target, '.claude', 'rules')
  return fs.existsSync(dir) ? fs.readdirSync(dir).map((f) => f.replace('.md', '')).sort() : []
}

const projects = {
  react: { 'package.json': JSON.stringify({ dependencies: { react: '18' } }) },
  nestjs: { 'package.json': JSON.stringify({ dependencies: { '@nestjs/core': '10' } }) },
  laravel: { 'composer.json': JSON.stringify({ require: { 'laravel/framework': '11' } }) },
  adonisjs: { 'package.json': JSON.stringify({ dependencies: { '@adonisjs/core': '6' } }) },
  typescript: { 'package.json': JSON.stringify({ devDependencies: { typescript: '5' } }) }
}

for (const [stack, files] of Object.entries(projects)) {
  test(`projeto ${stack} recebe os padrões gerais e só os de ${stack}`, () => {
    const target = h.makeTarget(files)
    const output = sync(target)

    assert.match(output, new RegExp(`Stacks detectadas: ${stack}$`, 'm'))
    assert.deepEqual(rulesOf(target), [...general, ...stackRules[stack]].sort())
  })
}

test('projeto com React e NestJS recebe os padrões das duas stacks e de mais nenhuma', () => {
  const target = h.makeTarget({
    'web/package.json': projects.react['package.json'],
    'api/package.json': projects.nestjs['package.json']
  })
  sync(target)

  assert.deepEqual(rulesOf(target), [...general, ...stackRules.react, ...stackRules.nestjs].sort())
})

for (const dependency of ['i18next', 'react-i18next', 'next-intl', 'vue-i18n']) {
  test(`projeto com ${dependency} recebe o padrão de tradução`, () => {
    const target = h.makeTarget({ 'package.json': JSON.stringify({ dependencies: { [dependency]: '1' } }) })
    const output = sync(target)

    assert.match(output, /Stacks detectadas: i18n$/m)
    assert.deepEqual(rulesOf(target), [...general, 'i18n-standard'].sort())
  })
}

test('projeto Laravel com pacote de idiomas recebe o padrão de tradução e o do Laravel', () => {
  const target = h.makeTarget({ 'composer.json': JSON.stringify({ require: { 'laravel/framework': '11', 'laravel-lang/lang': '15' } }) })
  sync(target)

  assert.deepEqual(rulesOf(target), [...general, 'laravel-standard', 'i18n-standard'].sort())
})

test('projeto sem biblioteca de tradução não recebe o padrão de tradução', () => {
  const target = h.makeTarget(projects.react)
  sync(target)

  assert.ok(!rulesOf(target).includes('i18n-standard'))
})

test('projeto com React e TypeScript recebe os padrões das duas stacks', () => {
  const target = h.makeTarget({
    'package.json': JSON.stringify({ dependencies: { react: '18' }, devDependencies: { typescript: '5' } })
  })
  const output = sync(target)

  assert.match(output, /Stacks detectadas: .*typescript/)
  assert.deepEqual(rulesOf(target), [...general, ...stackRules.react, ...stackRules.typescript].sort())
})

test('projeto sem stack conhecida recebe só os padrões gerais', () => {
  const target = h.makeTarget()
  sync(target)

  assert.deepEqual(rulesOf(target), [...general].sort())
})

test('padrão editado no projeto não é apagado nem sobrescrito pela próxima sincronização', () => {
  const target = h.makeTarget(projects.react)
  sync(target)
  const file = path.join(target, '.claude', 'rules', 'react-standard.md')
  const edited = `${fs.readFileSync(file, 'utf8')}- Regra do meu projeto.\n`
  fs.writeFileSync(file, edited)
  const output = sync(target)

  assert.equal(fs.readFileSync(file, 'utf8'), edited)
  assert.match(output, /react-standard\.md: você editou este arquivo/)
})

test('cada padrão de stack se limita aos arquivos da stack e todo padrão é curto', () => {
  for (const [name, item] of Object.entries(catalog.rules)) {
    const text = fs.readFileSync(path.join(h.repoRoot, item.path), 'utf8')
    const lines = text.split('\n').length
    assert.ok(lines <= 60, `${name} tem ${lines} linhas`)
    if (!item.applies.includes('all')) {
      assert.match(text, /^---\npaths:\n/, `${name} deve declarar paths`)
    }
  }
})

const generalSkills = ['bug-investigation', 'code-review', 'commit-message', 'create-pull-request', 'documentation', 'tdd', 'team-setup']
const stackSkills = { react: ['react-component', 'accessibility-audit', 'exploratory-qa'], nestjs: ['nestjs-module'] }

function skillsOf(target) {
  const dir = path.join(target, '.claude', 'skills')
  return fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []
}

for (const [stack, files] of Object.entries(projects)) {
  test(`projeto ${stack} recebe as skills gerais e só as da própria stack`, () => {
    const target = h.makeTarget(files)
    sync(target)
    const expected = stackSkills[stack] ? [...generalSkills, ...stackSkills[stack]] : generalSkills

    assert.deepEqual(skillsOf(target), [...expected].sort())
    for (const skill of expected) assert.ok(h.exists(target, `.claude/skills/${skill}/SKILL.md`))
  })
}

test('projeto com React e NestJS recebe as skills das duas stacks', () => {
  const target = h.makeTarget({
    'web/package.json': projects.react['package.json'],
    'api/package.json': projects.nestjs['package.json']
  })
  sync(target)

  assert.deepEqual(skillsOf(target), [...generalSkills, 'react-component', 'accessibility-audit', 'exploratory-qa', 'nestjs-module'].sort())
})

test('skill editada no projeto não é sobrescrita e uma skill do usuário nunca é tocada', () => {
  const target = h.makeTarget({
    ...projects.react,
    '.claude/skills/minha-skill/SKILL.md': '---\nname: minha-skill\ndescription: x\n---\n'
  })
  sync(target)
  const file = path.join(target, '.claude', 'skills', 'code-review', 'SKILL.md')
  const edited = `${fs.readFileSync(file, 'utf8')}\nMinha regra.\n`
  fs.writeFileSync(file, edited)
  const output = sync(target)

  assert.equal(fs.readFileSync(file, 'utf8'), edited)
  assert.match(output, /code-review\/SKILL\.md: você editou este arquivo/)
  assert.ok(h.exists(target, '.claude/skills/minha-skill/SKILL.md'))
})

test('cada skill do catálogo diz quando usar e o que entrega', () => {
  for (const [name, item] of Object.entries(catalog.skills)) {
    const text = fs.readFileSync(path.join(h.repoRoot, item.path, 'SKILL.md'), 'utf8')
    assert.match(text, /description: .*(Use quando|Use para)/, `${name} deve dizer quando usar`)
    assert.match(text, /Entrega:/, `${name} deve dizer o que entrega`)
  }
})

test('a skill de TDD vale para todos, está em todos os perfis e cobre os pontos da issue', () => {
  assert.deepEqual(catalog.skills.tdd.applies, ['all'])
  for (const file of fs.readdirSync(path.join(h.repoRoot, 'profiles'))) {
    const profile = JSON.parse(fs.readFileSync(path.join(h.repoRoot, 'profiles', file), 'utf8'))
    assert.ok(profile.skills.includes('tdd'), `${file} deve trazer a skill tdd`)
  }
  const text = fs.readFileSync(path.join(h.repoRoot, catalog.skills.tdd.path, 'SKILL.md'), 'utf8')
  for (const point of [/pelo motivo certo/, /código mínimo/, /tabela de adequação/, /defeito/, /bug/, /nunca altere nem apague um teste/i]) {
    assert.match(text, point)
  }
  assert.doesNotMatch(text, /(npm|npx|jest|vitest|pytest|phpunit) /i)
})

const technologyStacks = {
  vitest: ['vitest'],
  'testing-library': [
    '@testing-library/dom',
    '@testing-library/react',
    '@testing-library/vue',
    '@testing-library/angular',
    '@testing-library/svelte',
    '@testing-library/preact',
    '@testing-library/react-native'
  ],
  playwright: ['@playwright/test', 'playwright'],
  'redux-toolkit': ['@reduxjs/toolkit']
}

for (const [stack, dependencies] of Object.entries(technologyStacks)) {
  test(`o catálogo registra a stack ${stack} com os pacotes de detecção`, () => {
    assert.ok(catalog.stacks[stack].description)
    assert.deepEqual(catalog.stacks[stack].detect.dependencies, dependencies)
  })
}

const testingSkill = 'unit-component-testing'

function packageJson(dependencies) {
  return { 'package.json': JSON.stringify({ devDependencies: dependencies }) }
}

test('a skill de testes é aplicada às stacks vitest e testing-library e a nenhuma outra', () => {
  assert.ok(catalog.skills[testingSkill].description)
  assert.deepEqual(catalog.skills[testingSkill].applies, ['vitest', 'testing-library'])
})

test('projeto só com Vitest recebe a stack e a skill de testes', () => {
  const target = h.makeTarget(packageJson({ vitest: '2' }))
  const output = sync(target)

  assert.match(output, /Stacks detectadas: vitest$/m)
  assert.deepEqual(rulesOf(target), [...general].sort())
  assert.deepEqual(skillsOf(target), [...generalSkills, testingSkill].sort())
})

for (const dependency of technologyStacks['testing-library']) {
  test(`projeto com ${dependency} e sem Vitest recebe a stack testing-library e a skill de testes`, () => {
    const target = h.makeTarget(packageJson({ [dependency]: '1' }))
    const output = sync(target)

    assert.match(output, /Stacks detectadas: testing-library$/m)
    assert.deepEqual(skillsOf(target), [...generalSkills, testingSkill].sort())
  })
}

for (const dependency of ['@testing-library/user-event', '@testing-library/jest-dom', '@testing-library/react-hooks']) {
  test(`projeto só com ${dependency} não recebe a skill de testes`, () => {
    const target = h.makeTarget(packageJson({ [dependency]: '1' }))
    const output = sync(target)

    assert.match(output, /Stacks detectadas: nenhuma$/m)
    assert.deepEqual(skillsOf(target), [...generalSkills].sort())
  })
}

test('projeto só com user-event e jest-dom juntos não recebe a skill de testes', () => {
  const target = h.makeTarget(packageJson({ '@testing-library/user-event': '14', '@testing-library/jest-dom': '6' }))
  const output = sync(target)

  assert.match(output, /Stacks detectadas: nenhuma$/m)
  assert.deepEqual(skillsOf(target), [...generalSkills].sort())
})

test('projeto com Vitest e Testing Library recebe as duas stacks e a skill de testes uma única vez', () => {
  const target = h.makeTarget(packageJson({ vitest: '2', '@testing-library/react': '16' }))
  const output = sync(target)

  assert.match(output, /Stacks detectadas: vitest, testing-library$/m)
  assert.deepEqual(skillsOf(target), [...generalSkills, testingSkill].sort())
})

test('projeto sem Vitest nem Testing Library não recebe a skill de testes', () => {
  const target = h.makeTarget(packageJson({ jest: '29' }))
  const output = sync(target)

  assert.doesNotMatch(output, /Stacks detectadas: .*(vitest|testing-library)/)
  assert.deepEqual(skillsOf(target), [...generalSkills].sort())
})

test('projeto React com Vitest e Testing Library recebe as skills de React e a de testes', () => {
  const target = h.makeTarget({
    'package.json': JSON.stringify({
      dependencies: { react: '18' },
      devDependencies: { vitest: '2', '@testing-library/react': '16' }
    })
  })
  sync(target)

  assert.deepEqual(skillsOf(target), [...generalSkills, ...stackSkills.react, testingSkill].sort())
})

test('skill de testes editada no projeto não é sobrescrita', () => {
  const target = h.makeTarget(packageJson({ vitest: '2' }))
  sync(target)
  const file = path.join(target, '.claude', 'skills', testingSkill, 'SKILL.md')
  const edited = `${fs.readFileSync(file, 'utf8')}\nMinha regra.\n`
  fs.writeFileSync(file, edited)
  const output = sync(target)

  assert.equal(fs.readFileSync(file, 'utf8'), edited)
  assert.match(output, new RegExp(`${testingSkill}/SKILL\\.md: você editou este arquivo`))
})
