# TASK: Развернуть проект на GitHub Pages

## Цель

Инициализировать git-репозиторий, связать с GitHub и задеплоить сайт на GitHub Pages.

## Репозиторий

**URL:** https://github.com/Mdyuzhev/lab-ecosystem

## Шаги

### Шаг 1 — Инициализация git

```bash
cd /e/Politech/lab-ecosystem
git init
```

### Шаг 2 — Создать .gitignore

Создать файл `.gitignore` с содержимым:

```
node_modules/
dist/
.DS_Store
*.log
.env
.env.local
```

### Шаг 3 — Первый коммит

```bash
git add -A
git commit -m "feat: initial commit - lab ecosystem site"
```

### Шаг 4 — Связать с GitHub

```bash
git branch -M main
git remote add origin https://github.com/Mdyuzhev/lab-ecosystem.git
```

### Шаг 5 — Пуш

```bash
git push -u origin main
```

### Шаг 6 — Проверить деплой

После пуша GitHub Actions автоматически запустится (файл `.github/workflows/deploy.yml` уже есть).

Проверить статус:
- https://github.com/Mdyuzhev/lab-ecosystem/actions

После успешного деплоя сайт будет доступен:
- https://mdyuzhev.github.io/lab-ecosystem/

## Если нужна авторизация GitHub

При пуше может запросить логин/пароль. Варианты:

1. **GitHub CLI** (рекомендуется):
   ```bash
   gh auth login
   ```

2. **Personal Access Token:**
   - GitHub → Settings → Developer settings → Personal access tokens
   - Создать токен с правами `repo`
   - Использовать токен вместо пароля

3. **SSH ключ:**
   ```bash
   git remote set-url origin git@github.com:Mdyuzhev/lab-ecosystem.git
   ```

## Результат

После выполнения:
- Код в репозитории: https://github.com/Mdyuzhev/lab-ecosystem
- Сайт онлайн: https://mdyuzhev.github.io/lab-ecosystem/

## Следующие шаги

После успешного деплоя:
1. Проверить что сайт открывается
2. Проверить интерактивность (клики на карточки)
3. Если есть проблемы — смотреть консоль браузера (F12)

---

*Задача создана: Январь 2025*
