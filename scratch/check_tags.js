import fs from 'fs';

const content = fs.readFileSync('src/app/page.tsx', 'utf8');

function countTags(tagName) {
    const open = (content.match(new RegExp(`<${tagName}(>|\\s)`, 'g')) || []).length;
    const close = (content.match(new RegExp(`</${tagName}>`, 'g')) || []).length;
    return { open, close };
}

['div', 'section', 'main', 'footer', 'Button', 'Link', 'Image', 'Card', 'CardHeader', 'CardContent', 'CardTitle', 'CMSPageRenderer', 'MainHeader', 'AnimatePresence', 'ImpactGoals', 'VisitorCounter', 'LogoCarousel', 'NewsListPublic', 'Input', 'Textarea', 'Label'].forEach(tag => {
    const counts = countTags(tag);
    if (counts.open !== counts.close) {
        console.log(`Tag mismatch: ${tag} (Open: ${counts.open}, Close: ${counts.close})`);
    } else {
        console.log(`Tag match: ${tag} (${counts.open})`);
    }
});
