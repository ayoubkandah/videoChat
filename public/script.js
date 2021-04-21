const socket = io('https://videochat-ak.herokuapp.com/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
port: '443',
secure: true,
// proxied: true
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)
//---
faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
//--
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  const video = document.getElementById('video1')
  console.log(video)
//---------------------------------------------------------
video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  // document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  // faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    // const resizedDetections = faceapi.resizeResults(detections, displaySize)
    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  
 // faceapi.faceExpressionLabels
 // console.log(detections[0].expressions.happy>0.03);
 // console.log(detections);
 // console.log(canvas);
 //  console.log(resizedDetections)
 //  console.log(faceapi.nets)
 //  console.log(faceapi,"//////////")
 //  console.log(faceapi.draw.drawFaceExpressions)
if(detections.length>0){
   if(detections[0].expressions.happy>0.75){
    //  console.log(detections[0].expressions)
    let h3 = document.createElement('h1')
h3.textContent="loseeeeeeeeeeeeeee"
    videoGrid.append(h3)
    // console.log("Happy");
   }
  }else if(detections.length<=0){
    // console.log("look to the camera");
  }
  // console.log(detections)
  //  if(faceapi.FACE_EXPRESSION_LABELS=="happy"){
  //    console.log("happy")
  //  }
}, 100)
})
//-----------------------------------------------------------------------

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}
let count=0;
function addVideoStream(video, stream) {
  count++
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  video.setAttribute("id", `video${count}`);
    videoGrid.append(video)
}

console.log("eee")