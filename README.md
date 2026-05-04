# bajikovasite

Сайт-визитка. Чистый HTML/CSS/JS, без фреймворков.

## Структура

```
bajikovasite/
├── index.html              # Главная страница
├── assets/
│   ├── css/
│   │   ├── tokens.css      # Дизайн-токены (цвета, шрифты, отступы)
│   │   └── style.css       # Стили (импортирует tokens.css)
│   ├── js/main.js          # Скрипты
│   └── img/                # Изображения
├── nginx.dev.conf          # Nginx для локальной разработки (порт 8080)
├── nginx.prod.conf         # Nginx для продакшена
└── README.md
```

## Локальная разработка

Nginx уже настроен и запущен. Сайт доступен по адресу:

```
http://localhost:8080
```

Если nginx не запущен:

```bash
# Подключить конфиг (один раз)
ln -sf /root/bajikovasite/nginx.dev.conf /etc/nginx/conf.d/bajikovasite.conf

# Запустить / перезагрузить
nginx -s reload
```

## Деплой на хостинг

1. Скопировать папку на сервер:

```bash
scp -r /root/bajikovasite/ user@server:/var/www/bajikovasite
```

2. Подключить nginx-конфиг на сервере:

```bash
# Отредактировать домен и путь
nano /var/www/bajikovasite/nginx.prod.conf

# Подключить
ln -s /var/www/bajikovasite/nginx.prod.conf /etc/nginx/sites-available/bajikovasite
ln -s /etc/nginx/sites-available/bajikovasite /etc/nginx/sites-enabled/bajikovasite

nginx -t && nginx -s reload
```

3. Для HTTPS — Let's Encrypt:

```bash
certbot --nginx -d example.com -d www.example.com
```

## Добавление страниц

Каждая новая страница — отдельный HTML-файл в корне:

```
about.html   → http://example.com/about
portfolio.html → http://example.com/portfolio
```

## Иконки — Lucide

Подключены через CDN. Список всех иконок: https://lucide.dev/icons

### Использование в HTML

```html
<i data-lucide="mail"></i>
<i data-lucide="phone"></i>
<i data-lucide="instagram"></i>
```

Иконки рендерятся в SVG автоматически при загрузке страницы через `lucide.createIcons()` в `main.js`.

### Размер и цвет через CSS

```css
i[data-lucide] {
  width: 24px;       /* или var(--space-6) */
  height: 24px;
  color: var(--color-accent);
  stroke-width: 1.5;
}
```

---

## Дизайн-система

Все стили строятся через токены из `assets/css/tokens.css`. Никаких магических чисел и hex-кодов прямо в компонентах.

### Правило

```css
/* Правильно */
color: var(--color-text-muted);
margin-top: var(--space-4);

/* Неправильно */
color: #666;
margin-top: 16px;
```

### Токены

| Группа | Примеры | Назначение |
|--------|---------|------------|
| `--color-*` | `--color-bg`, `--color-accent`, `--color-text-muted` | Цвета фона, текста, акцентов, рамок |
| `--font-*` | `--font-sans`, `--font-serif` | Семейства шрифтов |
| `--text-*` | `--text-sm` … `--text-5xl` | Размеры текста (rem) |
| `--font-*` | `--font-normal`, `--font-bold` | Насыщенность шрифта |
| `--leading-*` | `--leading-tight`, `--leading-normal` | Межстрочный интервал |
| `--space-*` | `--space-4` … `--space-24` | Отступы (padding, margin, gap) |
| `--radius-*` | `--radius-sm` … `--radius-full` | Скругления |
| `--shadow-*` | `--shadow-sm`, `--shadow-md` | Тени |
| `--ease-*` | `--ease-default`, `--ease-slow` | Transition-timing |
| `--container-*` | `--container-lg`, `--container-xl` | Ширины контейнеров |

### Смена темы / фирменного стиля

Достаточно изменить значения в `tokens.css` — всё остальное подхватится автоматически. Для тёмной темы:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:   #0f0f0f;
    --color-text: #f0f0f0;
    /* ... */
  }
}
```

## Требования к хостингу

- Nginx (любая версия ≥ 1.18) или Apache
- Никаких зависимостей, баз данных, серверного языка — только статика
