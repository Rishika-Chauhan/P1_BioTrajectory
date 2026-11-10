import fs from 'fs';
function walk(d){
  for(const f of fs.readdirSync(d)){
    const p = d + '/' + f;
    if(fs.statSync(p).isDirectory()) walk(p);
    else console.log(p);
  }
}
walk('./src/pages');

