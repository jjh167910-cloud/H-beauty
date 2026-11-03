"""Research: verified CPU-only YuNet->478-point face mesh, no WebGL.

Runs with numpy, opencv-python-headless, onnxruntime; no cloud uploads.
Model conversion by senty-au from Google's Apache-2.0 FaceLandmarker.
This is a reference pipeline for parity checks, not approved production inference.
"""
from __future__ import annotations
import argparse, hashlib, json, math, time
from pathlib import Path
import cv2
import numpy as np
import onnxruntime as ort

YUNET_SHA256="ebafce4e3c118d6554634be5c27ab333b4c047a9a8c3faf1d7cf93101c22f0f0"
MESH_SHA256="7d6e82dee82a1dca5fbddb282b3cc74571833a530de317fc22ae325c3358beeb"
STRIDES=(8,16,32)

def verify(path:Path,expected:str):
    assert hashlib.sha256(path.read_bytes()).hexdigest()==expected, f"Model integrity mismatch {path}"

def input_letterbox(bgr,max_side=320):
    h,w=bgr.shape[:2]
    scale=min(max_side/w,max_side/h)
    nw,nh=round(w*scale),round(h*scale)
    assert nw>0 and nh>0
    x=(max_side-nw)//2;y=(max_side-nh)//2
    canvas=np.zeros((max_side,max_side,3),dtype=np.uint8)
    canvas[y:y+nh,x:x+nw]=cv2.resize(bgr,(nw,nh),interpolation=cv2.INTER_LINEAR)
    return canvas,{"x":x,"y":y,"scale":scale}

def decode_yunet(raw,width,height,threshold=.45):
    candidates=[]
    for s in STRIDES:
        cols=width//s;rows=height//s;n=cols*rows
        cls=raw["cls_"+str(s)].reshape(n)
        obj=raw["obj_"+str(s)].reshape(n)
        box=raw["bbox_"+str(s)].reshape(n,4)
        kps=raw["kps_"+str(s)].reshape(n,10)
        scores=np.sqrt(np.clip(cls,0,1)*np.clip(obj,0,1))
        for i in np.flatnonzero(scores>=threshold):
            dx,dy,dw,dh=box[i]
            if not np.all(np.isfinite(box[i])):continue
            col=i%cols;row=i//cols
            cx=(col+dx)*s;cy=(row+dy)*s
            bw=np.exp(np.clip(dw,-9,9))*s;bh=np.exp(np.clip(dh,-9,9))*s
            if bw<12 or bh<12 or bw>width*3 or bh>height*3:continue
            lm=np.array([[(col+kps[i,2*j])*s,(row+kps[i,2*j+1])*s] for j in range(5)])
            if not np.all(np.isfinite(lm)):continue
            candidates.append({"box":np.array([cx-bw/2,cy-bh/2,bw,bh]),"kps":lm,
                               "score":float(scores[i])})
    candidates.sort(key=lambda f:-f["score"])
    def iou(a,b):
        ax,ay,aw,ah=a;bx,by,bw,bh=b
        ix=max(0,min(ax+aw,bx+bw)-max(ax,bx));iy=max(0,min(ay+ah,by+bh)-max(ay,by))
        return ix*iy/max(1e-9,aw*ah+bw*bh-ix*iy)
    faces=[]
    for f in candidates:
        if any(iou(f["box"],g["box"])>.3 for g in faces):continue
        faces.append(f)
        if len(faces)>=10:break
    return faces

def map_letterbox_faces(faces,lb):
    for f in faces:
        f["box"][0:2]=(f["box"][0:2]-[lb["x"],lb["y"]])/lb["scale"]
        f["box"][2:4]/=lb["scale"]
        f["kps"]=(f["kps"]-[lb["x"],lb["y"]])/lb["scale"]
    return faces

def roi_matrix(face,side=256,margin=.25):
    x,y,w,h=map(float,face["box"])
    eye_a,eye_b=face["kps"][:2].astype(float)
    # YuNet's pair is eye centers; determine image-left and image-right.
    left,right=sorted([eye_a,eye_b],key=lambda p:p[0])
    angle=math.degrees(math.atan2(float(right[1]-left[1]),float(right[0]-left[0])))
    cx=x+w/2;cy=y+h/2
    size=max(w,h)*(1+2*margin)
    if not math.isfinite(size) or size<20:raise ValueError("Invalid crop size")
    affine=cv2.getRotationMatrix2D((cx,cy),angle,side/size)
    affine[0,2]+=side/2-cx;affine[1,2]+=side/2-cy
    return affine

def mesh_points(bgr,face,session):
    affine=roi_matrix(face)
    crop=cv2.warpAffine(bgr,affine,(256,256),flags=cv2.INTER_LINEAR,
                        borderMode=cv2.BORDER_CONSTANT)
    rgb=cv2.cvtColor(crop,cv2.COLOR_BGR2RGB)
    spec=session.get_inputs()[0]
    input_name=spec.name
    shape=spec.shape
    print("CPU 478 landmark input contract",input_name,shape,flush=True)
    t=rgb.astype(np.float32)[None]/255
    if len(shape)!=4:raise ValueError(f"Unexpected mesh input rank: {shape}")
    if shape[-3:]==[3,256,256]:
        t=t.transpose(0,3,1,2).copy()
    elif shape[-3:]==[256,256,3]:
        pass
    else:
        raise ValueError(f"Unexpected mesh input layout: {shape}")
    raw=session.run(None,{input_name:t})
    pts=np.asarray(raw[0],dtype=np.float32).reshape(478,3)
    logit=float(np.asarray(raw[1]).reshape(-1)[0])
    confidence=1/(1+math.exp(-max(-80,min(80,logit))))
    inv=cv2.invertAffineTransform(affine)
    pixels=pts[:,:2]@inv[:,:2].T+inv[:,2]
    # z remains crop-relative, not a physical distance.
    return pixels,confidence,{"affine":affine.tolist(),"crop_box_size_px":float(256/math.hypot(affine[0,0],affine[0,1]))}

