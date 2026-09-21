// Read-only audit evidence validation; writes only this report's asset summary.
const fs=require('node:fs');const path=require('node:path');const cp=require('node:child_process');
const root=path.resolve(__dirname,'../../../..');
const report=path.join(root,'docs/reports/2026-09-20-edge-layer-audit-and-plan.ko.md');
const a=JSON.parse(fs.readFileSync(path.join(__dirname,'supplemental-browser.json'),'utf8'));
const b=JSON.parse(fs.readFileSync(path.join(__dirname,'supplemental-followup.json'),'utf8'));
const scans=[...a.routes,...a.tabs].filter(x=>x.axe).map(x=>({state:x.id||x.name,...x.axe}));
scans.push({state:'settings retry',...b.probes.find(x=>x.name==='settings-axe-retry').axe});
const markdown=fs.readFileSync(report,'utf8');
const links=[...markdown.matchAll(/\]\(([^)]+)\)/g)].map(x=>x[1]).filter(x=>!/^https?:|^#/.test(x));
const broken=links.filter(x=>!fs.existsSync(path.resolve(path.dirname(report),decodeURIComponent(x.split('#')[0]))));
const sourcePaths=['src','packages','stories','.storybook','scripts','tests','apps','.github','package.json','package-lock.json','eslint.config.js','.stylelintrc.json','vitest.config.ts','playwright.storybook.config.ts'];
const run=args=>{const p=cp.spawnSync('git',args,{cwd:root,encoding:'utf8'});return {command:'git '+args.join(' '),exit:p.status,stdout:p.stdout,stderr:p.stderr};};
const result={head:run(['rev-parse','HEAD']),branch:run(['branch','--show-current']),sourceUnchanged:run(['diff','--exit-code','HEAD','--',...sourcePaths]),diffCheck:run(['diff','--check']),trackedChanges:run(['diff','--name-only']),status:run(['status','--short']),links:{checked:links.length,broken},reportWhitespace:{trailingWhitespaceLines:markdown.split('\n').flatMap((l,i)=>/[\t ]+$/.test(l)?[i+1]:[])},coverage:{storyIds:a.ids.length,routeRecords:a.routes.length,routeErrors:a.routes.filter(x=>x.error).map(x=>({id:x.id,width:x.width,error:x.error})),tabRecords:a.tabs.length,tabErrors:a.tabs.filter(x=>x.error),axeScans:scans.length,axeViolatingScans:scans.filter(x=>x.violations.length).length,axeZeroViolationScans:scans.filter(x=>!x.violations.length).length,rules:[...new Set(scans.flatMap(x=>x.violations.map(v=>v.id)))],pageErrors:[...a.routes,...a.tabs].flatMap(x=>x.errors||[]),initialProbeErrors:a.probes.filter(x=>x.error).map(x=>x.name),followupProbeErrors:b.probes.filter(x=>x.error).map(x=>x.name)}};
fs.writeFileSync(path.join(__dirname,'supplemental-validation.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
if(broken.length||result.sourceUnchanged.exit||result.diffCheck.exit||result.reportWhitespace.trailingWhitespaceLines.length)process.exitCode=1;
