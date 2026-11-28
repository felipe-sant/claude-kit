---
name: playwright-e2e
description: Cria e depura testes de ponta a ponta com Playwright, com verificação automática de acessibilidade em cada tela. Use quando o usuário pedir ou precisar de um teste no navegador, ou quando um teste de ponta a ponta estiver lento ou instável.
---

# Testes de ponta a ponta com Playwright

Entrega: o teste de ponta a ponta, rápido e estável, com a verificação de acessibilidade das telas que ele visita e a lista do que ficou para conferência manual.

## Passos

1. **Escolha os fluxos que valem o custo.** Teste no navegador é lento: use só nos caminhos críticos do usuário (entrar, comprar, enviar um formulário completo). Regra de um componente ou de uma função não precisa de navegador: use teste de componente ou de unidade.
2. **Escreva o teste primeiro** e veja-o falhar pelo motivo certo. Um fluxo por teste, independente dos outros: cada teste cria os dados de que precisa e não depende de ordem nem de serviço externo de verdade (simule a rede nas fronteiras).
3. **Espere por estado, nunca por tempo fixo.** Use as esperas automáticas e as verificações que tentam de novo (`expect(...).toBeVisible()`, espera por resposta ou por mudança de endereço). Pausa com tempo fixo é a causa mais comum de teste instável.
4. **Encontre os elementos pelo que a pessoa vê**: `getByRole` com o nome, `getByLabel` e `getByText`. Use identificador de teste só quando não houver papel nem texto estável. Seletor por classe ou por posição quebra à toa.
5. **Rode a verificação de acessibilidade em cada tela visitada**, com o verificador automático do projeto (como o axe). Se o projeto não tem um, siga o roteiro de "Dependência nova" do padrão de segurança e peça a decisão antes de instalar.
6. **Teste mais de um tamanho de tela e, se existirem, mais de um tema**: celular e computador, claro e escuro. Repita só o que muda com o tamanho ou o tema, não o fluxo inteiro.

## Instabilidade

- Reproduza repetindo o teste e olhe o relatório, o vídeo e o rastro de execução da falha antes de mexer.
- Ache a causa: espera por tempo fixo, dado compartilhado entre testes, animação, resposta de rede que varia ou elemento achado cedo demais.
- Corrija a causa. Nunca esconda a falha com repetição automática nem remova o teste para ele passar.

## Fechamento

A verificação automática pega só parte dos problemas de acessibilidade. Termine com duas listas: o que foi verificado e como, e **Para conferência manual**, com leitor de tela, uso só com teclado, foco, texto alternativo útil e clareza das mensagens. Se algo não pôde ser rodado, diga.
