# /start — Инициализация сессии

Проверяет состояние проекта и готовность к работе.

```bash
# Git
git branch --show-current
git status --short
git log --oneline -3

# Node
node --version
npm --version

# Проект
cat package.json | grep -E '"name"|"version"'
ls -la src/components/*.jsx 2>/dev/null | wc -l
```

## Вывод

```markdown
## ✅ Lab Ecosystem Ready

**Branch:** main
**Version:** 0.1.0

### Статус
- Components: X files
- Build: ✅ ready

### Команды
- `/dev` — Запустить dev-сервер
- `/build` — Собрать для production
- `/deploy` — Деплой на GitHub Pages
- `/commit` — Закоммитить изменения
```
