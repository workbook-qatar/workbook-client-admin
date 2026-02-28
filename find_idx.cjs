const fs = require('fs');

const file = 'client/src/pages/StaffPendingInviteDetails.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const step0Idx = lines.findIndex(l => l.includes('0. BASIC INFORMATION'));
const step1Idx = lines.findIndex(l => l.includes('1. EMPLOYMENT & PROFILE'));
const step2Idx = lines.findIndex(l => l.includes('2. OPERATIONS & SKILLS'));
const step3Idx = lines.findIndex(l => l.includes('3. ACCESS & SECURITY'));
const step4Idx = lines.findIndex(l => l.includes('5. SUMMARY & ACTIVATION'));

console.log({ step0Idx, step1Idx, step2Idx, step3Idx, step4Idx });
