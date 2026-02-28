const fs = require('fs');

const file = 'client/src/pages/StaffPendingInviteDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace DashboardLayout inner wrapper (from flex nav to end of right panel start)
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

// Remove from `<div className="space-y-6">` to `{currentStep === 0 && (`
const startMatch = '<div className="space-y-6">';
const endMatch = '{/* 0. BASIC INFORMATION */}';
const startIndex = content.indexOf(startMatch);
const endIndex = content.indexOf(endMatch);
if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + topHtml + '\n' + content.substring(endIndex);
}

// Replace the end tag of the page (removing the closing divs of the split view)
// Need to replace the final `</div></div></div></div></DashboardLayout>`
content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/DashboardLayout>/, '</div></div></div></DashboardLayout>');

// 2. Remove all `{currentStep === X && (` conditions
content = content.replace(/{currentStep === 0 && \(/g, '<div className="space-y-8 animate-in fade-in">');
content = content.replace(/{currentStep === 1 && \(/g, '<div className="space-y-8 animate-in fade-in pt-6 border-t border-gray-200">');
content = content.replace(/{currentStep === 2 && \(/g, '<div className="space-y-8 animate-in fade-in pt-6 border-t border-gray-200">');
content = content.replace(/{currentStep === 3 && \(/g, '<div className="space-y-8 animate-in fade-in pt-6 border-t border-gray-200">');
content = content.replace(/{currentStep === 99 && \(/g, '<div className="space-y-8 animate-in fade-in pt-6 border-t border-gray-200">');

// We have 5 steps, so we need to remove the matching `)}` for each step block.
// Each block ends with `)}` at the outermost scope. We can just replace all `\n                    )}` or similar.
// A simpler way: Find all `)}` that are on a line by themselves with 20 spaces. Let's just do a regex.
content = content.replace(/\n\s{20,24}\)\}/g, '\n                    </div>');

// 3. Remove Next/Prev Footers
content = content.replace(/<div className="pt-8 border-t border-gray-100 flex items-center justify-between">[\s\S]*?<\/div>/g, '');
content = content.replace(/<div className="pt-4 flex items-center justify-between">[\s\S]*?<\/div>/g, '');

// 4. Map the big white boxes to Cards and Titles
content = content.replace(/<div className="bg-white border text-center p-8 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] hover:shadow-md transition-shadow relative overflow-hidden group">/g, '<Card className={STYLES.card + " text-center relative overflow-hidden group border-blue-100"}>');

content = content.replace(/<div className="bg-white border border-gray-100 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] p-6 space-y-6 relative overflow-hidden transition-all duration-300">/g, '<Card className={STYLES.card + " space-y-6 relative overflow-hidden transition-all duration-300"}>');

content = content.replace(/<div className="bg-white border border-gray-100 rounded-2xl shadow-\[0_2px_10px_rgb\(0,0,0,0\.02\)\] p-6 space-y-6 relative overflow-hidden">/g, '<Card className={STYLES.card + " space-y-6 relative overflow-hidden"}>');

// Remove the `flex items-center gap-3 pb-3 border-b border-gray-100` headers since we'll replace the titles directly
// Wait, mapping everything automatically is risky. Let's map the general Title logic.
content = content.replace(/<div className="flex items-center gap-3 pb-[0-9] border-b border-gray-100">\s*<div.*?<\/div>\s*<div>\s*<h3.*\n.*\n\s*<\/div>\s*<\/div>/g, (match) => {
    // Extract title text
    const titleMatch = match.match(/<h3[^>]*>(.*?)<\/h3>/);
    if(titleMatch) {
       return `<h3 className={STYLES.sectionTitle}>${titleMatch[1]}</h3>`;
    }
    return match;
});

// For instances where it's not matched perfectly:
content = content.replace(/<h3 className="text-lg font-bold text-gray-900">/g, '<h3 className={STYLES.sectionTitle}>');

fs.writeFileSync(file, content);
console.log('Structure mapping complete');
