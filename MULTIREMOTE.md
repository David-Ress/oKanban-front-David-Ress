# Rappel multi-remote

## Ajouter le remote du prof sur un alias correction:

```shell
git remote add correction <adresse_ssh_du_remote_de_correction>
```

## Mettre à jour la branche master (ou main) à partir du dépot correction

```shell
git checkout master

git pull --no-edit --allow-unrelated-histories -X theirs correction master
```
