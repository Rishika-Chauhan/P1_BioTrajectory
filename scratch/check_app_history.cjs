const { execSync } = require('child_process');
try {
  const log = execSync('git log -n 5 -p src/App.jsx').toString();
  console.log(log.slice(0, 3000));
} catch (e) {
  console.error(e);
}

