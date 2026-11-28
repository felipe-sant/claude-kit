---
name: redux-slice
description: Cria ou altera uma fatia de estado com Redux Toolkit, registrada no estado geral, com hooks tipados, seletores estreitos e teste primeiro. Use quando o usuário pedir um estado global novo ou mudar o que já existe no Redux.
---

# Fatia de estado com Redux Toolkit

Entrega: a fatia registrada no estado geral, os hooks e seletores para usá-la e o teste dela.

Se o projeto já tem uma convenção própria, ela vence esta skill.

## Passos

1. Olhe fatias já existentes e siga a estrutura de pastas, os nomes e a forma de organizar ações e seletores do projeto.
2. Defina o formato do estado, o valor inicial e as ações, com tipos. Guarde só o que precisa ser compartilhado entre telas.
3. Escreva primeiro o teste, com a store montada como na aplicação (não use dublê da store): dispare as ações e confira o estado e os seletores. Veja-o falhar.
4. Crie a fatia com `createSlice` e exporte o reducer e as ações.
5. Registre o reducer no estado geral (`configureStore` ou `combineReducers` do projeto).
6. Use os hooks tipados do projeto (`useAppSelector` e `useAppDispatch`) e crie-os se não existirem, em vez dos hooks sem tipo. Os hooks valem só em projetos com React.
7. Crie seletores estreitos, que devolvem só o pedaço de que a tela precisa, e não o estado inteiro da fatia.
8. Rode o lint, o teste e a checagem de tipos do projeto.
