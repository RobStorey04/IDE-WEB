const editor = document.getElementById("editor");
const lineNumbers = document.getElementById("lineNumbers");
const resultado = document.getElementById("resultado");
const checkboxTema = document.getElementById("checkboxTema");

function updateLineNumbers() {
  const lines = editor.innerText.split('\n');
  lineNumbers.innerHTML = '';
  lines.forEach((_, i) => {
    const div = document.createElement('div');
    div.textContent = i + 1;
    lineNumbers.appendChild(div);
  });
}

function ajustarAlturaEditor() {
  editor.style.height = 'auto';
  editor.style.height = editor.scrollHeight + 'px';
}

function handleEditorInput() {
  updateLineNumbers();
  ajustarAlturaEditor();
}

function getCode() {
  return editor.innerText;
}

function resetWarnings() {
  Array.from(lineNumbers.children).forEach(div => div.classList.remove("line-warning"));
  const lines = editor.innerText.split('\n');
  editor.innerHTML = lines.map(line => {
    const safeLine = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div>${safeLine}</div>`;
  }).join('');
  ajustarAlturaEditor();
}

function marcarErrores(errores) {
  const lines = editor.innerText.split('\n');

  editor.innerHTML = lines.map((line, idx) => {
    const safeLine = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const error = errores.find(e => e.linea === idx + 1);
    if (error) {
      if (error.fin_codigo !== undefined) {
        const parteCodigo = safeLine.substring(0, error.fin_codigo);
        const parteComentario = safeLine.substring(error.fin_codigo);
        return `<div><span class="subrayado-error" data-error="${error.mensaje}">${parteCodigo}</span>${parteComentario}</div>`;
      }
      return `<div><span class="subrayado-error" data-error="${error.mensaje}">${safeLine}</span></div>`;
    }
    return `<div>${safeLine}</div>`;
  }).join('');

  errores.forEach(error => {
    const div = lineNumbers.children[error.linea - 1];
    if (div) div.classList.add("line-warning");
  });

  ajustarAlturaEditor();
}

function analizarLexico() {
  const code = getCode();
  resultado.innerText = "Salida:\n🔍 Resultado del análisis ...";
  fetch("/analizar-lexico", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
  .then(res => res.json())
  .then(data => {
    resultado.innerText = "Salida:\n🔍 Resultado del análisis lexico:\n" + data.resultado;
  });
}

function analizarSintactico() {
  const code = getCode();
  resultado.innerText = "Salida:\n🔍 Resultado del análisis ...";
  fetch("/analizar-sintactico", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
  .then(res => res.json())
  .then(data => {
    resultado.innerText = "Salida:\n🧠 Resultado del análisis sintáctico:\n" + (data.resultado || "No hay resultado");
    resetWarnings();
    if (data.errores && data.errores.length > 0) {
      marcarErrores(data.errores);  // espera [{ linea: 3, mensaje: "error" }]
    }
  });
}

function ejecutarTuring() {
  const code = getCode();
  resultado.innerText = "Salida:\n🔍 Resultado del análisis ...";
  fetch("/turing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
  .then(res => res.json())
  .then(data => {
    resultado.innerText = "Salida:\n⚙️ Resultado de la Máquina de Turing:\n" + data.resultado;
  });
}

function limpiarEditor() {
  editor.innerText = "";
  updateLineNumbers();
  resultado.innerText = "Salida:\n💬 Editor limpio.";
}

function toggleTema() {
  const body = document.body;
  const actual = body.getAttribute("data-theme");
  const nuevo = actual === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", nuevo);
  checkboxTema.checked = nuevo === "dark" ? false : true;
}

(function initTema() {
  const actual = document.body.getAttribute("data-theme");
  checkboxTema.checked = actual === "light";
})();

editor.addEventListener("input", handleEditorInput);
updateLineNumbers();
ajustarAlturaEditor();