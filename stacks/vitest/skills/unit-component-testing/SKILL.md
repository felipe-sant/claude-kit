---
name: unit-component-testing
description: Escreve, roda e depura testes de unidade, de hook e de componente com Vitest e Testing Library, consultando a tela como a pessoa a vê. Use quando for criar, corrigir ou diagnosticar um teste desse tipo, ou quando um teste estiver instável.
---

# Testes de unidade, de hook e de componente

Entrega: os testes escritos ou corrigidos, rodando e passando, e, se o pedido for diagnóstico, a causa do teste instável com a correção. Complementa o `testing-standard`: teste primeiro, um comportamento por teste e independência entre testes continuam valendo. Se o projeto já tem convenção própria (organização, nomes, utilitários de teste), siga a do projeto.

## 1. Escolha a camada

1. **Unidade**: lógica pura (função, regra, cálculo). Entra um valor, sai outro. Não precisa de tela nem de ambiente de navegador.
2. **Hook**: comportamento que só existe dentro do ciclo de vida do componente. Teste-o por um componente mínimo que o usa ou pela ferramenta de teste de hooks da biblioteca, e afirme o que o hook devolve e como ele reage às ações.
3. **Componente**: o que a pessoa vê e faz. Renderize como o uso real, com os mesmos dados e provedores que a tela recebe.
4. Teste cada regra na camada mais baixa em que ela aparece. Regra de cálculo não precisa de componente; mensagem de erro de formulário precisa.

## 2. Consulte a tela como a pessoa a vê

1. Prefira, nesta ordem: papel com nome acessível, rótulo do campo, texto visível, texto de apoio e, só por último, o identificador de teste.
2. Um elemento que não se acha pelo papel ou pelo rótulo costuma ser um problema de acessibilidade na tela: corrija a tela antes de contornar no teste.
3. Use a consulta que falha quando o elemento não existe para afirmar que ele está lá, e a consulta que devolve vazio para afirmar que ele não está.
4. Afirme o texto que a pessoa lê, nunca a chave de tradução, a classe de estilo ou a estrutura interna.
5. Não leia o estado interno do componente nem chame o que é interno dele: se a pessoa não vê, o teste não afirma.

## 3. Simule o uso real

1. Use a biblioteca de interação do usuário em vez de disparar eventos soltos: ela digita, clica, tabula e seleciona na ordem em que o navegador faz.
2. Crie a sessão de interação no começo de cada teste e espere cada ação com `await`.
3. Faça o que a pessoa faz, na ordem em que faz: preencher, enviar, ver o resultado. Teste também o uso só com teclado nos pontos de foco e de atalho.
4. Afirme o resultado visível da ação (mensagem, item na lista, botão desabilitado), não que uma função interna foi chamada.

## 4. Trate o assíncrono sem tempo fixo

1. Nunca espere por tempo fixo. Espere pelo estado: use a consulta que aguarda o elemento aparecer ou o utilitário de espera da biblioteca, que tenta de novo até o limite.
2. Para sumir da tela, espere o elemento desaparecer; não afirme a ausência logo após a ação.
3. Uma espera por vez e com uma afirmação dentro dela. Várias afirmações dentro da mesma espera escondem qual falhou.
4. Quando o código depende do relógio (atraso, repetição, expiração), controle o relógio do teste em vez de esperar de verdade, e restaure o relógio real no fim.
5. Se o teste só passa com uma espera longa, o problema costuma ser uma resposta que não foi simulada ou uma ação sem `await`.

## 5. Isole só as fronteiras

1. Substitua apenas o que cruza a fronteira do sistema: rede, relógio, armazenamento do navegador, serviços externos, envio de e-mail e geração de valores aleatórios.
2. Não substitua o que você está testando, os componentes filhos nem as funções internas do próprio projeto. Se for difícil testar sem isso, o desenho está acoplado demais.
3. Prefira simular a resposta da rede a simular a função que chama a rede: o teste continua valendo se a forma de chamar mudar.
4. Cada teste configura suas próprias respostas simuladas e quem substitui um recurso global restaura o original no fim, para um teste não vazar para o outro.
5. Cubra a resposta de erro e a resposta lenta, não só a de sucesso.

## 6. Organize os dados de teste

1. Crie os dados por funções de fábrica com valores padrão válidos, e passe só o que importa para o caso: o leitor vê de relance o que o teste varia.
2. Deixe o dado relevante visível dentro do teste. Evite arquivos compartilhados e enormes de dados que ninguém sabe o que cada campo faz.
3. Nada de dado real de pessoa, documento, e-mail ou segredo. Use valores claramente inventados.
4. Não dependa de dado que outro teste criou nem de ordem de execução. Renderizar e preparar o que for preciso é parte de cada teste.
5. Se vários testes repetem a mesma preparação, extraia uma função com nome que diz o cenário.

## 7. Diagnostique teste instável

1. Reproduza antes de mexer: rode o teste isolado e depois em repetição, e depois a suíte inteira. Se só falha na suíte, há dependência entre testes.
2. Procure as causas mais comuns, nesta ordem:
   - espera por tempo fixo ou ação sem `await`;
   - estado que vaza entre testes (recurso global, simulação não restaurada, relógio falso, armazenamento do navegador);
   - dado que muda a cada execução (data atual, valor aleatório, ordem de lista sem garantia);
   - consulta que acha mais de um elemento ou o elemento errado;
   - resposta simulada compartilhada entre testes.
3. Corrija a causa, não o sintoma: aumentar o tempo de espera ou repetir o teste automaticamente não é correção.
4. Depois de corrigir, rode o teste várias vezes seguidas e a suíte inteira para confirmar que ficou estável.
5. Nunca apague nem enfraqueça uma afirmação para o teste passar. Se o teste está errado, diga por quê.

## Fechamento

Antes de entregar, rode a suíte inteira e confirme que cada teste novo falhou antes pelo motivo certo. Diga o que foi coberto e o que ficou sem teste, com o motivo.
