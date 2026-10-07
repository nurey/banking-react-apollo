import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// index.css only scans the flowbite-react components we list, so a component imported
// without being listed would render unstyled. This keeps the two in sync.

const root = join(import.meta.dirname, '../..');
const componentsDir = join(root, 'node_modules/flowbite-react/dist/components');

function listedComponents() {
  const css = readFileSync(join(root, 'src/styles/index.css'), 'utf-8');
  const match = css.match(/@source "[^"]*flowbite-react\/dist\/components\/\{([^}]+)\}/);
  return match[1].split(',');
}

function importedNames() {
  const names = new Set();
  const files = readdirSync(join(root, 'src'), { recursive: true })
    .filter((f) => /\.jsx?$/.test(f) && !/\.test\.jsx?$/.test(f));
  for (const file of files) {
    const source = readFileSync(join(root, 'src', file), 'utf-8');
    for (const [, list] of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]flowbite-react['"]/g)) {
      list.split(',').map((n) => n.trim()).filter(Boolean).forEach((n) => names.add(n));
    }
  }
  return names;
}

function componentExporting(name) {
  return readdirSync(componentsDir).find((dir) => {
    try {
      return new RegExp(`export \\{[^}]*\\b${name}\\b`).test(readFileSync(join(componentsDir, dir, 'index.js'), 'utf-8'));
    } catch {
      return false;
    }
  });
}

describe('flowbite-react @source in index.css', () => {
  it('lists every component the app imports', () => {
    const listed = listedComponents();
    const names = importedNames();
    expect(names.size).toBeGreaterThan(0);
    for (const name of names) {
      expect(listed, `${name} comes from flowbite-react's ${componentExporting(name)} component`).toContain(componentExporting(name));
    }
  });
});
