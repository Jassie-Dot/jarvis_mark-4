const fs = require('fs');

const content = fs.readFileSync('server.js', 'utf8');

let stack = [];
let inString = false;
let stringChar = '';
let inComment = false; // // style
let inMultiComment = false; // /* style */
let inTemplate = false;

function getLine(idx) {
    let line = 1;
    for (let i = 0; i < idx; i++) {
        if (content[i] === '\n') line++;
    }
    return line;
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
    } else if (inTemplate) {
        if (char === '\\') {
            i++;
        } else if (char === '`') {
            inTemplate = false;
        } else if (char === '$' && next === '{') {
            stack.push({ char: '${', index: i, line: getLine(i) });
            i++;
            // We are now in code, but still arguably inside the template logic?
            // Actually, inside ${} we revert to normal code parsing until }
            // But dealing with that recursion is hard in this simple script. 
            // Let's just track { and } blindly? No, braces inside string/comments don't count.
            // This script is too simple for template literals with nesting.
            // However, if we just treat ` as a string delimiter that can contain anything except `, it might fail on ${...}.
            // But let's try to just treat ` as a quote for now.
        }
    } else {
        // Not in string/comment
        if (char === '/' && next === '/') {
            inComment = true;
            i++;
        } else if (char === '/' && next === '*') {
            inMultiComment = true;
            i++;
        } else if (char === '"' || char === "'") {
            inString = true;
            stringChar = char;
        } else if (char === '`') {
            inTemplate = true;
        } else if (char === '(' || char === '{' || char === '[') {
            stack.push({ char, index: i, line: getLine(i) });
        } else if (char === ')' || char === '}' || char === ']') {
            if (stack.length === 0) {
                console.log(`Extra '${char}' at line ${getLine(i)} (index ${i})`);
            } else {
                const last = stack.pop();
                // Check if last was ${ (which we don't track well here)
                // If we assume simple matching:
                const map = { '(': ')', '{': '}', '[': ']' };
                const expected = map[last.char];
                if (char !== expected) {
                    // If we popped a '${', it expects '}'. 
                    // But we didn't push '${' in this simplified logic effectively unless we treat it as '{'.
                    console.log(`Mismatch! Expected ${expected} (from line ${last.line}) but got ${char} at line ${getLine(i)}`);
                }
            }
        }
    }
    i++;
}

if (stack.length > 0) {
    const last = stack[stack.length - 1];
    console.log(`Unclosed '${last.char}' from line ${last.line}`);
} else {
    console.log("No simple nesting errors found.");
}
