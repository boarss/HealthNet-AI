const fs = require('fs');
const path = require('path');

// Read the colortoken.json file
const dataPath = path.join(__dirname, 'colortoken.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);
const color = data.color;

// Utility to convert camelCase/PascalCase to kebab-case
function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Utility to resolve reference values like "{color.palette.primary.100}"
// Supports case-insensitive lookup (e.g. error vs Error)
function resolveValue(expression, rootData) {
  if (typeof expression !== 'string' || !expression.startsWith('{') || !expression.endsWith('}')) {
    return expression; // Return as-is if it's already a resolved value like "hsl(...)"
  }
  
  const pathParts = expression.slice(1, -1).split('.');
  let current = rootData;
  
  for (const key of pathParts) {
    if (current == null) return expression;
    // Find the property case-insensitively
    const actualKey = Object.keys(current).find(k => k.toLowerCase() === key.toLowerCase());
    
    if (actualKey) {
      current = current[actualKey];
    } else {
      console.warn(`Could not resolve path reference: ${expression}`);
      return expression; 
    }
  }
  
  // If the resolved value points to another reference, keep resolving recursively
  if (typeof current === 'string' && current.startsWith('{')) {
    return resolveValue(current, rootData);
  }
  
  return current;
}

let cssContent = `/* Generated from colortoken.json */\n\n`;

// Generate base colors and light mode variables inside :root
cssContent += `:root {\n`;

if (color.key) {
  cssContent += `  /* Key Colors */\n`;
  for (const [key, val] of Object.entries(color.key)) {
    cssContent += `  --key-${toKebabCase(key)}: ${val};\n`;
  }
  cssContent += `\n`;
}

if (color.palette) {
  cssContent += `  /* Palettes */\n`;
  for (const [paletteName, shades] of Object.entries(color.palette)) {
    for (const [shade, val] of Object.entries(shades)) {
      cssContent += `  --palette-${toKebabCase(paletteName)}-${shade}: ${val};\n`;
    }
  }
  cssContent += `\n`;
}

if (color.role && color.role.light) {
  cssContent += `  /* Light Theme Roles */\n`;
  for (const [role, val] of Object.entries(color.role.light)) {
    const resolvedVal = resolveValue(val, data);
    cssContent += `  --color-${toKebabCase(role)}: ${resolvedVal};\n`;
  }
}

cssContent += `}\n\n`;

// Generate dark mode variables
if (color.role && color.role.dark) {
  cssContent += `/* Dark Theme - via media query */\n`;
  cssContent += `@media (prefers-color-scheme: dark) {\n`;
  cssContent += `  :root {\n`;
  for (const [role, val] of Object.entries(color.role.dark)) {
    const resolvedVal = resolveValue(val, data);
    cssContent += `    --color-${toKebabCase(role)}: ${resolvedVal};\n`;
  }
  cssContent += `  }\n`;
  cssContent += `}\n\n`;
  
  cssContent += `/* Dark Theme - via class selector for manual toggling */\n`;
  cssContent += `[data-theme="dark"], .dark {\n`;
  for (const [role, val] of Object.entries(color.role.dark)) {
    const resolvedVal = resolveValue(val, data);
    cssContent += `  --color-${toKebabCase(role)}: ${resolvedVal};\n`;
  }
  cssContent += `}\n`;
}

// Write the output to a CSS file
const outputPath = path.join(__dirname, 'src', 'theme.css');
fs.writeFileSync(outputPath, cssContent);

console.log('✅ Successfully generated CSS variables to theme.css!');