def validate_landmarks(points,score,width,height):
    if points.shape!=(478,2) or not np.isfinite(points).all():return False,"invalid-output"
    if score<.5:return False,"weak-presence"
    forehead,chin=points[10],points[152]
    eye_mid=(points[33]+points[263])/2
    nose=points[1];lip=(points[13]+points[14])/2
    eye_span=np.linalg.norm(points[33]-points[263])
    face_height=np.linalg.norm(forehead-chin)
    if not (width*.07<eye_span<width*.9 and height*.12<face_height<height*1.15):
        return False,"invalid-face-size"
    if not (forehead[1]<eye_mid[1]<nose[1]<lip[1]<chin[1]):
        return False,"inconsistent-topology"
    if np.any(points[:,0]<-width*.2) or np.any(points[:,0]>width*1.2):
        return False,"off-frame"
    return True,"geometry-valid"

def run(yunet_path,mesh_path,image_path,outdir):
    verify(yunet_path,YUNET_SHA256);verify(mesh_path,MESH_SHA256)
    original=cv2.imread(str(image_path),cv2.IMREAD_COLOR)
    if original is None:raise ValueError("Cannot read test photo")
    h,w=original.shape[:2]
    det_sess=ort.InferenceSession(str(yunet_path),providers=["CPUExecutionProvider"])
    mesh_sess=ort.InferenceSession(str(mesh_path),providers=["CPUExecutionProvider"])
    letter,lb=input_letterbox(original)
    tensor=letter[:,:,::-1].transpose(2,0,1)[None].copy().astype(np.float32)
    # Official YuNet model input expects BGR, not RGB.
    tensor=letter.transpose(2,0,1)[None].copy().astype(np.float32)
    t0=time.perf_counter()
    raw=dict(zip([o.name for o in det_sess.get_outputs()],
                 det_sess.run(None,{det_sess.get_inputs()[0].name:tensor})))
    faces=map_letterbox_faces(decode_yunet(raw,320,320),lb)
    t1=time.perf_counter()
    outcomes=[]
    for face in faces:
        pts,score,crop=mesh_points(original,face,mesh_sess)
        ok,reason=validate_landmarks(pts,score,w,h)
        outcomes.append({"face_box":face["box"].round(3).tolist(),
            "detector_score":face["score"],"mesh_score":score,
            "geometry_ok":ok,"geometry_reason":reason,
            "landmarks":pts.round(3).tolist(),"crop":crop})
    t2=time.perf_counter()
    outdir.mkdir(parents=True,exist_ok=True)
    report={"image_name":image_path.name,"source_size":[w,h],
      "faces":len(faces),"results":outcomes,"detector_ms":(t1-t0)*1000,
      "mesh_ms":(t2-t1)*1000,"webgl":False,
      "model_hashes":{"yuNet":YUNET_SHA256,"mesh478":MESH_SHA256}}
    (outdir/"cpu478_results.json").write_text(json.dumps(report,indent=2))
    visible=original.copy()
    colors=[(44,199,39),(255,176,0),(0,0,255)]
    for f in outcomes:
        pts=np.array(f["landmarks"])
        for k in [1,4,10,13,14,33,263,152,234,454,468,473]:
            x,y=map(int,np.round(pts[k]))
            if -2<=x<w+2 and -2<=y<h+2:
                cv2.circle(visible,(x,y),2,colors[0] if f["geometry_ok"] else colors[2],-1)
        x,y,bw,bh=map(int,np.round(f["face_box"]))
        cv2.rectangle(visible,(x,y),(x+bw,y+bh),colors[0] if f["geometry_ok"] else colors[2],1)
    cv2.imwrite(str(outdir/"cpu478_landmarks_preview.png"),visible)
    print(json.dumps({"faces":len(faces),"source_size":[w,h],
      "valid":sum(int(x["geometry_ok"]) for x in outcomes),
      "mesh_presence":[round(x["mesh_score"],6) for x in outcomes],
      "detector_ms":round(report["detector_ms"],2),
      "mesh_ms":round(report["mesh_ms"],2),
      "reasons":[x["geometry_reason"] for x in outcomes]}),flush=True)
    if len(faces)!=1 or not outcomes[0]["geometry_ok"]:
        raise RuntimeError("Full CPU 478 landmark gate did not pass - do not activate browser fallback")

if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--yunet",required=True,type=Path)
    ap.add_argument("--mesh",required=True,type=Path)
    ap.add_argument("--image",required=True,type=Path)
    ap.add_argument("--out",required=True,type=Path)
    a=ap.parse_args()
    run(a.yunet,a.mesh,a.image,a.out)
