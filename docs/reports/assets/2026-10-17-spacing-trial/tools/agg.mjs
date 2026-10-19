import fs from 'node:fs'
const f = JSON.parse(fs.readFileSync('findings.json','utf8'))
const cls = o => { const p=Math.abs(o.px); if (o.kind==='jsx-index') return 'jsx-rawpx'; if (p===0) return 'zero'; if (p<=3) return 'hairline'; return p%4===0 ? 'on4':'off4' }
const area = file => file.startsWith('src/primitives')?'primitives':file.startsWith('src/components')?'components':file.startsWith('src/patterns')?'patterns':file.startsWith('packages/platform')?'platform-pages':'edge-pages'
const t = {}; for (const o of f) { const k=area(o.file); t[k]??={total:0,on4:0,hairline:0,off4:0,zero:0,jsx:0}; t[k].total++; const c=cls(o); if(c==='jsx-rawpx'){ t[k].jsx++; } else t[k][c]++ }
console.table(t)
const jsx=f.filter(o=>o.kind==='jsx-index'); const jh={}; jsx.forEach(o=>jh[o.idx]=(jh[o.idx]||0)+1); console.log('JSX numeric gap/padding (raw px!)',jh)
console.log('JSX 1-3px:',jsx.filter(o=>o.idx>=1&&o.idx<=3).length,'of',jsx.length)
const off=f.filter(o=>cls(o)==='off4'); const byFile={}; off.forEach(o=>byFile[o.file]=(byFile[o.file]||0)+1)
console.log('top off-grid files'); console.log(Object.entries(byFile).sort((a,b)=>b[1]-a[1]).slice(0,25).map(([k,v])=>v+'  '+k).join('\n'))
console.log('files with any off-grid:',Object.keys(byFile).length)
const raw=f.filter(o=>o.kind.startsWith('raw')&&o.px!==0); console.log('raw non-zero px:',raw.length); raw.slice(0,60).forEach(o=>console.log(o.file+':'+o.line, o.prop, o.value))
