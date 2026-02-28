const fs = require('fs');
const file = 'client/src/pages/StaffPendingInviteDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// The STYLES constant to ensure it's at the top
if (!content.includes('const STYLES = {')) {
  content = content.replace(
    'export default function StaffPendingInviteDetails() {',
    'const STYLES = {\n  sectionTitle: "text-[16px] font-semibold text-gray-900 mb-5 relative pl-3 before:absolute before:left-0 before:top-1 before:w-[3px] before:h-4 before:bg-blue-600 before:rounded-full",\n  label: "text-[13px] text-gray-600 font-medium mb-1.5 block",\n  input: "w-full h-[38px] text-sm bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg transition-all",\n  card: "bg-white p-6 shadow-sm border border-gray-100/50 rounded-xl hover:shadow-md transition-shadow duration-200",\n};\n\nexport default function StaffPendingInviteDetails() {'
  );
}

// Map the precise long input and label classes
// Labels
content = content.replace(/className=\"text-xs font-semibold uppercase text-gray-500 tracking-wide mb-1\.5 block\"/g, 'className={STYLES.label}');
content = content.replace(/className=\"text-xs font-semibold text-gray-500 mb-1\.5 block\"/g, 'className={STYLES.label}');
content = content.replace(/className=\"text-xs font-semibold text-gray-500\"/g, 'className={STYLES.label}');
content = content.replace(/className=\"text-xs font-[^"]*text-gray-500[^"]*\"/g, (match, p1) => {
    if (match.includes("mb-1.5") || match.includes("tracking-wide")) return "className={STYLES.label}";
    return match;
});

// Inputs
content = content.replace(/className=\"(mt-auto )?h-10 w-full border-gray-200 bg-gray-50 text-gray-500 transition-all text-\[13px\] rounded-lg focus:ring-2 focus:ring-blue-100( placeholder:text-gray-400)?\"/g, 'className={STYLES.input}');
content = content.replace(/className=\"(mt-auto )?h-10 w-full border-gray-200 transition-all text-\[13px\] rounded-lg focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400\"/g, 'className={STYLES.input}');
content = content.replace(/className=\"(mt-auto )?bg-(white|gray-50) w-full h-10 border-gray-200 transition-all text-\[13px\] rounded-lg focus:ring-2 focus:ring-blue-100 text-gray-600\"/g, 'className={STYLES.input}');
content = content.replace(/className=\"mt-auto bg-gray-50 w-full h-10 border-gray-200 transition-all text-\[13px\] rounded-lg text-gray-500\"/g, 'className={STYLES.input}');
content = content.replace(/className=\"(mt-auto )?bg-gray-50 w-full h-10 border-gray-200 text-gray-500 transition-all text-\[13px\] rounded-lg focus:ring-2 focus:ring-blue-100\"/g, 'className={STYLES.input}');
content = content.replace(/className=\"w-full text-left font-normal bg-white h-10 border-gray-200 text-\[13px\]\"\n/g, 'className={cn("w-full text-left font-normal justify-between", STYLES.input)}\n');
content = content.replace(/className=\"w-full flex justify-between items-center text-left font-normal bg-white h-10 border-gray-200 text-\[13px\]\"/g, 'className={cn("w-full flex justify-between items-center text-left font-normal", STYLES.input)}');
content = content.replace(/className=\"h-10 text-[13px] border-gray-200 bg-white\"/g, 'className={STYLES.input}');
content = content.replace(/className=\"min-h-\[100px\] text-\[13px\] resize-none bg-gray-50 border-gray-200 mt-1\"/g, 'className={STYLES.input + " min-h-[100px] resize-none"}');
content = content.replace(/className=\"text-xs file:text-xs file:font-medium file:text-blue-600 file:bg-blue-50 file:border-0 file:mr-3 file:px-2 file:py-1 file:rounded-md h-10 w-full bg-gray-50 border-gray-200 hover:border-blue-300 transition-all\"/g, 'className={STYLES.input + " file:text-xs file:font-medium file:text-blue-600 file:bg-blue-50 file:border-0 file:mr-3 file:px-2 file:py-1 file:rounded-md"}');
content = content.replace(/<SelectTrigger className=".*h-10.*"/g, `<SelectTrigger className={STYLES.input}`);

// Buttons
const primaryBtnTarget = 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 gap-2 rounded-lg px-6 font-medium text-white transition-all disabled:opacity-50';
content = content.replace(/className=\"h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white flex items-center gap-2\"/g, 
  `className="${primaryBtnTarget} h-10 flex items-center justify-center"`);
content = content.replace(/className=\"w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600\/20 transition-all flex items-center justify-center gap-2 mt-8\"/g, 
  `className="${primaryBtnTarget} w-full h-10 flex items-center justify-center mt-8"`);

// Remove Sidebar & Apply Container wrapper
const topHtml = `<div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/50">
        <div className="flex-none px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/workforce/pending")} className="rounded-full hover:bg-gray-100 text-gray-500">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                   <h1 className="text-xl font-bold text-gray-900 tracking-tight">{data.name}</h1>
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Pending Invite
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setLocation("/workforce/pending")} className="text-gray-600 hover:text-gray-900">Discard</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 gap-2 rounded-lg px-6 font-medium text-white transition-all h-[38px] flex items-center justify-center disabled:opacity-50" onClick={handleActivate} disabled={!canActivate}>
                  <CheckCircle className="h-4 w-4" />
                  Save & Activate
                </Button>
             </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">`;

// Cut out existing Dashboard Layout space-y-6 wrapper up to 0. BASIC INFORMATION
const startMatch = '<div className="space-y-6">';
const endMatch = '{/* 0. BASIC INFORMATION */}';
const startIndex = content.indexOf(startMatch);
const endIndex = content.indexOf(endMatch);
if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + topHtml + '\n' + content.substring(endIndex);
}

// Convert "5. SUMMARY & ACTIVATION" Step into a Card without breaking it
const summaryMatch = `<div className="text-center py-4 bg-gradient-to-b from-green-50 to-transparent rounded-xl border border-green-100">
                               <div className="h-14 w-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border-2 border-white">
                                   <ShieldCheck className="h-7 w-7" />
                               </div>
                               <h2 className="text-xl font-bold text-gray-900">Review & Activate</h2>
                               <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                                   Finalize the staff member's profile for deployment.
                               </p>
                            </div>`;

content = content.replace(summaryMatch, `<div className={STYLES.card}><h3 className={STYLES.sectionTitle}>Summary</h3><div className="mb-6"><p className="text-sm text-gray-500">Review the finalized staff member's profile for deployment.</p></div>`);

// Replace closing tags
content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/DashboardLayout>/, '</div></div></div></DashboardLayout>');
content = content.replace(/<\/div>\s*<\/div>\s*<\/DashboardLayout>/, '</div></div></DashboardLayout>');

// Convert all top-level `{currentStep === X && (` to generic blocks
content = content.replace(/{currentStep === 0 && \(/g, '<div className="space-y-8">');
content = content.replace(/{currentStep === 1 && \(/g, '<div className="space-y-8">');
content = content.replace(/{currentStep === 2 && \(/g, '<div className="space-y-8">');
content = content.replace(/{currentStep === 3 && \(/g, '<div className="space-y-8">');
content = content.replace(/{currentStep === 4 && \(/g, '<div className="space-y-8">');
// Since steps had array items removed previously, let's also remove 99 if it existed 
content = content.replace(/{currentStep === 99 && \(/g, '<div className="space-y-8">');

content = content.replace(/\n\s{20,24}\)\}/g, '\n                    </div>');

// Map Cards styling
content = content.replace(/<div className="bg-white border text-center p-8 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] hover:shadow-md transition-shadow relative overflow-hidden group">/g, '<div className={STYLES.card + " text-center relative overflow-hidden group border-blue-100"}>');
content = content.replace(/<div className="bg-white border border-gray-100 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] p-6 space-y-6 relative overflow-hidden transition-all duration-300">/g, '<div className={STYLES.card + " space-y-6 relative overflow-hidden transition-all duration-300"}>');
content = content.replace(/<div className="bg-white border border-gray-100 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] p-6 space-y-6 relative overflow-hidden">/g, '<div className={STYLES.card + " space-y-6 relative overflow-hidden"}>');

// Remove bottom Next/Previous footers entirely
content = content.replace(/<div className="pt-8 border-t border-gray-100 flex items-center justify-between">[\s\S]*?<\/div>\n\s*<\/div>/g, '</div>');
content = content.replace(/<div className="pt-4 flex items-center justify-between">[\s\S]*?<\/div>\n\s*<\/div>/g, '</div>');

// Titles mapping manually to avoid bad matches
content = content.replace(/<div className="flex items-center gap-3 pb-3 border-b border-gray-100">\s*<div.*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">Personal Details<\/h3>\s*<p className="text-xs text-gray-500">.*?<\/p>\s*<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>Personal Details</h3>');
content = content.replace(/<div className="flex items-center gap-3 pb-2 border-b border-gray-100">\s*<div.*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">Role Information<\/h3>\s*<p className="text-xs text-gray-500">.*?<\/p>\s*<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>Role Information</h3>');
content = content.replace(/<div className="flex items-center gap-3 pb-2 border-b border-gray-100">\s*<div.*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">Compensation<\/h3>\s*<p className="text-xs text-gray-500">.*?<\/p>\s*<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>Compensation</h3>');
content = content.replace(/<div className="flex items-center gap-3 pb-2 border-b border-gray-100">\s*<div.*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">Professional Profile<\/h3>\s*<p className="text-xs text-gray-500">.*?<\/p>\s*<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>Professional Profile</h3>');
content = content.replace(/<div className="flex items-center gap-3 pb-4 border-b border-gray-100">\s*<div.*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">Access & Security<\/h3>\s*<p className="text-xs text-gray-500">.*?<\/p>\s*<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>Access & Security</h3>');

// Removing unused states
content = content.replace(/const \[currentStep, setCurrentStep\] = useState\(0\);/g, 'const currentStep = 0;');

fs.writeFileSync(file, content);
console.log('Script fixed');
