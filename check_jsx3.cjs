const fs = require('fs');
const file = 'client/src/pages/StaffPendingInviteDetails.tsx';
let c = fs.readFileSync(file, 'utf8');
let stack = [];
let regex = /<\s*(\/?)([a-zA-Z0-9_.-]+)[^>]*?(\/?)>/g;
let match;
let output = [];
while ((match = regex.exec(c)) !== null) {
  const isClosing = match[1] === '/';
  const tag = match[2];
  // More robust self closing set
  const selfClosingTags = ['input', 'img', 'br', 'hr', 'x', 'upload', 'checkcircle', 'arrowleft', 'arrowright', 'shieldcheck', 'user', 'hash', 'briefcase', 'shield', 'check', 'mail', 'calendar', 'clock', 'map-pin', 'map', 'trash2', 'plus', 'chevronup', 'chevrondown', 'selectvalue'];
  const isSelfClosing = match[3] === '/' || selfClosingTags.includes(tag.toLowerCase());
  if (isSelfClosing) continue;

  const lineNo = c.substring(0, match.index).split(/\r\n|\n/).length;
  
  if (!isClosing) {
    stack.push({ tag, line: lineNo });
  } else {
    if (stack.length === 0) {
      output.push(`Error: Unmatched closing tag </${tag}> at line ${lineNo}`);
      break;
    }
    const last = stack.pop();
    if (last.tag !== tag) {
        output.push(`Error: Mis-matched closing tag </${tag}> at line ${lineNo}. Expected </${last.tag}> (opened at ${last.line}).`);
        break;
    }
  }
}
if (stack.length > 0) output.push(`Left over tags in stack: ${stack.slice(-5).map(s => s.tag).join(', ')}`);
fs.writeFileSync('error_log.txt', output.join('\n'));
