# /deploy — Деплой на GitHub Pages

Собирает проект и пушит в GitHub. GitHub Actions автоматически задеплоит.

## Шаги

```bash
# 1. Проверить ветку
git branch --show-current

# 2. Собрать
npm run build

# 3. Закоммитить если есть изменения
git add -A
git status --short
git commit -m "chore: build for deploy" || echo "Nothing to commit"

# 4. Запушить
git push origin main
```

## Результат

После пуша:
1. GitHub Actions запустит workflow `.github/workflows/deploy.yml`
2. Соберёт проект
3. Задеплоит на GitHub Pages

**URL:** https://[username].github.io/lab-ecosystem/

## Проверка статуса

- GitHub → репозиторий → Actions — смотреть статус workflow
- GitHub → Settings → Pages — URL сайта
