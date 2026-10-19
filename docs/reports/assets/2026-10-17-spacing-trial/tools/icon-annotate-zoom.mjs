import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
const sh=(a)=>execFileSync('magick',a,{stdio:['ignore','pipe','pipe']})
const FONT='/usr/share/fonts/noto-cjk/NotoSansCJK-Medium.ttc'
const spec=JSON.parse(fs.readFileSync('ann-spec.json','utf8'))
const meta=JSON.parse(fs.readFileSync('meta.json','utf8'))
// pick one representative icon per size-change cluster from real measured rects, zoom 10x, three builds side by side.
const picks=JSON.parse(fs.readFileSync('picks.json','utf8'))
const Z=10, BOX=34
const cells=[];const rows=[]
for(const p of picks){
 const a=meta[p.k].base.a; const i=p.idx??p.find(a); if(i<0){console.log('no icon for',p.title);continue}
 const row=[]
 for(const v of ['base','down','up']){
  const s=meta[p.k][v].a[i]; const cx=s.x+s.w/2, cy=s.y+s.w/2
  const x=Math.round(cx-BOX/2), y=Math.round(cy-BOX/2)
  const col=v==='base'?'#f28c28':'#14b8a6'
  const label=v==='base'?'현재':v==='down'?'내림':'올림'
  const f=`cell-${rows.length}-${v}.png`
  sh([`${p.k}-${v}.png`,'-crop',`${BOX}x${BOX}+${Math.max(0,x)}+${Math.max(0,y)}`,'+repage','-filter','point','-resize',`${Z*100}%`,
   '-bordercolor',col,'-border','3',
   '-background','#12151c','-gravity','North','-splice','0x34','-font',FONT,'-fill','#e7eaf0','-pointsize','22','-annotate','+0+4',`${label} · ${Math.round(s.w)}px`,f])
  row.push(f)}
 sh([...row,'+append','-background','#12151c','-gravity','West','-splice','0x0',`row-${rows.length}.png`])
 sh([`row-${rows.length}.png`,'-background','#12151c','-gravity','NorthWest','-splice','0x44','-font',FONT,'-fill','#e7eaf0','-pointsize','24','-annotate','+10+8',`${rows.length+1}) ${p.title}   ${p.note}`,`row-${rows.length}.png`])
 rows.push({file:`row-${rows.length}.png`,title:p.title,note:p.note})
}
sh([...rows.map(r=>r.file),'-append','-background','#12151c','icon-zoom-compare.png'])
fs.writeFileSync('zoom-rows.json',JSON.stringify(rows))
console.log(rows.length,'rows');
