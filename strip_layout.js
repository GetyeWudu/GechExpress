const fs = require('fs');
const glob = require('glob');

const files = glob.sync('client/app/seller/**/page.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Remove layout imports
  content = content.replace(/import\s+{\s*SellerSidebar\s*}\s+from\s+["']@\/components\/seller\/seller-sidebar["'];\n/g, '');
  content = content.replace(/import\s+{\s*SellerHeader\s*}\s+from\s+["']@\/components\/seller\/seller-header["'];\n/g, '');

  // The layout wrapper looks like this:
  // <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
  //   <SellerSidebar />
  //   <div className="flex flex-1 flex-col lg:pl-64">
  //     <SellerHeader />
  //     <main className="flex-1 p-4 sm:p-6 lg:p-8">
  //       {children}
  //     </main>
  //   </div>
  // </div>

  // Let's do a simple regex replacement
  const startRegex = /<div className="flex min-h-screen[^>]*>\s*<SellerSidebar \/>\s*<div className="flex flex-1 flex-col[^>]*>\s*<SellerHeader \/>\s*<main className="flex-1 p-4 sm:p-6 lg:p-8">\s*/g;

  const endRegex = /\s*<\/main>\s*<\/div>\s*<\/div>/g;

  if (content.match(startRegex)) {
    content = content.replace(startRegex, '');
    content = content.replace(endRegex, '');
    fs.writeFileSync(file, content);
    console.log(`Stripped layout from ${file}`);
  } else {
    console.log(`No match in ${file}`);
  }
});
