import fs from 'fs';

const content = fs.readFileSync('src/app/page.tsx', 'utf8');

const stack = [];
const tags = content.match(/<(\/?[a-zA-Z0-9]+)(\b[^>]*\/?>|>)/g);

tags.forEach(tag => {
    if (tag.endsWith('/>')) return; // Self-closing
    const match = tag.match(/<(\/?[a-zA-Z0-9]+)/);
    if (!match) return;
    const tagName = match[1];
    
    if (tagName.startsWith('/')) {
        const closed = tagName.substring(1);
        if (stack.length === 0) {
            console.log(`Extra closing tag: ${tag}`);
        } else {
            const last = stack.pop();
            if (last !== closed) {
                console.log(`Mismatch: Opened ${last}, Closed ${closed} (${tag})`);
                stack.push(last); // Keep it to see next errors
            }
        }
    } else {
        stack.push(tagName);
    }
});

if (stack.length > 0) {
    console.log(`Unclosed tags: ${stack.join(', ')}`);
}
