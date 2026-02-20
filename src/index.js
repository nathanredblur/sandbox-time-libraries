import "./styles.css";
import { testData, testOutputDate } from "./testDates";

const parserMeta = {
  DayJS: {
    load: () => import("./day").then((m) => m.dayParser),
    url: "https://day.js.org/",
    version: "1.11.19",
    desc: "Ligera (~7 KB core), usa plugin customParseFormat con loop de formatos explícitos.",
    chunk: "11.3 KB",
  },
  ChronoJS: {
    load: () => import("./chrono").then((m) => m.chronoParser),
    url: "https://github.com/wanasit/chrono",
    version: "2.9.0",
    desc: "Parser de lenguaje natural (NLP). Una sola llamada a chrono.parseDate().",
    chunk: "53.5 KB",
  },
  "ChronoJS*": {
    load: () => import("./chrono_custom").then((m) => m.chronoCustomParser),
    url: "https://github.com/wanasit/chrono",
    version: "2.9.0",
    desc: "Chrono + regex pre-proceso para formato japonés y compacto (YYYYMMDD).",
    chunk: "53.5 KB",
    custom: true,
  },
  "Any-Date": {
    load: () => import("./anyDate").then((m) => m.anyDateParser),
    url: "https://github.com/kensnyder/any-date-parser",
    version: "2.2.3",
    desc: "Detección automática de formatos con parser.attempt().",
    chunk: "18.2 KB",
  },
  "Any-Date*": {
    load: () => import("./anyDate_custom").then((m) => m.anyDateCustomParser),
    url: "https://github.com/kensnyder/any-date-parser",
    version: "2.2.3",
    desc: "Any-Date + detección y swap de DD/MM cuando el primer número > 12.",
    chunk: "18.2 KB",
    custom: true,
  },
  "Date-fns": {
    load: () => import("./date-fns").then((m) => m.dateFnsParser),
    url: "https://date-fns.org/",
    version: "4.1.0",
    desc: "Funciones modulares: parseISO + parse() con loop de 18 formatos.",
    chunk: "45.0 KB",
  },
  "Date-fns*": {
    load: () => import("./date-fns_custom").then((m) => m.dateFnsCustomParser),
    url: "https://date-fns.org/",
    version: "4.1.0",
    desc: "date-fns + regex fallback para formato japonés.",
    chunk: "45.0 KB",
    custom: true,
  },
  Fecha: {
    load: () => import("./fecha").then((m) => m.fechaParser),
    url: "https://github.com/taylorhakes/fecha",
    version: "4.2.3",
    desc: "Micro-librería (~4 KB). Parse con loop de 14 formatos.",
    chunk: "4.3 KB",
  },
  "Fecha*": {
    load: () => import("./fecha_custom").then((m) => m.fechaCustomParser),
    url: "https://github.com/taylorhakes/fecha",
    version: "4.2.3",
    desc: "Fecha + regex fallback para formato japonés.",
    chunk: "4.3 KB",
    custom: true,
  },
  Luxon: {
    load: () => import("./luxon").then((m) => m.luxonParser),
    url: "https://moment.github.io/luxon/",
    version: "3.7.2",
    desc: "Sucesor de Moment.js. Usa fromISO, fromRFC2822, fromSQL + loop de formatos.",
    chunk: "82.5 KB",
  },
  "Luxon*": {
    load: () => import("./luxon_custom").then((m) => m.luxonCustomParser),
    url: "https://moment.github.io/luxon/",
    version: "3.7.2",
    desc: "Luxon + regex fallback para formato japonés con DateTime.fromObject().",
    chunk: "82.5 KB",
    custom: true,
  },
};

const testParser = (formatter, datesArray, expectedDate = testOutputDate) => {
  const results = [];

  datesArray.forEach((dateStr) => {
    try {
      const dateObj = formatter(dateStr);

      if (!dateObj) {
        results.push({ pass: false, input: dateStr, output: "null" });
        return;
      }

      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        results.push({ pass: false, input: dateStr, output: "Invalid Date" });
        return;
      }

      const parsedDate = dateObj.toISOString().split("T")[0];
      results.push({
        pass: parsedDate === expectedDate,
        input: dateStr,
        output: parsedDate,
        expected: parsedDate !== expectedDate ? expectedDate : null,
      });
    } catch (e) {
      results.push({ pass: false, input: dateStr, output: `Error: ${e.message}` });
    }
  });

  return results;
};

const renderResults = (name, meta, results) => {
  const section = document.getElementById("resultsSection");
  const header = document.getElementById("activeParser");
  const score = document.getElementById("scoreTag");
  const info = document.getElementById("parserInfo");
  const output = document.getElementById("output");

  section.classList.remove("hidden");

  header.textContent = name;

  if (results === null) {
    score.textContent = "";
    info.innerHTML = "";
    output.innerHTML = '<div class="loading">Loading...</div>';
    return;
  }

  const passed = results.filter((r) => r.pass).length;
  const total = results.length;

  score.textContent = `${passed}/${total}`;
  score.className = passed === total ? "score perfect" : "score partial";

  info.innerHTML = [
    `<a href="${meta.url}" target="_blank">${meta.url}</a>`,
    `v${meta.version}`,
    `chunk: ${meta.chunk}`,
    meta.custom ? "(custom)" : "(pura)",
  ].join(" &middot; ");

  const desc = document.createElement("div");
  desc.style.marginTop = "0.25rem";
  desc.textContent = meta.desc;
  info.appendChild(desc);

  output.innerHTML = results
    .map((r) => {
      const cls = r.pass ? "pass" : "fail";
      const icon = r.pass ? "✅" : "❌";
      const expected = r.expected ? ` <span style="color:#999">≠ ${r.expected}</span>` : "";
      return `<div class="result-line ${cls}">
        <span class="result-icon">${icon}</span>
        <span class="result-input">${r.input}</span>
        <span class="result-arrow">→</span>
        <span class="result-value">${r.output}${expected}</span>
      </div>`;
    })
    .join("");
};

const init = () => {
  const container = document.getElementById("buttonsContainer");
  let activeButton = null;

  Object.entries(parserMeta).forEach(([name, meta]) => {
    const button = document.createElement("button");
    button.textContent = name;
    button.className = meta.custom
      ? "parser-button custom"
      : "parser-button";

    button.addEventListener("click", async () => {
      if (activeButton) activeButton.classList.remove("active");
      button.classList.add("active");
      activeButton = button;

      renderResults(name, meta, null);
      const parserFn = await meta.load();
      const results = testParser(parserFn, testData);
      renderResults(name, meta, results);
    });

    container.appendChild(button);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
