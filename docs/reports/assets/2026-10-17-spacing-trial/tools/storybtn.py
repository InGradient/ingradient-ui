import re,sys,os,glob
root=sys.argv[1]
# stories/ and *.stories.* files that render a raw <Button>/<IconButton> whose label/aria text duplicates a control name the product code already provides.
prod_labels={}
for base in ['src','packages']:
    for dp,_,fs in os.walk(os.path.join(root,base)):
        if 'node_modules' in dp or '/lib' in dp: continue
        for f in fs:
            if not f.endswith(('.ts','.tsx')) or '.stories.' in f or '.test.' in f: continue
            p=os.path.join(dp,f); s=open(p,errors='ignore').read()
            for m in re.finditer(r"aria-label=\{?['\"`]([^'\"`{}$]{3,50})['\"`]",s): prod_labels.setdefault(m.group(1).strip().lower(),set()).add(os.path.relpath(p,root))
            for m in re.finditer(r"(?:collapsePanel|expand|collapse)\w*\s*[:=]\s*['\"]([^'\"]{3,50})['\"]",s): prod_labels.setdefault(m.group(1).strip().lower(),set()).add(os.path.relpath(p,root))
hits=[]
files=glob.glob(os.path.join(root,'stories','**','*.tsx'),recursive=True)+glob.glob(os.path.join(root,'src','**','*.stories.tsx'),recursive=True)+glob.glob(os.path.join(root,'packages','**','*.stories.tsx'),recursive=True)
for p in files:
    if 'node_modules' in p: continue
    s=open(p,errors='ignore').read()
    for m in re.finditer(r"<(Button|IconButton)\b[^>]*>([^<{]{3,60})</\1>",s):
        txt=m.group(2).strip()
        if re.search(r"collapse|expand|close|toggle|hide|show",txt,re.I): hits.append((os.path.relpath(p,root),s[:m.start()].count('\n')+1,m.group(1),txt))
print('story files scanned:',len(files),'| story-made Buttons with a collapse/expand/close/toggle verb:',len(hits))
for h in hits: print(' ',h[0]+':'+str(h[1]),h[2],'"'+h[3]+'"')
