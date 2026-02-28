const fs = require('fs');
const file = 'client/src/pages/StaffPendingInviteDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove left sidebar layout and convert to Dashboard Layout CreatePackage style
const topHtml = `<div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50/50">
        <div className="flex-none px-8 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setLocation("/workforce/pending")} className="rounded-full hover:bg-gray-100 text-gray-500">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                   <h1 className="text-xl font-bold text-gray-900 tracking-tight">Review Staff Details</h1>
                   <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Pending Invitation
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setLocation("/workforce/pending")} className="text-gray-600 hover:text-gray-900">Discard</Button>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 gap-2 rounded-lg px-6 font-medium text-white transition-all disabled:opacity-50 h-10 flex items-center justify-center" disabled={!canActivate} onClick={() => { saveChanges(true); if (reqs.access) handleActivate(); }}>
                  <CheckCircle className="h-4 w-4" />
                  Activate Profile
                </Button>
             </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-8 pb-32">`;

// Cut from Split View start to right before step 0
const startMatch = '<div className="space-y-6">';
const endMatch = '{/* 0. BASIC INFORMATION */}';
const startIndex = content.indexOf(startMatch);
const endIndex = content.indexOf(endMatch);
if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + topHtml + '\n' + content.substring(endIndex);
}

// Map the end layout closing tags
content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/DashboardLayout>/, '</div></div></div></DashboardLayout>');
content = content.replace(/<\/div>\s*<\/div>\s*<\/DashboardLayout>/, '</div></div></DashboardLayout>');

// 2. Remove step conditionals (currentStep === X)
content = content.replace(/{currentStep === 0 && \(/g, '<div className="space-y-8 animate-in fade-in" id="step0">');
content = content.replace(/{currentStep === 1 && \(/g, '<div className="space-y-8 animate-in fade-in pt-6 border-t border-gray-200" id="step1">');
content = content.replace(/{currentStep === 2 && \(/g, '<div className="space-y-8 animate-in fade-in pt-6 border-t border-gray-200" id="step2">');
content = content.replace(/{currentStep === 3 && \(/g, '<div className="space-y-8 animate-in fade-in pt-6 border-t border-gray-200" id="step3">');
content = content.replace(/{currentStep === 99 && \(/g, '<div className="space-y-8 animate-in fade-in pt-6 border-t border-gray-200" id="step4">');

// Find and replace the ending )} wrapper for the 5 conditionals
// We do this by searching for the "                     )}" precisely formatted inside the steps
content = content.replace(/\n\s{20,24}\)\}/g, '\n                    </div>');

// Remove bottom Next/Previous section footers
content = content.replace(/<div className="pt-8 border-t border-gray-100 flex items-center justify-between">[\s\S]*?<\/div>\n\s*<\/div>/g, '</div>');
content = content.replace(/<div className="pt-4 flex items-center justify-between">[\s\S]*?<\/div>\n\s*<\/div>/g, '</div>');

// Replace inner containers to be div with Card styling (keeps </div> valid)
content = content.replace(/<div className="bg-white border text-center p-8 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] hover:shadow-md transition-shadow relative overflow-hidden group">/g, '<div className={STYLES.card + " text-center relative overflow-hidden group border-blue-100"}>');
content = content.replace(/<div className="bg-white border border-gray-100 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] p-6 space-y-6 relative overflow-hidden transition-all duration-300">/g, '<div className={STYLES.card + " space-y-6 relative overflow-hidden transition-all duration-300"}>');
content = content.replace(/<div className="bg-white border border-gray-100 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] p-6 space-y-6 relative overflow-hidden">/g, '<div className={STYLES.card + " space-y-6 relative overflow-hidden"}>');

// Simplify Section Headers to use STYLES.sectionTitle instead of flex icons
content = content.replace(/<div className="flex items-center gap-3 pb-3 border-b border-gray-100">\s*<div[^>]*>[\s\S]*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">(.*?)<\/h3>[\s\S]*?<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>$1</h3>');
content = content.replace(/<div className="flex items-center gap-3 pb-2 border-b border-gray-100">\s*<div[^>]*>[\s\S]*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">(.*?)<\/h3>[\s\S]*?<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>$1</h3>');
content = content.replace(/<div className="flex items-center gap-3 pb-4 border-b border-gray-100">\s*<div[^>]*>[\s\S]*?<\/div>\s*<div>\s*<h3 className="text-lg font-bold text-gray-900">(.*?)<\/h3>[\s\S]*?<\/div>\s*<\/div>/g, '<h3 className={STYLES.sectionTitle}>$1</h3>');

// Handle Summary "Text center py-4 bg-gradient..."
content = content.replace(/<div className="text-center py-4 bg-gradient[\s\S]*?<\/div>/, '<h3 className={STYLES.sectionTitle + " text-center"}>Review & Activate Profile</h3>');

fs.writeFileSync(file, content);
console.log('Restructured');
