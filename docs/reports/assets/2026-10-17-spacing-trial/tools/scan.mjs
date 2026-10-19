import fs from 'node:fs'
import path from 'node:path'
const root = '/home/homebodify/Projects/ingradient-ui'
const scale = { '0':0,'1px':1,'2px':2,'3px':3,'neg-1px':-1,'neg-2px':-2,'1':4,'1-plus':5,'2':6,'2-plus':7,'3':8,'4':10,'5':12,'6':14,'7':16,'8':18,'9':20,'10':22,'11':24,'12':28,'13':32 }
const idxToVar = {0:'0',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'10',11:'11',12:'12',13:'13'}
const roots = ['src/components','src/patterns','src/primitives','packages/platform-pages/src','packages/edge-pages/src']
const skip = [/\.stories\.(ts|tsx)$/, /\.test\.(ts|tsx)$/, /__fixtures__/, /__mocks__/]
const files = []
const walk = d => { for (const e of fs.readdirSync(d,{withFileTypes:true})) { const p = path.join(d,e.name); if (e.isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(e.name) && !skip.some(r=>r.test(p))) files.push(p) } }
for (const r of roots) walk(path.join(root,r))
const PROP = '(margin|padding|gap|row-gap|column-gap|rowGap|columnGap|margin(?:Top|Right|Bottom|Left|Inline|Block)|padding(?:Top|Right|Bottom|Left|Inline|Block)|margin-(?:top|right|bottom|left|inline|block)|padding-(?:top|right|bottom|left|inline|block))'
const cssRe = new RegExp(`(?:^|[\\s{;])${PROP}\\s*:\\s*([^;\\n}]+)`,'g')
const jsxRe = /\b(gap|padding|\$gap|\$padding)=\{(\d+)\}/g
const out = []
for (const f of files) {
  const rel = path.relative(root,f)
  const lines = fs.readFileSync(f,'utf8').split('\n')
  lines.forEach((line,i)=>{
    const t = line.trim(); if (t.startsWith('//')||t.startsWith('*')||t.startsWith('/*')) return
    let m; cssRe.lastIndex=0
    while ((m = cssRe.exec(line))) {
      let v = m[2].trim().replace(/[,'"`]+$/,'').replace(/^['"`]/,'')
      const prop = m[1]
      // collect parts
      const vNoVar = v.replace(/var\([^)]*\)/g,' ')
      const px = [...vNoVar.matchAll(/(-?\d*\.?\d+)px/g)].map(x=>({kind:'raw',px:+x[1]}))
      const toks = [...v.matchAll(/var\(--ig-space-([a-z0-9-]+)\)/g)].map(x=>({kind:'token',name:x[1],px:scale[x[1]]}))
      const bareNum = /^-?\d+(\.\d+)?$/.test(v) ? [{kind:'raw-number',px:+v}] : []
      const other = /var\(--(?!ig-space)/.test(v) || /calc\(/.test(v)
      for (const p of [...px,...toks,...bareNum]) out.push({file:rel,line:i+1,prop,value:v,...p,other})
    }
    let j; jsxRe.lastIndex=0
    while ((j = jsxRe.exec(line))) out.push({file:rel,line:i+1,prop:j[1],value:j[2],kind:'jsx-index',idx:+j[2],px:scale[idxToVar[+j[2]]]})
  })
}
fs.writeFileSync('/tmp/spacing-audit/findings.json',JSON.stringify(out))
const on4 = n => n!==undefined && Math.abs(n)%4===0
const sum = {}
for (const o of out) { const k = o.kind+'|'+(o.px===0?'zero':on4(o.px)?'on4':'off4'); sum[k]=(sum[k]||0)+1 }
console.log('files scanned',files.length,'declarations',out.length); console.log(sum)
const hist = {}; for (const o of out.filter(o=>o.kind==='raw'||o.kind==='raw-number')) hist[o.px]=(hist[o.px]||0)+1
console.log('raw px hist',Object.entries(hist).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+'px×'+v).join(' '))
const th = {}; for (const o of out.filter(o=>o.kind==='token')) th[o.name+'='+o.px]=(th[o.name+'='+o.px]||0)+1
console.log('token hist',Object.entries(th).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+'px×'+v).join(' '))
