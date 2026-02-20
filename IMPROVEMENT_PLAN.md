# Plan de mejora: 15/15 tests con mínimo bundle size

## Diagnóstico

### Versiones puras (solo API nativa + loop de formatos)

| Librería | Tests | Bundle (chunk) | Problema |
|----------|:-----:|:--------------:|----------|
| DayJS | 15/15 | 11.3 KB | Ninguno |
| Date-fns | 14/15 | 45.0 KB | No soporta formato japonés |
| Luxon | 14/15 | 82.5 KB | No soporta formato japonés |
| Fecha | 14/15 | 4.3 KB | No soporta formato japonés |
| ChronoJS | 13/15 | 53.5 KB | No soporta japonés ni compacto |
| Any-Date | 12/15 | 18.2 KB | Confunde DD/MM con MM/DD |

### Versiones custom (ya implementadas, todas 15/15)

| Librería | Código custom necesario |
|----------|-------------------------|
| ChronoJS* | Regex pre-proceso para japonés (`YYYY年M月D日`) y compacto (`YYYYMMDD`) |
| Any-Date* | Detección de `DD/MM` vs `MM/DD`: si primer número > 12, swap antes de parsear |
| Date-fns* | Regex fallback para formato japonés |
| Fecha* | Regex fallback para formato japonés |
| Luxon* | Regex fallback para formato japonés con `DateTime.fromObject()` |

---

## Cambios ya realizados

### Separación puro vs custom
- Archivos `*.js` contienen solo API nativa de la librería (sin regex, sin lógica de swap)
- Archivos `*_custom.js` agregan el código mínimo necesario para cubrir formatos faltantes
- DayJS no necesita versión custom (15/15 con solo formatos)

### Optimización de bundle
- [x] Eliminado `parcel-bundler` (Parcel v1 legacy) de las dependencias
- [x] Actualizado `parcel` a `^2.16.4`
- [x] Agregado `"type": "module"` al `package.json`
- [x] Eliminado import explícito de `enUS` locale en `date-fns.js` (v4 lo usa por defecto)
- [x] Code-splitting: cada parser se carga via `import()` dinámico (bundle principal: ~3.2 KB)

---

## Mejoras pendientes

### 1. Reducir bundle de librerías pesadas

**Luxon (82.5 KB)** — El más pesado. No soporta tree-shaking efectivo porque `DateTime` es una clase monolítica. Opciones:
- Aceptar el costo si se necesita su API rica (zonas horarias, i18n, etc.)
- Considerar que DayJS logra 15/15 con solo 11.3 KB si el caso de uso no requiere las features avanzadas de Luxon

**Chrono-node (53.5 KB)** — Motor NLP completo. Es pesado pero justificado si se necesita parsing de lenguaje natural ("next friday", "in 2 weeks"). Para formatos estructurados, otras librerías son más eficientes.

**date-fns (45.0 KB)** — El chunk incluye `parseISO` + `parse` + el sistema de formatos. El tree-shaking ya está funcionando (el paquete completo son 38 MB en disco vs 45 KB en bundle).

### 2. Formato japonés como estándar compartido

4 de 6 librerías fallan en el formato japonés (`2024年3月15日`). El código custom para manejarlo es siempre el mismo regex:

```javascript
const japaneseMatch = dateString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
```

Podría extraerse a un helper compartido en `testDates.js` o un `helpers.js` para evitar duplicación en los archivos `_custom.js`.

### 3. Análisis de rendimiento (runtime)

El benchmark actual mide solo compatibilidad de formatos y tamaño de bundle. Podría agregarse:
- Tiempo de ejecución por parser (usando `performance.now()`)
- Iteraciones por segundo con un dataset grande
- Comparación de latencia de primer uso (cold start) vs uso repetido

### 4. Más formatos de prueba

Formatos candidatos para agregar a `testDates.js`:
- RFC 2822: `Fri, 15 Mar 2024 00:00:00 +0000`
- ISO con hora: `2024-03-15T10:30:00Z`
- Unix timestamp: `1710460800`
- Relativo (solo para chrono): `March 15th, 2024`
- Con zona horaria: `2024-03-15 PST`

---

## Recomendación por caso de uso

| Escenario | Librería | Bundle | Tests puro |
|-----------|----------|:------:|:----------:|
| Mínimo tamaño, formatos conocidos | **DayJS** | 11.3 KB | 15/15 |
| Micro-librería, pocos formatos | **Fecha** | 4.3 KB | 14/15 |
| Ecosistema funcional rico | **date-fns** | 45.0 KB | 14/15 |
| Auto-detección de formatos | **Any-Date** | 18.2 KB | 12/15 |
| API completa (zonas, i18n, etc.) | **Luxon** | 82.5 KB | 14/15 |
| Input de usuario / lenguaje natural | **Chrono-node** | 53.5 KB | 13/15 |

**Ganador general**: DayJS — 15/15 sin código custom, 11.3 KB de bundle, API intuitiva.
