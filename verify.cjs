const fs = require('fs');
let content = fs.readFileSync('client/src/pages/StaffPendingInviteDetails.tsx', 'utf-8');

const matches = content.match(/className=\{STYLES\.sectionDesc\}/g);
console.log(`Matched sectionDesc ${matches ? matches.length : 0} times.`);

// Check for `<p>` tags
const ptags = content.match(/<p[\s\S]*?<\/p>/g);
console.log(`Found ${ptags ? ptags.length : 0} p tags.`);
