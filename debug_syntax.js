const fs = require('fs');

const content = fs.readFileSync('public/script.js', 'utf8');

let stack = [];
let inString = false;
let stringChar = '';
let inComment = false; // // style
let inMultiComment = false; // /* style */

function getLines(str, idx) {
    return str.substring(0, idx).split('\n').length;
}

let i = 0;
while (i < content.length) {
    const char = content[i];
    const next = content[i + 1];

    if (inComment) {
        if (char === '\n') inComment = false;
    } else if (inMultiComment) {
        if (char === '*' && next === '/') {
            inMultiComment = false;
            i++;
        }
    } else if (inString) {
        if (char === '\\') {
            i++; // skip escaped
        } else if (char === stringChar) {
            inString = false;
        }
    } else {
        // Not in string/comment
        if (char === '/' && next === '/') {
            inComment = true;
            i++;
        } else if (char === '/' && next === '*') {
            inMultiComment = true;
            i++;
        } else if ((char === '"' || char === "'" || char === '`')) {
            inString = true;
            stringChar = char;
        } else if (char === '(' || char === '{' || char === '[') {
            stack.push({ char, index: i, line: getLines(content, i) });
        } else if (char === ')' || char === '}' || char === ']') {
            if (stack.length === 0) {
                console.log(`Extra '${char}' at line ${getLines(content, i)} (index ${i})`);
            } else {
                const last = stack.pop();
                const expected = last.char === '(' ? ')' : last.char === '{' ? '}' : ']';
                if (char !== expected) {
                    console.log(`Mismatch! Expected line ${last.line} '${last.char}' to match '${expected}', but found '${char}' at line ${getLines(content, i)} (index ${i})`);
                    process.exit(1); // Exit on first error to avoid noise
                }
            }
        }
    }
    i++;
}

if (stack.length > 0) {
    const last = stack[stack.length - 1];
    console.log(`Unclosed '${last.char}' from line ${last.line} (index ${last.index})`);
} else {
    console.log("No simple nesting errors found.");
}
