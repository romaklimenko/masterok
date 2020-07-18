# masterok

Google Cloud Function. Читает RSS и публикует посты на d3.ru.

Переменные окружения:

- `MONGO` - строка подключения к MongoDB
- `D3_SID` - id сессии пользователя на d3.ru
- `D3_UID` - id пользователя на d3.ru
- `D3_CSRF` - CSRF-токен пользователя на d3.ru
- `DOMAIN` - домен сообщества на d3.ru
- `RSS` - RSS-feed URL