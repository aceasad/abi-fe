const fs = require('fs');

const files = [
  'src/utils/messages.js',
  'src/containers/Forms/LoginForm/messages.js',
  'src/containers/Forms/ClinicForm/messages.js',
  'src/containers/Forms/ResetPasswordForm/messages.js',
  'src/containers/Forms/CreatePasswordForm.js/messages.js',
  'src/containers/Forms/ForgotPasswordForm/messages.js',
  'src/views/app-views/OverviewPage/messages.js',
  'src/views/app-views/KpisPage/messages.js',
  'src/views/app-views/AppointmentsPage/messages.js',
  'src/views/auth-views/LoginPage/messages.js',
  'src/views/app-views/SettingsPage/messages.js',
  'src/views/app-views/StaffPage/messages.js',
  'src/views/app-views/UserSettings/messages.js',
  'src/views/app-views/ChatPage/messages.js',
  'src/views/app-views/IndustryAveragePage/messages.js',
  'src/views/auth-views/CreatePasswordPage/messages.js',
  'src/views/auth-views/ForgotPasswordPage/messages.js',
  'src/views/app-views/CalendarPage/messages.js',
  'src/components/custom-components/Tooltips/messages.js',
  'src/views/auth-views/ResetPasswordPage/messages.js',
  'src/views/app-views/PatientsPage/messages.js',
  'src/views/app-views/ClinicPage/messages.js',
];

function extractDefaultMessages(content) {
  const entries = [];
  const keyRe = /(\w+):\s*\{/g;
  let keyMatch;
  const blocks = [];

  while ((keyMatch = keyRe.exec(content)) !== null) {
    const key = keyMatch[1];
    const start = keyMatch.index;
    const braceStart = content.indexOf('{', start + key.length);
    let depth = 0;
    let i = braceStart;
    for (; i < content.length; i++) {
      if (content[i] === '{') depth++;
      if (content[i] === '}') {
        depth--;
        if (depth === 0) break;
      }
    }
    const block = content.slice(braceStart, i + 1);
    const dmMatch = block.match(/defaultMessage:\s*'((?:\\'|[^'])*)'/s)
      || block.match(/defaultMessage:\s*"((?:\\"|[^"])*)"/s)
      || block.match(/defaultMessage:\s*`([^`]*)`/s);
    if (dmMatch) {
      let msg = dmMatch[1];
      if (dmMatch[0].startsWith("defaultMessage: '")) {
        msg = msg.replace(/\\'/g, "'");
      } else if (dmMatch[0].startsWith('defaultMessage: "')) {
        msg = msg.replace(/\\"/g, '"');
      }
      entries.push({ key, msg });
    }
  }
  return entries;
}

function convert(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('defineMessages')) {
    console.log('SKIP (already converted):', filePath);
    return;
  }

  const header = [];
  for (const line of content.split('\n')) {
    if (line.startsWith('export const scope') ||
        line.startsWith('export const globalScope') ||
        line.startsWith('export const staffScope')) {
      header.push(line);
    }
    if (line.includes('defineMessages')) break;
  }

  const entries = extractDefaultMessages(content);
  const body = entries
    .map(({ key, msg }) => `  ${key}: ${JSON.stringify(msg)},`)
    .join('\n');

  const out = [...header, '', 'export default {', body, '};', ''].join('\n');
  fs.writeFileSync(filePath, out);
  console.log('Converted', filePath, `(${entries.length} keys)`);
}

files.forEach(convert);
