const fs = require('fs');

const file = 'client/src/pages/StaffPendingInviteDetails.tsx';
let c = fs.readFileSync(file, 'utf8');

let stack = [];
let regex = /<\s*(\/?)([a-zA-Z0-9_.-]+)[^>]*?(\/?)>/g;
let match;
while ((match = regex.exec(c)) !== null) {
  const isClosing = match[1] === '/';
  const tag = match[2];
  const isSelfClosing = match[3] === '/' || ['input', 'img', 'br', 'hr'].includes(tag.toLowerCase());
  
  if (isSelfClosing) continue;
  
  const lineNo = c.substring(0, match.index).split(/\r\n|\n/).length;
  
  if (!isClosing) {
    stack.push({ tag, line: lineNo });
  } else {
    if (stack.length === 0) {
      console.error(`Error: Unmatched closing tag </${tag}> at line ${lineNo}`);
      break;
    }
    const last = stack.pop();
    if (last.tag !== tag) {
        console.error(`Error: Mis-matched closing tag </${tag}> at line ${lineNo}. Expected </${last.tag}> (opened at ${last.line}).`);
        break;
    }
  }
}

if (stack.length > 0) {
    console.error(`Left over tags in stack: ${stack.slice(-5).map(s => s.tag).join(', ')}`);
} else {
    console.log("Tags perfectly balanced.");
}
