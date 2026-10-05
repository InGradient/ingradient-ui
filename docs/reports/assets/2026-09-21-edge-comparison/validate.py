from pathlib import Path
import re,json,hashlib
P=Path(__file__).parent;report=P.parent.parent/'2026-09-21-edge-as-is-to-be.ko.md'
text=report.read_text();links=re.findall(r'\]\(([^)]+)\)',text);local=[x.split('#')[0] for x in links if not x.startswith(('http:','https:','#'))];missing=[x for x in local if not (report.parent/x).exists()]
m=json.loads((P/'comparison-manifest.json').read_text());bad=[i['file'] for i in m['images'] if hashlib.sha256((P/i['file']).read_bytes()).hexdigest()!=i['sha256']]
result={'reportLocalLinks':len(local),'missingLinks':missing,'imageHashesChecked':len(m['images']),'hashMismatches':bad,'pairs':len(m['pairs']),'freshOriginals':m['freshScreenshotCount'],'additionalInteractionProofs':m['interactionResultCount'],'inspection':'Read image tool: raw/contact screenshots, full-resolution comparison panels and functional-result annotations inspected; no automated visual-regression assertion'}
(P/'validation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(result)
assert not missing and not bad
