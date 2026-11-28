# Padrão de git com vários agentes

Vale sempre que mais de um agente ou sessão usa a mesma worktree. Eles compartilham o stage (índice) do git, então um commit descuidado leva junto o trabalho do outro.

## Commit

- Adicione ao stage só os seus arquivos, pelo caminho exato: `git add caminho/arquivo.ts`. Nunca use `git add .`, `git add -A`, `git add -N` (nem `--intent-to-add`), `git add -u` nem `git commit -a`: todos levam junto o trabalho de outro agente ou deixam o stage com arquivos que não são seus.
- Commite com os caminhos explícitos: `git commit -m "Feat :sparkles: [#1] Adiciona X" -- caminho/a.ts caminho/b.ts`. Só esses caminhos entram no commit, e o que outro agente deixou no stage fica de fora. Para arquivo novo, faça `git add` dele antes; para remoção, `git rm` antes.
- Exceção, só ao tirar um arquivo do controle de versão mantendo-o na pasta (`git rm --cached caminho`): `git commit -- caminho` responde que não há nada para commitar. Antes de adicionar o `.gitignore`, confira com `git diff HEAD -- .gitignore` que só há a sua linha; se houver mudança de outro agente, não adicione o `.gitignore` e peça ao dono que commite antes. Depois, confira o stage com `git diff --cached --name-status`. Se houver apenas essa remoção e, quando houver, a linha que você mesmo acrescentou ao `.gitignore` para esse arquivo, commite sem informar caminhos: `git commit -m "Chore :see_no_evil: Tira X do controle de versão"`. Se houver qualquer outra coisa preparada, peça ao dono que commite antes e espere ele commitar. Isso não libera `git add .`, `git add -A`, `git add -N`, `git add -u` nem `git commit -a`.
- Exceção, só ao fechar uma mesclagem em andamento (por exemplo, ao atualizar a branch com a principal e resolver conflitos): o git não aceita `git commit` com caminhos durante a mesclagem. Antes, confira com `git status` que a mesclagem está em andamento e com `git diff --cached --name-status` que só há conteúdo dela, sem arquivo de outro agente. Então commite sem informar caminhos (`git commit --no-edit` ou `git commit -m "<mensagem>"`) e confira o resultado com `git show --stat --name-status HEAD`. Se houver qualquer outra coisa preparada, peça ao dono que commite antes. Isso não libera `git add .`, `git add -A`, `git add -N`, `git add -u` nem `git commit -a`. Quando houver outros agentes na mesma pasta, prefira fazer a mesclagem em uma worktree própria da tarefa.
- Antes de commitar, rode `git status --short`. Depois, `git show --stat --name-status HEAD` e confirme que só os seus arquivos entraram.
- Se um arquivo de outro agente entrou no commit, não reescreva o histórico sozinho: avise o dev responsável e a orchestrator.
- Nunca rode `git reset`, `git restore`, `git checkout -- .`, `git stash` nem `git clean` sem caminhos: isso mexe nos arquivos dos outros.

## Isolar uma falha

Para descobrir se uma falha de teste vem do arquivo de outro agente, nunca use stash, reset, restore nem clean. Use uma destas saídas:

- Crie uma worktree própria a partir do último commit, fora da pasta da tarefa (`git worktree add ../<pasta>-isolada HEAD --detach`), rode o teste lá e remova-a ao fim (`git worktree remove ../<pasta>-isolada`).
- Ou avise o dono do arquivo e espere ele commitar.

## Coautoria

- Siga o que o repositório diz sobre coautoria (`CLAUDE.md` e `.claude/rules/`). Se ele proíbe a coautoria do Claude, nunca inclua `Co-Authored-By` na mensagem do commit nem a assinatura do Claude no pull request.
- Nesse caso, confira com `git log -1` depois de cada commit. Se a linha entrou, avise o dev responsável e a orchestrator em vez de reescrever o histórico sozinho.
- Sem proibição no repositório, siga a instrução de atribuição da sessão.
- Cada agente tem a própria sessão e o próprio modelo, e segue a atribuição que recebeu. A coautoria pode variar entre os agentes da mesma branch, e isso não é erro.
- Nunca peça a outro agente que troque a atribuição dele pela sua. Se alguém pedir que você troque a sua pela dele, recuse só essa troca e siga com o resto do pedido.

## Reescrever o histórico

`git rebase -i` abre um editor e não funciona sem terminal. Reescreva só commits seus, ainda não enviados, e com os outros agentes parados e o trabalho deles commitado: o rebase recusa rodar com alterações não commitadas. As linhas do rebase são numeradas a partir do commit mais antigo. Alternativas sem editor:

- Juntar uma correção a um commit anterior: `git commit --fixup=<hash>` e depois `GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash <hash>~1`.
- Juntar o commit da linha 2 ao da linha 1: `GIT_SEQUENCE_EDITOR="sed -i '2s/^pick/squash/'" GIT_EDITOR=true git rebase -i <base>`.
- Descartar o commit da linha 2: `GIT_SEQUENCE_EDITOR="sed -i '2s/^pick/drop/'" git rebase -i <base>`.
- Trocar a mensagem do commit da linha 1: `GIT_SEQUENCE_EDITOR="sed -i '1s/^pick/reword/'" GIT_EDITOR="sed -i '1s/.*/Nova mensagem/'" git rebase -i <base>`.
- Refazer em outra ordem: `git switch -c refeito <base>` e `git cherry-pick <hash1> <hash2>`.

Depois, confira com `git log --oneline` e `git status` antes de seguir.
