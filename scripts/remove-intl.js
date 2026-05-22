const fs = require('fs');
const path = require('path');

const SKIP_FILES = new Set([
  'i18n.js',
  'IntlMessage/index.js',
  'LanguageProvider/index.js',
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      walk(full, files);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

function transform(content, filePath) {
  if (SKIP_FILES.has(path.basename(filePath)) || filePath.includes('LanguageProvider')) {
    return null;
  }

  if (!content.includes('react-intl') && !content.includes('formatMessage')) {
    return null;
  }

  // Skip helpers.js formatMessageTimestamp functions - handle separately
  if (filePath.endsWith('helpers.js')) {
    return null;
  }

  let result = content;
  const needsInterpolate =
    /formatMessage\s*\([^,)]+,\s*\{/.test(result) ||
    /formatMessage\s*\(\s*errors\[/.test(result) ||
    /formatMessage\s*\(\s*msg/.test(result);

  // Remove react-intl imports
  result = result.replace(
    /import\s*\{[^}]*\}\s*from\s*['"]react-intl['"];?\n?/g,
    ''
  );

  // Remove useIntl lines
  result = result.replace(
    /\s*const\s*\{\s*formatMessage[^}]*\}\s*=\s*useIntl\(\)\s*;?\n?/g,
    '\n'
  );

  // formatMessage(singleIdentifier) -> singleIdentifier (messages.foo, messages.foo.bar)
  result = result.replace(
    /formatMessage\((messages(?:\.\w+)+)\)/g,
    '$1'
  );

  // formatMessage(variable) where variable is likely auth message object - use getMessage helper pattern
  // For showMessage && message && formatMessage(message) -> showMessage && getDisplayMessage(message)
  result = result.replace(
    /formatMessage\((\w+)\)/g,
    (match, arg) => {
      if (arg.startsWith('messages')) return arg;
      // auth message or dynamic - use String() for plain strings, or .defaultMessage fallback
      return `(typeof ${arg} === 'string' ? ${arg} : ${arg}?.defaultMessage ?? ${arg})`;
    }
  );

  // formatMessage(x, { vars }) -> interpolate(x, { vars })
  result = result.replace(/formatMessage\s*\(/g, 'interpolate(');

  if (needsInterpolate && !result.includes("utils/interpolate")) {
    const firstImport = result.match(/^import .+;$/m);
    if (firstImport) {
      const pos = result.indexOf(firstImport[0]) + firstImport[0].length + 1;
      result =
        result.slice(0, pos) +
        "import { interpolate } from 'utils/interpolate';\n" +
        result.slice(pos);
    }
  }

  // Clean double interpolate on messages (interpolate(messages.x) -> messages.x if no second arg)
  result = result.replace(/interpolate\((messages(?:\.\w+)+)\)/g, '$1');

  return result === content ? null : result;
}

const srcDir = path.join(__dirname, '../src');
const files = walk(srcDir);
let changed = 0;

for (const file of files) {
  const rel = path.relative(srcDir, file);
  const content = fs.readFileSync(file, 'utf8');
  const transformed = transform(content, rel);
  if (transformed) {
    fs.writeFileSync(file, transformed);
    changed++;
    console.log('Updated:', rel);
  }
}

console.log(`\nTotal updated: ${changed}`);
