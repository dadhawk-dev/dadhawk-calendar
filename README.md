# Custom Calendar Web Component

**Version:** 1.0.0  
**License:** Apache License 2.0

`<custom-calendar>` is a **vanilla JavaScript Web Component** that provides a fully interactive calendar with optional time selection, multiple themes, and full keyboard & mouse support.

---

## ✨ Features

- 📅 Select a date from a calendar grid
- ⏰ Optional hour and minute selection
- 🎨 Four themes: `light`, `dark`, `modern`, `retro`
- 🔄 Navigate months and years easily
- 🖱️ Mouse and keyboard interaction (Enter to confirm, Escape to cancel)
- 📌 Today button to jump to current date/time
- ♻️ Supports programmatic updates and event dispatching

---

## 🚀 Installation

Include the component in your HTML project:

```html
<script src="custom-calendar.js"></script>
```

Or import as a module:

```javascript
import './custom-calendar.js';
```

---

## 🖥️ Usage

### Basic HTML

```html
<custom-calendar></custom-calendar>
```

### With dark theme and no time selection

```html
<custom-calendar theme="dark" no-time></custom-calendar>
```

### With initial selected date

```html
<custom-calendar selected-date="2025-09-22"></custom-calendar>
```

---

## 🔧 Attributes

| Attribute       | Type    | Default | Description |
|-----------------|--------|---------|-------------|
| `theme`         | string | light   | Sets visual theme: `light`, `dark`, `modern`, `retro` |
| `no-time`       | boolean| false   | Hides hour and minute selection when present |
| `selected-date` | string | null    | Pre-select a date. Format: `YYYY-MM-DD` or valid Date string |

---

## 📜 Events

### `date-selected`
Fired when a date (and optionally time) is selected.

**Detail:**
- `date`: Date object of the selected date
- `formatted`: Human-readable date string
- `hour`: Hour (if time enabled)
- `minute`: Minute (if time enabled)
- `timeFormatted`: Formatted time string (if time enabled)

### `date-cancel`
Fired when the user cancels date input (e.g., presses Escape).

**Detail:** None

---

## 📜 Methods

### Instance Methods

- `focusOnInput()` → Focuses and selects the date input field
- `applyTheme(theme)` → Applies the given theme (`light`, `dark`, `modern`, `retro`)
- `changeMonth(direction)` → Move calendar month (1 = next, -1 = previous)

---

## 📦 Notes

- Keyboard: Enter confirms, Escape cancels selection
- Today button sets current date/time
- Month and year dropdowns automatically populate +/-10 years from current year
- Days of the week start from Sunday
- Works with both default and custom themes

---

## 📜 License

Licensed under the **Apache License 2.0**. See the [LICENSE](./LICENSE) file for details.
