/** H-Beauty v20.4 research ONNX 19-class face parser (yakhyo/face-parsing).
 * SHA-pinned official ResNet18 (MIT release); trained on CelebAMask-HQ.
 * Dataset commercial permissions not yet cleared: NO-GO commercial release.
 * ONNX Runtime Web 'wasm' execution, locally cached assets, no WebGL or
 * photographic uploads.
 */
export const FACEPARSE_SHA256='0d9bd318e46987c3bdbfacae9e2c0f461cae1c6ac6ea6d43bbe541a91727e33f';
const hashHex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
export async function parseFacePartsCPU(ort,modelBytes,imageData){
 if(!ort?.Tensor||!ort?.InferenceSession?.create||
    !(modelBytes instanceof Uint8Array)||modelBytes.byteLength!==53205364||
    !globalThis.crypto?.subtle)
    throw Error('Local 19-class ONNX parser or secure origin unavailable');
 const sha=hashHex(await crypto.subtle.digest('SHA-256',modelBytes));
 if(sha!==FACEPARSE_SHA256)throw Error('Face-parsing model SHA256 mismatch');
 if(!(imageData?.data instanceof Uint8ClampedArray)||
    !Number.isInteger(imageData.width)||!Number.isInteger(imageData.height)||
    imageData.width<64||imageData.height<64||
    imageData.data.length!==imageData.width*imageData.height*4)
    throw Error('Invalid selfie RGBA dimensions');
 const canvas=document.createElement('canvas');
 canvas.width=imageData.width;canvas.height=imageData.height;
 canvas.getContext('2d',{willReadFrequently:true}).putImageData(imageData,0,0);
 const crop=document.createElement('canvas');crop.width=512;crop.height=512;
 const ctx=crop.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(canvas,0,0,512,512);
 const pixels=ctx.getImageData(0,0,512,512).data;
 const total=512*512,normalized=new Float32Array(3*total);
 const means=[.485,.456,.406],stds=[.229,.224,.225];
 for(let i=0;i<total;i++)for(let c=0;c<3;c++)
  normalized[c*total+i]=(pixels[4*i+c]/255-means[c])/stds[c];
 const session=await ort.InferenceSession.create(modelBytes,{executionProviders:['wasm']});
 try{
  if(!session.inputNames?.includes('input')||!session.outputNames?.includes('output'))
    throw Error('Unexpected semantic model IO');
  const outputs=await session.run({input:new ort.Tensor('float32',normalized,[1,3,512,512])});
  const raw=outputs.output?.data,dims=outputs.output?.dims;
  if(!(raw instanceof Float32Array)||dims?.join(',')!=='1,19,512,512'||
     raw.length!==19*total)
    throw Error('Expected [1,19,512,512] semantic logits');
  const labels=new Uint8Array(total);
  for(let i=0;i<total;i++){
   let best=-Infinity,label=-1;
   for(let c=0;c<19;c++){
    const value=raw[c*total+i];
    if(!Number.isFinite(value))throw Error('Nonfinite semantic logits');
    if(value>best){best=value;label=c}
   }
   labels[i]=label;
  }
  return {width:512,height:512,labels,source:'onnx-wasm-19-class'};
 }finally{await session.release?.()}
}