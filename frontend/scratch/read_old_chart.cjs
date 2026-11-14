const { execSync } = require('child_process');
try {
  const content = execSync('git show f2638f6:src/components/LiveDemo.jsx').toString();
  const lines = content.split('\n');
  const start = Math.max(0, 1200 - 50);
  const end = Math.min(lines.length, 1350);
  console.log(lines.slice(start, end).join('\n'));
} catch (e) {
  console.error(e);
}

