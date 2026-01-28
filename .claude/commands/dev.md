# /dev — Запуск dev-сервера

Запускает локальный сервер разработки.

```bash
npm run dev
```

## Ожидаемый результат

- Сервер на http://localhost:3000
- Hot-reload при изменениях
- Откроется браузер автоматически

## Troubleshooting

Если порт занят:
```bash
npx kill-port 3000
npm run dev
```
