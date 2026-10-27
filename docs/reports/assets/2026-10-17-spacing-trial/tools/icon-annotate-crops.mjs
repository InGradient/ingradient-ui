import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
const sh=(a)=>execFileSync('magick',a,{stdio:['ignore','pipe','pipe']})
// crops chosen where icons change: [name, source, x, y, w, h, scale, note]
const C=[
 {k:'class',  n:'class-list',   x:0,   y:96,  w:320, h:180, label:'Class Management — 왼쪽 목록(이름·개수·⋮ 메뉴)'},
 {k:'catalog',n:'catalog-top',  x:320, y:90,  w:800, h:130, label:'Dataset Catalog — 상단 도구 막대'},
 {k:'edge',   n:'edge-header',  x:0,   y:0,   w:1440,h:100, label:'Edge Capture — 상단 막대와 로그 헤더'},
 {k:'edge',   n:'edge-right',   x:1146,y:96,  w:294, h:120, label:'Edge Capture — 우측 패널 헤더'},
]
const S=3
const spec=JSON.parse(fs.readFileSync('ann-spec.json','utf8'))
const out=[]
for(const c of C){
 const inb=spec[c.k].boxes.filter(b=>b.x>=c.x&&b.x<c.x+c.w&&b.y>=c.y&&b.y<c.y+c.h)
 const nums=[...new Set(inb.map(b=>b.n))]
 for(const v of ['base','down','up']){
  const col=v==='base'?'#f28c28':'#14b8a6'
  const args=[`${c.k}-${v}.png`,'-crop',`${c.w}x${c.h}+${c.x}+${c.y}`,'+repage','-filter','point','-resize',`${S*100}%`]
  inb.forEach(b=>{const x=(b.x-c.x)*S,y=(b.y-c.y)*S,w=b.w*S
   args.push('-fill','none','-stroke',col,'-strokewidth','3','-draw',`rectangle ${x-6},${y-6} ${x+w+6},${y+w+6}`)
   args.push('-stroke','none','-fill',col,'-draw',`rectangle ${x-4},${y-30} ${x+24},${y-8}`,'-fill','#0b0d12','-pointsize','18','-font','Liberation-Sans-Bold','-gravity','NorthWest','-annotate',`+${x}+${y-30}`,String(b.n))})
  args.push(`${c.n}-${v}.png`)
  sh(args)}
 // stack three rows with captions
 const cap=(t,f)=>['(', '-background','#12151c','-fill','#e7eaf0','-font','Noto-Sans-CJK-HK','-pointsize','20','label:'+t,')']
 const rows=[['base','현재 (주황)'],['down','내림 (청록)'],['up','올림 (청록)']]
 const args=[]
 rows.forEach(([v,t])=>{args.push('(',`${c.n}-${v}.png`,'-background','#12151c','-gravity','NorthWest','-splice','0x30','-fill','#e7eaf0','-font','/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc','-pointsize','20','-annotate','+8+4',t,')')})
 args.push('-append',`${c.n}-compare.png`)
 sh(args)
 out.push({file:`${c.n}-compare.png`,label:c.label,nums,scale:S,w:c.w*S})
}
fs.writeFileSync('crops.json',JSON.stringify(out,null,1));console.log(out.map(o=>o.file+' nums='+o.nums.join(',')).join('\n'))
