# Git e GitHub

Git registra versões do projeto. GitHub guarda o repositório e permite pedir uma revisão antes de integrar alterações. A branch `main` deve conter a versão aprovada pelos professores.

## Organização simples

```text
main
studio-01
studio-02
studio-03
studio-04
studio-05
```

Cada estúdio compartilha uma branch. Combinem quem vai editar cada arquivo antes de começar, façam commits pequenos e atualizem a branch antes de trabalhar. Evitem editar o mesmo arquivo ao mesmo tempo.

O Estúdio lógico 3 só modifica `js/studios/maismais-03/` e `assets/studios/estudio-03/`. Para os demais grupos, consulte o [mapa de pastas autorizadas](01-COMO-O-PROJETO-FUNCIONA.md). As branches seguem o número lógico e não o sufixo da pasta JavaScript: `pentaverso-05` trabalha na `studio-01`, e `estudio01-01` na `studio-05`.

## Preparação do professor

O professor cria o repositório, publica a estrutura na `main` e cria as cinco branches. Para criar a do Estúdio 1:

```powershell
git switch main
git switch -c studio-01
git push -u origin studio-01
```

Repita a criação para os demais números, partindo da `main`. Se a branch já existe, use `git switch studio-01`, sem `-c`.

## Primeiro acesso do aluno

Substitua `URL_DO_REPOSITORIO` pela URL que o professor entregar e `PASTA_DO_PROJETO` pela pasta criada pelo clone:

```powershell
git clone URL_DO_REPOSITORIO
cd PASTA_DO_PROJETO
git fetch origin
git switch --track origin/studio-01
```

O exemplo usa o Estúdio 1. Troque para seu número. Se a branch local já foi criada, basta `git switch studio-01`.

## Antes de começar uma tarefa

```powershell
git status
git switch studio-01
git pull --no-rebase origin studio-01
```

Faça o `switch` e o `pull` com os arquivos locais já salvos em commit ou sem alterações pendentes. Se o Git avisar que uma mudança local seria perdida, interrompa e peça ajuda. Não apague código de um colega para fazer o comando funcionar.

## Salvar e enviar sua alteração

Teste primeiro. Depois, confira e adicione apenas suas pastas:

```powershell
git status
git diff
git add js/studios/pentaverso-05 assets/studios/estudio-01
git commit -m "Adiciona pista e enigma ao nível 1"
git pull --no-rebase origin studio-01
git push origin studio-01
```

O exemplo é do Estúdio lógico 1: sua pasta JavaScript é `pentaverso-05`, seus assets ficam em `estudio-01` e a branch é `studio-01`. Use as pastas e a branch da sua linha no mapa.

Se o `pull` apresentar um conflito, resolva com o colega e o professor antes de fazer o `push`. Nunca use `push --force` na branch compartilhada para descartar alterações.

## Receber atualizações da main

Não é preciso atualizar a main antes de fazer commit. Primeiro salve o trabalho na branch do grupo, mesmo que seja um ponto de segurança ainda em desenvolvimento. Confira a branch com `git branch --show-current` e confira os arquivos com `git status`.

Exemplo do Estúdio lógico 01 (Pentaverso), estando na branch studio-01:

```powershell
git add js/studios/pentaverso-05 assets/studios/estudio-01
git commit -m "Salva trabalho antes de atualizar a estrutura"
git fetch origin
git merge origin/studio-01
git push origin studio-01
git branch backup/studio-01-antes-atualizacao
git merge origin/main
```

Se não há alterações pendentes, pule add e commit. Use um nome novo para a branch de backup a cada atualização. Se ainda usam as pastas antigas, adicione os caminhos reais que aparecem no git status antes de fazer commit.

Execute por etapas: se houver conflito, pare e resolva com o professor antes de seguir. O merge combina os históricos; os commits anteriores continuam disponíveis. Não aceite todos os arquivos de um lado indiscriminadamente. Para desistir de um merge ainda em andamento, iniciado com a árvore limpa, use `git merge --abort`.

As pastas foram renomeadas na main. Git pode reconhecer renomeações e combinar edições, mas arquivos novos nas pastas antigas ou conflitos de renomeação precisam de conferência. Compare com o backup e confirme que os três níveis e suas mecânicas estão nas pastas atuais, mantendo seus IDs.

Após resolver conflitos, adicione os arquivos resolvidos e finalize com git commit se solicitado. Execute npm run validar e npm test, teste nível individual, sequência e reinício em dev.html e só então envie com `git push origin studio-01`.

Não é necessário trocar para a main local: git merge origin/main recebe suas novidades diretamente na branch do grupo. Evite reset --hard, descarte de alterações e push --force para resolver dificuldades. Salvar commits e enviá-los antes do merge mantém uma cópia recuperável da produção.

## Pedir a integração

No GitHub, abra um Pull Request com **base: main** e **compare: studio-01**. Escreva o que mudou, como foi testado e se algo precisa de ajuda. O modelo do repositório aparece automaticamente.

O professor revisa o código, os arquivos alterados e os testes. Somente depois da aprovação as mudanças entram na `main`. Os alunos não alteram `registry.js`: o professor marca os níveis revisados como prontos.

Quando a estrutura da `main` mudar, o professor orienta a atualização das branches dos estúdios. Não copiem os arquivos de outro grupo manualmente para tentar atualizar o motor.

## Branch opcional por tarefa

Quando o grupo estiver confortável com o fluxo, o professor pode orientar branches como:

```text
tarefa/estudio-01/enigma-relogio
```

Não use `studio-01/enigma-relogio` enquanto `studio-01` existir. Git não permite ter uma branch que seja ao mesmo tempo o nome de outra branch e o prefixo de seu caminho. O prefixo `tarefa/` evita essa colisão.

No começo, a branch compartilhada é suficiente. Combine com o professor se o Pull Request da tarefa será integrado primeiro à branch do estúdio ou diretamente à `main`.

## Regras e verificações do GitHub

O workflow `.github/workflows/validar.yml` executa a validação dos níveis, os testes do motor e, nos Pull Requests para `main`, uma verificação de pastas. O script reconhece `studio-01` a `studio-05` e `tarefa/estudio-01/nome`, com números equivalentes. Renomear um arquivo de uma pasta proibida também é identificado, pois o caminho removido e o adicionado são verificados.

Branches de manutenção do professor usam `professor/nome-da-tarefa`. Elas podem alterar a estrutura compartilhada e ainda passam pelos testes e revisão. Nomes fora desses padrões geram um aviso de erro no check.

O professor precisa configurar no GitHub, de acordo com os recursos disponíveis no repositório:

1. Proteção ou ruleset da `main`, exigindo Pull Request e aprovação.
2. Check **Níveis, motor e pastas autorizadas** como obrigatório.
3. Bloqueio de force push e exclusão da `main`.
4. Um usuário ou equipe real em `.github/CODEOWNERS`, por exemplo uma linha `* @usuario-real`.
5. Exigência de revisão dos Code Owners, quando disponível.

`CODEOWNERS` foi entregue como modelo comentado. Ele não solicita revisão automaticamente até receber um responsável real.

A validação de pastas é uma ajuda à revisão, não uma permissão de acesso por usuário. O nome da branch não prova quem é o professor. Os scripts e workflows também são arquivos revisáveis do projeto. Os professores devem conferir os diffs e configurar os responsáveis e a proteção da `main`.

O workflow usa `pull_request` com permissões de leitura e não recebe segredos de deploy. Não troque para `pull_request_target` para executar o JavaScript submetido por alunos.
