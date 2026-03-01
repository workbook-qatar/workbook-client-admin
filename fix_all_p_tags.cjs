const fs = require('fs');

let content = fs.readFileSync('client/src/pages/StaffPendingInviteDetails.tsx', 'utf-8');

// The new requirement is absolutely NO paragraph. Info icon only for complex fields.
// And no leftover p tags!
content = content.replace(/<p([^>]*)>([\s\S]*?)<\/p>/g, function(match, attributes, innerText) {
  // Convert any remaining text-xs to text-[11px] or text-[11.5px] if needed
  let newAttrs = attributes.replace('text-xs', 'text-[11.5px]').replace('text-sm', 'text-[12px]');
  // Ensure it's treated as a block or inline-block so it breaks cleanly
  if (!newAttrs.includes('block')) {
      newAttrs = newAttrs.replace(/className="/, 'className="block ');
  }
  return `<span${newAttrs}>${innerText}</span>`;
});

fs.writeFileSync('client/src/pages/StaffPendingInviteDetails.tsx', content);

console.log("No paragraphs rule fully applied.");
