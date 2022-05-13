const fs = require('fs');
const execSync = require('child_process').execSync;
const Mustache = require('mustache');

const htmlTemplate: string = "src/index-template.html";
const injectedDir: string = "build/injected";
const injectedTemplate: string = `${injectedDir}/index.html`;
const webDir: string = "build/web";
const buildArtifact: string = `${webDir}/index.html`;
const stylesSource: string = "src/inline.css";
const minifiedJavascript: string = "build/js/inline-min.js";
const compiledJavascript: string = "build/js/inline.js";

// Combine delimiter with html comment so template is valid html.
const customMustacheDelimiters: string[] = ['<!-- {{', '}} -->'];

try {
  run('tsc -p tsconfig.json');
  run(`terser --compress --mangle -o ${minifiedJavascript} -- ${compiledJavascript}`);
  const templateData = fs.readFileSync(htmlTemplate, {encoding: 'utf8', flag: 'r'});
  const script = fs.readFileSync(minifiedJavascript);
  const styles = fs.readFileSync(stylesSource);
  const rendered = Mustache.render(templateData, {
    script, styles
  }, {}, customMustacheDelimiters);
  mkdir(injectedDir);
  fs.writeFileSync(injectedTemplate, rendered);
  mkdir(webDir);
  run(`html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true "${injectedTemplate}" -o "${buildArtifact}"`);
} catch (err) {
  console.error("Build failed:", err);
}

function run(command: string) {
  const result = execSync(command, {stdio: 'inherit'});
  if (result == null) { return; }
  const output = execSync(command, {stdio: 'inherit'}).toString();
  if (output.trim().length > 0) {
    console.log(output);
  }
}

function mkdir(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
