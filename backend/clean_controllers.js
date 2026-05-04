const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');

const files = fs.readdirSync(controllersDir);

files.forEach(file => {
    if (file.endsWith('.js')) {
        const filePath = path.join(controllersDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove commented model requirements
        content = content.replace(/\/\/ const .* = require\(['"]\.\.\/models\/.*['"]\);?\n?/g, '');
        // Remove active model requirements (if any left)
        content = content.replace(/const .* = require\(['"]\.\.\/models\/.*['"]\);?\n?/g, '');
        // Remove some common commented blocks
        content = content.replace(/\/\*[\s\S]*?await .*?\.(find|save|update|delete)[\s\S]*?\*\//g, '');
        // Remove line-by-line commented mongo code
        content = content.replace(/\/\/ const .* = await .*\.find.*\n?/g, '');
        content = content.replace(/\/\/ const .* = await .*\.create.*\n?/g, '');
        content = content.replace(/\/\/ const .* = await .*\.findById.*\n?/g, '');
        
        fs.writeFileSync(filePath, content);
        console.log(`Cleaned ${file}`);
    }
});
