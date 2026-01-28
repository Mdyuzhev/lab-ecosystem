# /commit — Умный коммит

## Использование

```
/commit [message]
```

## Шаги

```bash
git status --short
git diff --stat HEAD

# Определить тип из изменённых файлов
CHANGED=$(git diff --name-only HEAD)
if echo "$CHANGED" | grep -q "src/components/"; then TYPE="feat"; SCOPE="ui"
elif echo "$CHANGED" | grep -q "src/data/"; then TYPE="data"; SCOPE="content"
elif echo "$CHANGED" | grep -q ".claude/"; then TYPE="chore"; SCOPE="config"
else TYPE="chore"; SCOPE=""; fi

git add -A
git commit -m "$TYPE($SCOPE): $MESSAGE"
```

## Формат коммитов

```
feat(ui): add new lab card component
fix(ui): responsive layout on mobile
data(content): update economics section
chore(config): update vite config
docs: update readme
```
