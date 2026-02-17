import "./styles.css";
import { testData, testOutputDate } from "./testDates";
import { dayParser } from "./day";
import { chronoParser } from "./chrono";
import { anyDateParser } from "./anyDate";
import { dateFnsParser } from "./date-fns";
import { fechaParser } from "./fecha";
import { luxonParser } from "./luxon";

const parserDictionary = {
  DayJS: dayParser,
  ChronoJS: chronoParser,
  "Any-Date": anyDateParser,
  "Date-fns": dateFnsParser,
  Fecha: fechaParser,
  Luxon: luxonParser,
};

const testParser = (formatter, datesArray, expectedDate = testOutputDate) => {
  const output = [];

  datesArray.forEach((dateStr) => {
    try {
      const dateObj = formatter(dateStr);

      if (!dateObj) {
        output.push(`❌ "${dateStr}" → null`);
        return;
      }

      // Validar que sea un Date válido
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        output.push(`❌ "${dateStr}" → Invalid Date`);
        return;
      }

      const parsedDate = dateObj.toISOString().split("T")[0];

      if (parsedDate === expectedDate) {
        output.push(`✅ "${dateStr}" → ${parsedDate}`);
      } else {
        output.push(`❌ "${dateStr}" → ${parsedDate} ≠ ${expectedDate}`);
      }
    } catch (e) {
      output.push(`❌ "${dateStr}" → Error: ${e.message}`);
    }
  });

  return output;
};

const renderResults = (arr) => {
  const outputElm = document.getElementById("output");
  outputElm.textContent = arr.join("\n");
};

// init
const init = () => {
  const buttonsContainer = document.getElementById("buttonsContainer");

  // Crear botones automáticamente
  Object.entries(parserDictionary).forEach(([name, parserFn]) => {
    const button = document.createElement("button");
    button.textContent = name;
    button.className = "parser-button";

    button.addEventListener("click", () => {
      console.log(`Testing ${name}`);
      const results = testParser(parserFn, testData);
      renderResults(results);
    });

    buttonsContainer.appendChild(button);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  // DOM ya está listo, ejecutar inmediatamente
  init();
}
