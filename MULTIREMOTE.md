# Rappel multi-remote

## Ajouter le remote du prof sur un alias correction:

```shell
git remote add correction git@github.com:O-clock-Maya/oKanban-front-nicolassallerin.git
```

## Mettre à jour la branche master (ou main) à partir du dépot correction

```shell
git checkout master

git pull --no-edit --allow-unrelated-histories -X theirs correction master
```
