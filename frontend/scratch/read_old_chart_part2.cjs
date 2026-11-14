const { execSync } = require('child_process');
try {
  const content = execSync('git show f2638f6:src/components/LiveDemo.jsx').toString();
  const lines = content.split('\n');
  console.log(lines.slice(1340, 1480).join('\n'));
} catch (e) {
  console.error(e);
}

