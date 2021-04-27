const video = document.getElementById('video')
let x;
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { audio: true, video: true },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  
 // faceapi.faceExpressionLabels
 // console.log(detections[0].expressions.happy>0.03);
 // console.log(detections);
 // console.log(canvas);
 //  console.log(resizedDetections)
 //  console.log(faceapi.nets)
 //  console.log(faceapi,"//////////")
 //  console.log(faceapi.draw.drawFaceExpressions)
if(detections.length>0){
   if(detections[0].expressions.happy>0.05){
     
    console.log("Happy");
   }
  }
  //  if(faceapi.FACE_EXPRESSION_LABELS=="happy"){
  //    console.log("happy")
  //  }
}, 100)
})
// console.log(faceapi.nets.faceExpressionNet)
// console.log(faceapi.nets.faceExpressionNet)

