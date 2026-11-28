---
name: rtk-query-endpoint
description: Cria ou altera endpoints de API com RTK Query, injetados por assunto, com etiquetas de cache, hooks gerados e teste primeiro com a requisição simulada. Use quando o usuário pedir uma chamada nova à API ou mudar uma existente em um projeto com Redux Toolkit.
---

# Endpoint de API com RTK Query

Entrega: os endpoints injetados, as etiquetas de cache, o uso dos hooks gerados e o teste.

Se o projeto já tem uma convenção própria, ela vence esta skill.

## Passos

1. Ache a API base do projeto e os arquivos de endpoints por assunto, e siga a estrutura e os nomes deles.
2. Defina o contrato: rotas, entradas, saídas e erros, com a regra de negócio confirmada.
3. Escreva primeiro o teste com a requisição simulada, usando a ferramenta de simulação que o projeto já tem. Se não houver nenhuma, sugira o MSW sem instalar nada e siga o roteiro de "Dependência nova" do `security-standard`. Veja o teste falhar.
4. Crie os endpoints em um arquivo do assunto com `injectEndpoints`, sem crescer o arquivo da API base.
5. Declare as etiquetas de cache: `providesTags` nas consultas e `invalidatesTags` nas alterações, para recarregar só o que mudou.
6. Use nas telas os hooks gerados pela biblioteca, sem chamada manual de requisição. Os hooks valem só em projetos com React.
7. Rode o lint, o teste e a checagem de tipos do projeto.
