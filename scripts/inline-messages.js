const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '../src');

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== 'node_modules') walk(p, files);
    else if (e.name.endsWith('.js')) files.push(p);
  }
  return files;
}

function parseMessagesFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const obj = {};
  const re = /(\w+):\s*"((?:\\"|[^"])*)"|(\w+):\s*'((?:\\'|[^'])*)'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const key = m[1] || m[3];
    const val = (m[2] || m[4] || '').replace(/\\"/g, '"').replace(/\\'/g, "'");
    obj[key] = val;
  }
  return obj;
}

function escapeForJs(str) {
  return JSON.stringify(str);
}

function resolveImportPath(importerPath, importPath) {
  let resolved = importPath;
  if (importPath.startsWith('.')) {
    resolved = path.normalize(path.join(path.dirname(importerPath), importPath));
  } else {
    resolved = path.join(SRC, importPath);
  }
  if (!resolved.endsWith('.js')) {
    if (fs.existsSync(resolved + '.js')) resolved += '.js';
    else if (fs.existsSync(path.join(resolved, 'messages.js')))
      resolved = path.join(resolved, 'messages.js');
    else resolved += '.js';
  }
  return resolved;
}

const messagesFiles = walk(SRC).filter((f) => path.basename(f) === 'messages.js');
const messagesMap = new Map(); // absolute path -> { key: value }

for (const mf of messagesFiles) {
  messagesMap.set(mf, parseMessagesFile(mf));
}

const importRe =
  /import\s+(\w+)\s+from\s+['"]([^'"]*messages[^'"]*)['"];?\n?/g;

const allJs = walk(SRC).filter((f) => !f.endsWith('messages.js'));

let totalFiles = 0;

for (const file of allJs) {
  let content = fs.readFileSync(file, 'utf8');
  const imports = [];
  let m;
  const importReLocal = new RegExp(importRe.source, 'g');
  while ((m = importReLocal.exec(content)) !== null) {
    imports.push({ alias: m[1], importPath: m[2] });
  }
  if (!imports.length) continue;

  let changed = false;

  for (const { alias, importPath } of imports) {
    const resolved = resolveImportPath(file, importPath);
    const msgs = messagesMap.get(resolved);
    if (!msgs) {
      console.warn('No messages for', file, '->', importPath, resolved);
      continue;
    }

    const keys = Object.keys(msgs).sort((a, b) => b.length - a.length);

    for (const key of keys) {
      const literal = escapeForJs(msgs[key]);
      const dotted = `${alias}.${key}`;

      // interpolate(alias.key, { ... }) -> interpolate("...", { ... })
      content = content.replace(
        new RegExp(
          `interpolate\\(\\s*${alias}\\.${key}\\s*,`,
          'g'
        ),
        `interpolate(${literal},`
      );

      // plain alias.key
      content = content.replace(
        new RegExp(`\\b${alias}\\.${key}\\b`, 'g'),
        literal
      );
    }

    // Remove import
    content = content.replace(
      new RegExp(
        `import\\s+${alias}\\s+from\\s+['"][^'"]*['"];?\\n?`,
        'g'
      ),
      ''
    );
    changed = true;
  }

  if (changed) {
    // Remove interpolate import if no longer used
    if (!content.includes('interpolate(')) {
      content = content.replace(
        /import\s*\{\s*interpolate\s*\}\s*from\s*['"]utils\/interpolate['"];?\n?/g,
        ''
      );
    }
    fs.writeFileSync(file, content);
    totalFiles++;
    console.log('Inlined:', path.relative(SRC, file));
  }
}

// Inline utils/messages into yupValidations directly
const utilsMsgs = messagesMap.get(path.join(SRC, 'utils/messages.js'));
if (utilsMsgs) {
  let yup = fs.readFileSync(path.join(SRC, 'utils/yupValidations.js'), 'utf8');
  yup = yup.replace(/import messages from '\.\/messages';\n\n/, '');
  for (const [key, val] of Object.entries(utilsMsgs)) {
    yup = yup.replace(new RegExp(`messages\\.${key}`, 'g'), escapeForJs(val));
  }
  fs.writeFileSync(path.join(SRC, 'utils/yupValidations.js'), yup);
  console.log('Inlined: utils/yupValidations.js');
}

// Delete all messages.js
for (const mf of messagesFiles) {
  fs.unlinkSync(mf);
  console.log('Deleted:', path.relative(SRC, mf));
}

console.log(`\nDone. Updated ${totalFiles} consumer files, deleted ${messagesFiles.length} messages.js files.`);
