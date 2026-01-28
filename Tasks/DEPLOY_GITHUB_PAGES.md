# TASK: Деплой на GitHub Pages

## Статус проекта

- Git: ✅ инициализирован
- Коммит: `ac60af2` — init
- Remote: нужно подключить

## Цель

Подключить remote репозиторий и запушить для автодеплоя на GitHub Pages.

## Шаги

### Шаг 1 — Удалить лишний файл

```bash
rm .claude/settings.local.json
```

### Шаг 2 — Подключить remote

```bash
git remote add origin https://github.com/Mdyuzhev/lab-ecosystem.git
```

Если remote уже есть:
```bash
git remote set-url origin https://github.com/Mdyuzhev/lab-ecosystem.git
```

### Шаг 3 — Пуш в GitHub

```bash
git push -u origin main
```

### Шаг 4 — Проверить GitHub Actions

После пуша автоматически запустится workflow. Проверить:
- https://github.com/Mdyuzhev/lab-ecosystem/actions

Ждать пока статус станет зелёным (✅).

### Шаг 5 — Включить GitHub Pages (если не включён)

Если сайт не появился после успешного workflow:
1. GitHub → репозиторий → Settings → Pages
2. Source: **GitHub Actions**
3. Save

## Результат

Сайт доступен: https://mdyuzhev.github.io/lab-ecosystem/

## После деплоя

Закоммитить удаление settings.local.json:
```bash
git add -A
git commit -m "chore: remove settings.local.json"
git push
```

---

*Работать автономно, не спрашивать подтверждений*
