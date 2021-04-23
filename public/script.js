
'use strict'

const socket = io('https://videochat-ak.herokuapp.com/')
// const options = {
//   transports: ['websocket'],
// };
// const socket = io('localhost:3000/', options); // emmit connection event to server
let video2 = document.getElementById("video2")
let video1 = document.getElementById("video1")
const videoGrid = document.getElementById('video-grid')

const myPeer = new Peer()
const myVideo = document.getElementById('video1')
myVideo.muted = true
const peers = {}
let player = 1
let userID;
let roomP;
let yourPoints=0;
let oppPoints=0;
$("#start").hide()
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
    const video = document.getElementById('video2')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  const video = document.getElementById('video1')
  console.log(video)
  //---------------------------------------------------------
  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    const displaySize = { width: video.width, height: video.height }
    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
      if (detections.length > 0) {
        if (detections[0].expressions.happy > 0.75) {
        }
      } else if (detections.length <= 0) {
      }
    }, 100)
  })

  //-----------------------------------------------------------------------
  let conBoolen=true

  socket.on("player2", val => {
    player = 2
    console.log(player);

  })
  socket.on('user-connected', (userId, room) => {
    
    console.log(video2.srcObject)
    // console.log(video1.srcObject)
  
    connectToNewUser(userId, stream)

    roomP = room
    console.log("---")
    setTimeout(function aa() {
      console.log("done 6sec")
      if (video2.srcObject == null) {
        // connectToNewUser(userId, stream)
        socket.emit("startV", ROOM_ID, userId)
      } else{
        socket.emit("startG", roomP)
      
      }
      
    }, 2000);
    if(video2.srcObject !== null){
   
    socket.emit("startG", roomP)

  }
})
  
socket.on('user-connected2', (userId) => {
   
  console.log(video2.srcObject)
  console.log(player)

  connectToNewUser(userId, stream)

 
  console.log("---")
  setTimeout(function aa() {
    console.log("done 6sec")
    if (video2.srcObject == null) {
      // connectToNewUser(userId, stream)
      socket.emit("startV", ROOM_ID, userId)
    } 
else{
  
      socket.emit("startG", roomP)
    
    }
  }, 2000);
})
if(video2.srcObject !== null ){
  socket.emit("startG", roomP)

}



socket.on("startGaming",roomG=>{
  
  console.log(player);
  if(conBoolen){
roomP=roomG
$("#p2").text("Player 2")
$("#start").show()
if(player==1){
  
  GameStart()
}else if(player==2){
  $("#turn").text("Opponent turn")
$("hint").text("Dont laughing")
}
  }

})
///-----------------------Game Play Function \/ \/

function GameStart () {  
  // $("start").hide()

  let timeleft = 13;
  console.log("gamestart")
  $("hint").text("make you opponent laughing")

  $("#turn").text("your turn")
 
  let downloadTimer = setInterval(function(){
    $("#timerN").text(timeleft);
    if(timeleft<=0){
        clearInterval(downloadTimer);
socket.emit("p2Turn",roomP)
console.log(timeleft)

// break;
    }
    timeleft -= 1;
  }, 1000);

  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  ///-----------------------Game Play Function ^^^^^
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
  window.location.href = "./playerDisc/id";
})
})

myPeer.on('open', id => {
  userID = id
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {

  const call = myPeer.call(userId, stream)
  const video = document.getElementById('video2')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    console.log(userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}
let count = 0;
function addVideoStream(video, stream) {

  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
}


