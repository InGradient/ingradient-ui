from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
p=Path(__file__).parent;b=p.parent/'2026-09-20-edge-phase0'
names=[('settings-menu','edge-settings-menu'),('general','settings-general'),('datasets','datasets-offline'),('images','images-mock'),('capture','capture'),('capture-768','supplemental-clean-capture-768'),('setup','setup'),('server','settings-server'),('logs','settings-logs'),('lighting-ps','settings-lighting')]
out=Image.new('RGB',(1000,400*len(names)), '#ffffff');d=ImageDraw.Draw(out)
for i,(new,old) in enumerate(names):
 for j,f in enumerate([b/(old+'.png'),p/(new+'.png')]):
  im=Image.open(f);im.thumbnail((495,360));out.paste(im,(j*500,i*400+30));d.text((j*500+5,i*400+5),str(f.name),fill='black')
out.save(p/'inspection-contact.png')
