import fs from 'node:fs'
import path from 'node:path'
const root = process.argv[2]
const roots = ['src/components','src/patterns','packages/platform-pages/src','packages/edge-pages/src']
const skip = [/\.stories\.(ts|tsx)$/, /\.test\.(ts|tsx)$/]
const files=[]
const walk=d=>{ if(!fs.existsSync(d))return; for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory())walk(p); else if(/\.(ts|tsx)$/.test(e.name)&&!skip.some(r=>r.test(p)))files.push(p)}}
roots.forEach(r=>walk(path.join(root,r)))
const blocks=[]
for(const f of files){
  const src=fs.readFileSync(f,'utf8')
  const re=/(?:export\s+)?const\s+(\w+)\s*=\s*styled(?:\.(\w+)|\(([\w.]+)\))(?:\.attrs\([^)]*\))?(?:<[^`]*?>)?\s*`([\s\S]*?)`/g
  let m
  while((m=re.exec(src))){
    const decls=new Set(m[4].replace(/\/\*[\s\S]*?\*\//g,'').split(/[;{}]/).map(s=>s.replace(/\s+/g,' ').trim()).filter(s=>/^[a-z-]+:/.test(s)))
    if(decls.size>=5) blocks.push({file:path.relative(root,f),name:m[1],tag:m[2]||m[3],decls})
  }
}
const out=[]
for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++){
  const a=blocks[i],b=blocks[j]; if(a.file===b.file)continue
  const inter=[...a.decls].filter(x=>b.decls.has(x)).length
  const uni=new Set([...a.decls,...b.decls]).size
  const s=inter/uni
  if(s>=0.6&&inter>=5)out.push({s,inter,a:`${a.file}#${a.name}`,b:`${b.file}#${b.name}`})
}
out.sort((x,y)=>y.s-x.s)
console.log('styled blocks (>=5 decls):',blocks.length,'| similar cross-file pairs:',out.length)
out.slice(0,Number(process.argv[3]||40)).forEach(o=>console.log(o.s.toFixed(2),String(o.inter).padStart(2),o.a,'  ~  ',o.b))
