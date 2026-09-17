import { execFileSync, spawn } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const selected = process.argv[2];
if (selected && !['pt', 'en', 'es'].includes(selected)) throw new Error('Use pt, en ou es, ou omita para gerar todos.');
const chrome = process.env.CHROME_BIN || (process.platform === 'darwin'
  ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : 'google-chrome');
const output = resolve(root, 'public/resume');
mkdirSync(output, { recursive: true });
for (const lang of selected ? [selected] : ['pt', 'en', 'es']) {
  const work = mkdtempSync(join(tmpdir(), 'portal-resume-'));
  try {
    // Trabalhar em uma cópia preserva os fontes e PDFs históricos de resume/.
    cpSync(resolve(root, 'resume'), work, { recursive: true });
    const source = lang === 'en' ? 'Guionardo_Furlan_Resume.adoc' : `Guionardo_Furlan_Resume.${lang}.adoc`;
    const html = join(work, 'resume.html');
    const pdf = join(work, 'resume.pdf');
    execFileSync('asciidoctor', ['--failure-level', 'WARN', '-a', 'nofooter', '-o', html, join(work, source)], { stdio: 'inherit' });
    const browser = spawn(chrome, ['--headless', '--disable-gpu', '--no-pdf-header-footer',
      '--no-first-run', '--timeout=15000', '--allow-file-access-from-files',
      '--virtual-time-budget=5000', `--user-data-dir=${join(work, 'chrome-profile')}`,
      `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { stdio: 'ignore' });
    let launchError;
    browser.on('error', error => { launchError = error; });
    try {
      let lastSize = 0;
      let stable = 0;
      const deadline = Date.now() + 90000;
      while (true) {
        if (launchError) throw launchError;
        let bytes;
        try { bytes = readFileSync(pdf); } catch { /* Await output. */ }
        if (bytes?.subarray(0, 5).equals(Buffer.from('%PDF-')) && bytes.subarray(-1024).includes(Buffer.from('%%EOF'))) {
          stable = bytes.length === lastSize ? stable + 1 : 0;
          lastSize = bytes.length;
          if (stable >= 3 || browser.exitCode === 0) break;
        }
        if (browser.exitCode !== null || browser.signalCode !== null) {
          throw new Error(`Chrome terminou antes de concluir o PDF ${lang}`);
        }
        if (Date.now() > deadline) throw new Error(`Tempo excedido ao gerar PDF ${lang}`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } finally {
      if (browser.exitCode === null && browser.signalCode === null) {
        browser.kill('SIGTERM');
        await Promise.race([
          new Promise(resolve => browser.once('exit', resolve)),
          new Promise(resolve => setTimeout(resolve, 3000)),
        ]);
        if (browser.exitCode === null && browser.signalCode === null) browser.kill('SIGKILL');
      }
    }
    if (!readFileSync(pdf).subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error(`PDF inválido: ${lang}`);
    const destination = join(output, `Guionardo_Furlan_Resume.${lang}.pdf`);
    copyFileSync(pdf, destination);
    console.log(`Currículo ${lang}: ${destination}`);
  } finally {
    rmSync(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}
