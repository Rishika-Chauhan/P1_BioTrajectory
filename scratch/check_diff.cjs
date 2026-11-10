const { execSync } = require('child_process');
try {
  const diff = execSync('git diff f2638f6 438cbb6 --stat').toString();
  console.log(diff);
} catch (e) {
  console.error(e);
}

