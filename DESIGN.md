# Дизайн-система bajikovasite

## Иконки

Две библиотеки подключены через CDN в `index.html` — использовать по ситуации:

| Библиотека | Использование | Сайт |
|------------|---------------|------|
| **Lucide** | `<i data-lucide="name"></i>` | lucide.dev/icons |
| **Boxicons** | `<i class="bx bx-name"></i>` или `<i class="bxs-name"></i>` (solid) | boxicons.com |

### Примеры Lucide
```html
<i data-lucide="mail"></i>
<i data-lucide="phone"></i>
<i data-lucide="arrow-right"></i>
```

### Примеры Boxicons
```html
<i class="bx bx-envelope"></i>       <!-- outline -->
<i class="bxs-envelope"></i>         <!-- solid -->
<i class="bx bxl-instagram"></i>     <!-- логотипы: bxl- -->
```

### Размер и цвет
```css
i {
  font-size: var(--text-xl);
  color: var(--color-text);
}
```

---

## Цвета

Все цвета — через токены из `assets/css/tokens.css`. Hex напрямую в CSS не писать.

### BLACK — основная тёмная палитра

| Токен | HEX | Описание |
|-------|-----|----------|
| `--black-100` | `#17151F` | Основной тёмный (почти чёрный с фиолетовым оттенком) |
| `--black-84` | `#3C3A65` | Тёмно-фиолетовый |
| `--black-64` | `#686970` | Средний серый |
| `--black-6` | `#F1F1F2` | Почти белый |

### WHITE — тёплая светлая палитра

| Токен | HEX | Описание |
|-------|-----|----------|
| `--white-100` | `#F9F6F1` | Тёплый белый / крем |
| `--white-84` | `#D5D2CF` | Светло-тёплый серый |
| `--white-64` | `#ABA8A5` | Средне-тёплый серый |
| `--white-6` | `#25222C` | Тёмный (для контраста) |

### COLORS — акцентная палитра

| Токен | HEX | Описание |
|-------|-----|----------|
| `--color-red` | `#551F2C` | Тёмно-красный / бордо |
| `--color-blue` | `#2A2737` | Тёмно-синий / чернильный |
| `--color-gradient` | `#551F2C → #2A2737` | Градиент Red → Blue |

Градиент в CSS:
```css
background: var(--color-gradient);
/* или вручную: */
background: linear-gradient(135deg, var(--color-red), var(--color-blue));
```

---

## Адаптивность

Сайт обязан корректно отображаться на трёх устройствах:

| Устройство | Брейкпоинт | Примечание |
|------------|-----------|------------|
| Mobile     | < 768px   | приоритет — одна колонка, крупные touch-цели |
| Tablet     | 768–1023px | промежуточная сетка |
| Desktop    | ≥ 1024px  | полный макет |

### Подход — mobile-first

Базовые стили пишутся для мобильного, расширяются вверх:

```css
.element {
  font-size: var(--mb-b1-size); /* mobile — база */
}

@media (min-width: 768px) {
  .element {
    font-size: var(--dt-b1-size); /* tablet+ */
  }
}
```

### Правила

- Все отступы, размеры шрифтов и сетки — через токены, без магических px
- Изображения: всегда `max-width: 100%`
- Touch-цели (кнопки, ссылки): минимум `44×44px` на мобильном
- Типографика переключается по брейкпоинту `768px`: desktop-токены → mobile-токены

---

## Типографика

Два шрифта, подключены через Google Fonts:
- **Geologica** — заголовки H1–H4 и b1. Веса: 400, 800
- **Roboto** — тело текста b2, b3. Веса: 400, 500

### Desktop

| Стиль | Шрифт | Размер | Вес | Line-height |
|-------|-------|--------|-----|-------------|
| H1 | Geologica | 96px | 800 | 1 |
| H2 | Geologica | 48px | 800 | 1 |
| H3 | Geologica | 48px | 400 | 1 |
| H4 | Geologica | 36px | 400 | 1 |
| b1 | Geologica | 20px | 400 | 1.5 |
| b2 | Roboto    | 20px | 400 | 1.5 |
| b3 | Roboto    | 16px | 400 | 1.5 |

### Mobile

| Стиль | Шрифт | Размер | Вес | Line-height |
|-------|-------|--------|-----|-------------|
| H1 | Geologica | ~62px | 800 | 1 |
| H2 | Geologica | 36px  | 400 | 1 |
| H3 | Geologica | 28px  | 400 | 1 |
| H4 | Geologica | 22px  | 400 | 1 |
| b1 | Geologica | 18px  | 400 | 1.5 |
| b2 | Roboto    | 16px  | 400 | 1.5 |
| b3 | Roboto    | 14px  | 400 | 1.5 |

### Использование в CSS

```css
h1 {
  font-family: var(--font-heading);
  font-size: var(--dt-h1-size);
  font-weight: var(--dt-h1-weight);
  line-height: var(--dt-h1-line);
}

@media (max-width: 768px) {
  h1 {
    font-size: var(--mb-h1-size);
  }
}
```

Letter-spacing у всех стилей: `0`.

---

## Кнопки

Четыре варианта (уточнить: primary/secondary или active/disabled):

### Текстовые кнопки с иконкой
- Тёмный вариант: фон `--black-100`, текст `--white-100`
- Светлый вариант: фон `--black-6`, текст `--black-100`
- С иконкой закрытия (X) — круглая кнопка

### Текстовые кнопки без иконки
- `СВЯЗАТЬСЯ` — pill-форма, обводка, без заливки
- `МЕНЮ` — pill-форма, тёмная заливка

> ⚠️ Уточнить: два ряда кнопок — это `primary/secondary` или `active/disabled`?
