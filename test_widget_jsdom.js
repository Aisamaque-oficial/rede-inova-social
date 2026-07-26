const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "public/teste-widget.html"), "utf8");
const scriptCode = fs.readFileSync(path.join(__dirname, "public/widget/acessibilidade.js"), "utf8");

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

// We inject the script directly because local file loading might fail in jsdom
const scriptEl = dom.window.document.createElement("script");
scriptEl.textContent = scriptCode;
dom.window.document.head.appendChild(scriptEl);

// Add the custom element manually if the HTML didn't include it (it didn't in our teste-widget.html!)
// WAIT! Did I include `<acessibilidade></acessibilidade>` in `teste-widget.html`???
// Let me check my previous output.
const tag = dom.window.document.createElement("acessibilidade");
tag.setAttribute("cor-principal", "#FF0000");
tag.setAttribute("posicao", "direita");
dom.window.document.body.appendChild(tag);

setTimeout(() => {
  console.log("Errors:", dom.window.errors || "None");
  console.log("Body innerHTML length:", dom.window.document.body.innerHTML.length);
  console.log("Custom element HTML:", dom.window.document.querySelector("acessibilidade").innerHTML);
  process.exit(0);
}, 2000);
