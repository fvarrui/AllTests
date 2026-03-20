# AllTests

Entrenador de tests para oposiciones del **Servicio Canario de la Salud (SCS)**, publicado como página estática en **GitHub Pages**. Sin servidor, sin base de datos, sin dependencias externas más allá de una hoja de estilos y una fuente tipográfica.

## Tests disponibles

| Test | Convocatoria | URL |
|------|-------------|-----|
| Logopeda | SCS 2022 – Proceso selectivo extraordinario | `/quizzes/Logopeda/` |
| Auxiliar de Enfermería | SCS 2022 – Proceso selectivo extraordinario | `/quizzes/AuxEnfermeria/` |

## Estructura del repositorio

```
AllTests/
├── css/
│   └── quiz.css              # Estilos compartidos por todos los tests
├── lib/
│   └── quiz.js               # Motor del test (lógica + componentes HTML)
├── themes/
│   ├── default/              # Tema azul/violeta
│   │   ├── dark.css
│   │   └── light.css
│   └── ocean/                # Tema verde-agua/teal
│       ├── dark.css
│       └── light.css
└── quizzes/
    ├── Logopeda/
    │   ├── index.html        # Punto de entrada (igual para todos los tests)
    │   ├── config.js         # Metadatos y configuración del test
    │   └── questions.js      # Banco de preguntas
    └── AuxEnfermeria/
        ├── index.html
        ├── config.js
        └── questions.js
```

## Cómo crear un nuevo test

### 1. Crea la carpeta del test

```
quizzes/MiTest/
```

### 2. Copia el `index.html` de cualquier test existente

El fichero es idéntico para todos los tests, no necesitas modificar nada:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test</title>
  <link id="appTheme" rel="stylesheet">
  <script src="config.js"></script>
  <link rel="stylesheet" href="../../css/quiz.css">
</head>
<body>
  <script src="questions.js"></script>
  <script src="../../lib/quiz.js"></script>
</body>
</html>
```

### 3. Crea `config.js`

```js
const CONFIG = {

  // ── METADATOS ──────────────────────────────────────────────────────────────
  title:       "Test Mi Especialidad — SCS 2026",
  badge:       "Servicio Canario de la Salud · 2026",
  appName:     "Mi Especialidad",
  appSubtitle: "Descripción opcional en HTML",
  processType: "Proceso selectivo",
  docLink:     "https://enlace-al-pdf-oficial.pdf",  // opcional

  // ── TEMA VISUAL ────────────────────────────────────────────────────────────
  theme: 'default',   // nombre de carpeta en themes/ (default, ocean, ...)

  // ── CONFIGURACIÓN DEL TEST ─────────────────────────────────────────────────
  defaults: {
    numQuestions: 30,        // preguntas al arrancar
    rangeFrom:    1,         // inicio del rango por defecto
    rangeTo:      100,       // fin del rango por defecto
    sliderMin:    5,         // mínimo del slider
    sliderStep:   5,         // incremento del slider
    presets:      [10, 25, 50, 100],  // botones de acceso rápido
  },

};

(function () {
  const saved = localStorage.getItem('quizTheme');
  if (saved) document.getElementById('appTheme').href = saved;
})();
```

> `docLink` es opcional. Si se define, aparece un icono 📄 junto al número de preguntas que enlaza al PDF oficial del proceso.

### 4. Crea `questions.js`

```js
const ALL_QUESTIONS = [
  {
    id: 1,
    question: "Texto de la pregunta",
    options: {
      A: "Primera opción",
      B: "Segunda opción",
      C: "Tercera opción",
      D: "Cuarta opción"
    },
    correct: "A"
  },
  // ...más preguntas
];
```

Cada pregunta requiere: `id` (número único), `question` (texto), `options` (objeto con claves A–D) y `correct` (letra de la respuesta correcta).

## Temas visuales

Cada test elige su tema mediante la propiedad `theme` en `config.js`. Para crear un tema nuevo:

1. Crea una carpeta en `themes/` con el nombre del tema.
2. Añade `dark.css` y `light.css` definiendo las variables CSS:

```css
:root {
  --bg, --surface, --surface2, --border,
  --accent, --accent2,
  --green, --red, --yellow,
  --text, --muted,
  --radius,
  --h1-from,
  --bg-glow-1, --bg-glow-2,
  --btn-hover, --btn-selected,
  --correct-bg, --wrong-bg
}
```

3. Referencia el tema en `config.js`: `theme: 'mi-tema'`.

## Publicación en GitHub Pages

El repositorio se sirve directamente desde la raíz (`/`). En los ajustes del repositorio:

**Settings → Pages → Source → Deploy from a branch → `main` / `/ (root)`**

Cada test estará disponible en:
```
https://<usuario>.github.io/<repo>/quizzes/<NombreTest>/
```

## Funcionalidades del test

- **Modalidad inmediata**: corrección tras cada respuesta con feedback visual.
- **Modalidad final**: corrección al terminar, con posibilidad de cambiar respuestas.
- **Selección por cantidad**: slider + botones preset para elegir cuántas preguntas.
- **Selección por rango**: filtra preguntas por su número de id.
- **Orden aleatorio o secuencial**.
- **Informe de resultados**: puntuación, anillo visual, detalle de falladas y sin contestar.
- **Tema claro/oscuro**: persistido en `localStorage` por separado de los datos del test.
