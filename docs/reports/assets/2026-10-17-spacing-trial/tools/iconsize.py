import re,os,collections
sizes={'sub':8,'2xs':11,'xs':12,'xsPlus':13,'sm':14,'smPlus':15,'md':16,'lg':18,'xl':20,'2xl':22,'3xl':24}
by=collections.defaultdict(lambda:collections.Counter())
ctx=collections.defaultdict(lambda:collections.Counter())
for base in ['src','packages']:
    for dp,_,fs in os.walk(base):
        if 'node_modules' in dp or '/lib' in dp: continue
        for f in fs:
            if not f.endswith('.tsx') or '.stories.' in f or '.test.' in f: continue
            p=os.path.join(dp,f); s=open(p,errors='ignore').read()
            for m in re.finditer(r"<(\w+Icon|ChevronDown|ChevronRight|X|Search)\b[^>]*size=\{iconSizeNumbers\.(\w+)\}",s):
                name=m.group(1); sz=m.group(2)
                by[name][sz]+=1
                # parent control kind: look back for IconButton/Button within 200 chars
                back=s[max(0,m.start()-220):m.start()]
                kind='IconButton' if '<IconButton' in back else 'Button' if '<Button' in back else 'MenuIconButton' if 'MenuIconButton' in back else 'other'
                ctx[kind][sz]+=1
print('icons used with 2+ different sizes (same glyph, different size):')
n=0
for name,c in sorted(by.items(),key=lambda x:-sum(x[1].values())):
    if len(c)>=2 and sum(c.values())>=3:
        n+=1; print(' ',name.ljust(22),', '.join(f'{k}={sizes.get(k,"?")}px×{v}' for k,v in c.most_common()))
print('count',n)
print('\nicon size inside each control kind:')
for k,c in ctx.items(): print(' ',k.ljust(15),', '.join(f'{sizes.get(s,"?")}px×{v}' for s,v in c.most_common()))
