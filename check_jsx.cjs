const fs = require('fs');

const file = 'client/src/pages/StaffPendingInviteDetails.tsx';
let c = fs.readFileSync(file, 'utf8');

// A very naive JSX bracket balancer
let stack = [];
let regex = /<\s*(\/?)([a-zA-Z0-9_.-]+)[^>]*?(\/?)>/g;
let match;
while ((match = regex.exec(c)) !== null) {
  const isClosing = match[1] === '/';
  const tag = match[2];
  const isSelfClosing = match[3] === '/' || ['input', 'img', 'br', 'hr'].includes(tag.toLowerCase());
  
  // ignore CheckCircle etc if they are self closed. But our regex matches <CheckCircle className="ml-2 w-5 h-5" /> completely as self closing.
  
  if (isSelfClosing) continue;
  
  if (!isClosing) {
    stack.push({ tag, line: c.substring(0, match.index).split(/\r\n|\n/).length, pos: match.index });
  } else {
    // pop
    if (stack.length === 0) {
      console.error(`Error: Unmatched closing tag </${tag}> at line ${c.substring(0, match.index).split(/\r\n|\n/).length}`);
      break;
    }
    const last = stack.pop();
    if (last.tag !== tag) {
        // Find if this tag matches something earlier in stack
        console.error(`Error: Mis-matched closing tag </${tag}> at line ${c.substring(0, match.index).split(/\r\n|\n/).length}. Expected </${last.tag}> (from line ${last.line}).`);
        break;
    }
  }
}

if (stack.length > 0) {
    console.error(`Left over tags in stack: ${stack.slice(-5).map(s => s.tag).join(', ')}`);
} else {
    console.log("Tags perfectly balanced.");
}
