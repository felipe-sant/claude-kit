---
name: tdd
description: Ensina o ciclo de TDD, a tabela de adequação dos testes à especificação e a prova de que os testes falham quando o comportamento quebra. Use quando for implementar lógica ou comportamento, corrigir um bug ou julgar se os testes de uma entrega bastam.
---

# TDD

Entrega: código de lógica e comportamento escrito com teste primeiro, a evidência do vermelho de cada teste, a tabela de adequação preenchida e a prova de que os testes pegam defeitos.

## O que entra em TDD

- Entra: lógica e comportamento, como regras, validações, cálculos, fluxos e respostas de API.
- Não entra: aparência, texto e estilo sem efeito no comportamento.

## O ciclo

Repita para um comportamento por vez:

1. Escreva um teste só, para um comportamento só, com nome que diz o que acontece e em que situação.
2. Rode e veja o teste falhar pelo motivo certo: ele falha porque o comportamento não existe, não por erro de digitação, de configuração ou de dado faltando. Guarde a evidência: o nome do teste e a mensagem da falha.
3. Escreva o código mínimo para passar. Nada além do que o teste pede.
4. Rode e confira que passou, junto com os testes que já existiam.
5. Melhore o código (nomes, duplicação, estrutura) só com todos os testes passando, rodando-os a cada passo.

Não escreva código de produção antes de ter visto o teste falhar. Teste que passa de primeira não prova nada: descubra por quê antes de seguir.

## Bug

A correção começa por um teste que reproduz o bug e falha pelo motivo do bug. Só depois corrija, com o mínimo, e confira que esse teste passa e os demais continuam passando. O teste fica como proteção contra o bug voltar.

## Tabela de adequação

Ao fim da tarefa, ligue cada critério da especificação a um teste, com a evidência:

| Critério | Teste que cobre | Evidência |
| --- | --- | --- |
| CA-01 | nome do teste | falhou antes com a mensagem X e passou depois |

- Critério sem teste é lacuna: escreva o teste ou diga por que o critério não é testável e quem confirma.
- Teste sem critério é sinal de escopo extra: confira se ele é necessário.
- Confira também os limites (vazio, zero, máximo) e os erros que o usuário pode causar.

## Prova de que o teste falha

Para saber se os testes pegam defeitos de verdade, depois de tudo passando:

1. Escolha um comportamento coberto e coloque de propósito um defeito pequeno no código: inverta uma condição, troque um limite, remova uma validação ou devolva um valor fixo.
2. Rode os testes e confira que algum falha.
3. Desfaça o defeito, só o que você colocou, e confira que os testes voltam a passar.
4. Se nenhum teste falhou, o comportamento está sem proteção: escreva o teste que falta, veja-o falhar com o defeito, desfaça o defeito e confira que passa.

Faça isso nos comportamentos principais, um defeito por vez, e registre o resultado junto da tabela de adequação.

## Limites

- Nunca altere nem apague um teste só para ele passar, e nunca pule um teste. Se o teste está errado, diga por quê e confirme a regra antes de mudá-lo.
- Teste o que entra e o que sai, não os detalhes internos.
- Dublês só nas fronteiras, como serviços externos, relógio e envio de e-mail.
- Rode a suíte inteira antes de cada commit e não commite com teste quebrado.
