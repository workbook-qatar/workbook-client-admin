const fs = require('fs');
const file = 'client/src/pages/StaffPendingInviteDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure STYLES object exists
if (!content.includes('const STYLES = {')) {
  // We'll just define it inline where needed, or replace the main entry
  content = content.replace(
    'export default function StaffPendingInviteDetails() {',
    'const STYLES = {\n  sectionTitle: "text-[16px] font-semibold text-gray-900 mb-5 relative pl-3 before:absolute before:left-0 before:top-1 before:w-[3px] before:h-4 before:bg-blue-600 before:rounded-full",\n  label: "text-[13px] text-gray-600 font-medium mb-1.5 block",\n  input: "w-full h-[38px] text-sm bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg transition-all",\n  card: "bg-white p-6 shadow-sm border border-gray-100/50 rounded-xl hover:shadow-md transition-shadow duration-200"\n};\n\nexport default function StaffPendingInviteDetails() {'
  );
}

// 1. Labels
content = content.replace(/className=\"text-xs font-semibold uppercase text-gray-500 tracking-wide mb-1\.5 block\"/g, 'className={STYLES.label}');
content = content.replace(/className=\"text-xs font-semibold text-gray-500 mb-1\.5 block\"/g, 'className={STYLES.label}');
// Match `<Label ...>` specific ones
content = content.replace(/<Label className="text-xs font-semibold text-gray-500">/g, '<Label className={STYLES.label}>');

// 2. Inputs 
const classesToReplace = [
    "className=\"mt-auto h-10 w-full border-gray-200 bg-gray-50 text-gray-500 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100\"",
    "className=\"h-10 w-full border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100\"",
    "className=\"h-10 w-full border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400\"",
    "className=\"bg-white w-full h-10 border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100 text-gray-600\"",
    "className=\"bg-gray-50 w-full h-10 border-gray-200 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100 text-gray-600\"",
    "className=\"mt-auto bg-gray-50 w-full h-10 border-gray-200 transition-all text-[13px] rounded-lg text-gray-500\"",
    "className=\"bg-gray-50 w-full h-10 border-gray-200 text-gray-500 transition-all text-[13px] rounded-lg focus:ring-2 focus:ring-blue-100\"",
    "className=\"h-10 text-[13px] border-gray-200 bg-white\""
];

for (const cls of classesToReplace) {
    content = content.split(cls).join('className={STYLES.input}');
}

content = content.replace(/className=\"w-full text-left font-normal bg-white h-10 border-gray-200 text-\[13px\]\"/g, 'className={cn("w-full text-left font-normal justify-between", STYLES.input)}');
content = content.replace(/className=\"w-full flex justify-between items-center text-left font-normal bg-white h-10 border-gray-200 text-\[13px\]\"/g, 'className={cn("w-full flex justify-between items-center text-left font-normal", STYLES.input)}');
content = content.replace(/className=\"min-h-\[100px\] text-\[13px\] resize-none bg-gray-50 border-gray-200 mt-1\"/g, 'className={STYLES.input + " min-h-[100px] resize-none"}');

// 3. Cards
content = content.replace(/className=\"bg-white border border-gray-100 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] p-6 space-y-6 relative overflow-hidden transition-all duration-300\"/g, 'className={STYLES.card + " space-y-6 relative overflow-hidden transition-all duration-300"}');

content = content.replace(/className=\"bg-white border text-center p-8 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] hover:shadow-md transition-shadow relative overflow-hidden group\"/g, 'className={STYLES.card + " text-center relative overflow-hidden group hover:border-blue-300"}');

content = content.replace(/className=\"bg-white border border-gray-100 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] p-6 space-y-6 relative overflow-hidden\"/g, 'className={STYLES.card + " space-y-6 relative overflow-hidden"}');

// 4. Section Headers (the flex titles) -> Map visually but preserve icon sizes by just styling the wrapper / h3
// Wait, Create Package doesn't use the colored icons for titles. It just uses a clean text with blue pill border.
content = content.replace(/<div className="flex items-center gap-3 pb-[0-9] border-b border-gray-100">\s*<div[^>]*>[\s\S]*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">(.*?)<\/h3>[\s\S]*?<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>$1</h3>');

// 5. Next / Prev buttons matching primaryBtnTarget
const primaryBtnTarget = 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 gap-2 rounded-lg px-6 font-medium text-white transition-all disabled:opacity-50';
content = content.replace(/className=\"h-11 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed\"/g, `className="${primaryBtnTarget} h-[38px] flex items-center justify-center"`);
content = content.replace(/className=\"w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600\/20 transition-all flex items-center justify-center gap-2 mt-8\"/g, `className="${primaryBtnTarget} w-full h-[38px] mt-8 flex items-center justify-center"`);
content = content.replace(/className=\"flex-\[2\] h-12 bg-green-600 hover:bg-green-700 shadow-sm hover:shadow text-white font-semibold tracking-wide transition-all\"/g, `className="flex-[2] bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20 gap-2 rounded-lg px-6 font-medium text-white transition-all h-[38px] flex items-center justify-center"`);
content = content.replace(/className=\"flex-1 h-12 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-colors\"/g, `className="flex-1 h-[38px] border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"`);

// 6. Sidebar missing summary step
// Wait, the Summary step needs to exist!
// Our previous array string:
content = content.replace(
  `{ id: 'summary', label: 'Summary & Activation', completed: currentStep === 4 },`,
  `{ id: 'summary', label: 'Summary & Activation', completed: currentStep === 4 },`
);

fs.writeFileSync(file, content);
console.log('Styles pure replacement executed!');
