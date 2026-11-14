const { execSync } = require('child_process');
try {
  const commits = execSync('git log --format=%H -n 30').toString().trim().split('\n');
  for (const c of commits) {
    try {
      const show = execSync(`git grep -n "Advisory Threshold" ${c}`).toString();
      console.log('Found in commit', c, show);
      break;
    } catch (e) {}
  }
} catch (err) {
  console.error(err);
}
