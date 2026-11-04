"""Real ONNX CPU face parsing evaluation. NOT a visual quality certification.

Model: yakhyo/face-parsing ResNet18 BiSeNet, MIT repo license.
Trained on CelebAMask-HQ: commercial dataset provenance must be separately
audited before shipping weights in a business product.

Only test images supplied by the H-Beauty repository are processed locally.
"""
from pathlib import Path
import argparse,hashlib,json,time
import cv2,numpy as np,onnxruntime as ort

CLASSES=["background","skin","left-brow","right-brow","left-eye","right-eye",
 "eyeglasses","left-ear","right-ear","earring","nose","mouth",
 "upper-lip","lower-lip","neck","necklace","cloth","hair","hat"]
MEAN=np.array([.485,.456,.406],dtype=np.float32)
STD=np.array([.229,.224,.225],dtype=np.float32)

def predict(model:Path,photo:Path,out:Path):
 im=cv2.imread(str(photo))
 if im is None:raise FileNotFoundError(photo)
 h,w=im.shape[:2]
 rgb=cv2.resize(cv2.cvtColor(im,cv2.COLOR_BGR2RGB),(512,512),interpolation=cv2.INTER_LINEAR)
 t=((rgb.astype(np.float32)/255-MEAN)/STD).transpose(2,0,1)[None].copy()
 ses=ort.InferenceSession(str(model),providers=["CPUExecutionProvider"])
 desc=[(v.name,v.shape) for v in ses.get_inputs()]
 assert len(desc)==1,(desc)
 start=time.perf_counter();logits=ses.run(None,{ses.get_inputs()[0].name:t})[0]
 elapsed=1000*(time.perf_counter()-start)
 assert logits.shape==(1,19,512,512),f"Unexpected 19-class output {logits.shape}"
 assert np.isfinite(logits).all()
 labels=np.argmax(logits[0],axis=0).astype(np.uint8)
 # nearest-neighbor preserves class IDs, never blends semantic labels
 classes=cv2.resize(labels,(w,h),interpolation=cv2.INTER_NEAREST)
 counts={name:int((classes==i).sum()) for i,name in enumerate(CLASSES)}
 assert counts["skin"]>500,counts
 assert counts["background"]+counts["hair"]>500,counts
 out.mkdir(parents=True,exist_ok=True)
 cv2.imwrite(str(out/"face_parsing_labels.png"),classes)
 palette=np.array([[0,0,0],[210,180,120],[83,192,244],[83,192,244],
  [255,160,0],[255,160,0],[30,30,230],[80,180,40],[80,180,40],
  [255,180,0],[185,125,195],[0,0,255],[200,80,200],[200,80,200],
  [84,50,100],[48,48,120],[40,140,200],[90,110,35],[18,18,140]],dtype=np.uint8)
 rgba=cv2.addWeighted(im,.55,palette[classes],.45,0)
 cv2.imwrite(str(out/"face_parsing_overlay.png"),rgba)
 report={"model_sha256":hashlib.sha256(model.read_bytes()).hexdigest(),
  "source_image":photo.name,"original_size":[w,h],"onnx_input":desc,
  "onnx_output":list(logits.shape),"classes":counts,
  "cpu_inference_ms_excluding_loading":round(elapsed,3),"semantic_categories":CLASSES}
 (out/"face_parsing_report.json").write_text(json.dumps(report,indent=2))
 print(json.dumps(report),flush=True)
 return report

if __name__=="__main__":
 p=argparse.ArgumentParser()
 p.add_argument("--model",type=Path,required=True)
 p.add_argument("--image",type=Path,required=True)
 p.add_argument("--output",type=Path,required=True)
 x=p.parse_args()
 predict(x.model,x.image,x.output)
