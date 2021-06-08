import Button from "@material-ui/core/Button"
// import IconButton from "@material-ui/core/IconButton"
// import TextField from "@material-ui/core/TextField"
// import AssignmentIcon from "@material-ui/icons/Assignment"
// import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
import minion from "./assets/menion.png"
// import { CopyToClipboard } from "react-copy-to-clipboard"
import * as faceapi from "face-api.js"
import Peer from "simple-peer"
import io from "socket.io-client"
import game from "./game.css"
import mainscreen from './assets/mainscreen.png'
import seconedscreen from './assets/seconedscreen.png'
import titles from './assets/titles.png'
import badge from './assets/badge.png'
import "./App.css"
let c = 0;
let bool = true;
let player = 1;
let yourPoints = 0;
let oppPoints = 0;
let timeleft = 0
let faceTrigger;
let smalT = true;
let fakeTimer=0;
let winPoint=false;
const socket = io.connect('https://api-server-ayoub.herokuapp.com/')
function App() {
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const [trigger, setTrigger] = useState()
    const [room, setRoom] = useState()
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                // faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models');
            const video = document.getElementById('video1');

            // video.addEventListener('play', () => {
            //     faceapi.createCanvasFromMedia(video);
            //     const displaySize = { width: video.width, height: video.height };
            //     setInterval(async () => {
            //         const detections = await faceapi
            //             .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            //             .withFaceLandmarks()
            //             .withFaceExpressions();
            //         if (detections.length > 0) {
            //             if (detections[0].expressions.happy > 0.70 && faceTrigger) {
            //                 oppPoints++;
            //
            //                 if (oppPoints >= 3) {
            //                     ////////////////Player lose
            //                     socket.emit('winner');
            //                     window.location.href = 'https://www.google.com';
            //                 } else {
            //                     //////////////////// player lose 1 point
            //                     document.getElementById(`point-${oppPoints}`).classList.add("pointOp")
            //                     document.getElementById("timer").textContent=""
            //                     document.getElementById("gameStatus").classList.add("loseP")
            //
            //                     document.getElementById("gameStatus").textContent="Fail!"
            //                     faceTrigger = false;
            //                     console.log('happy');
            //                     fakeTimer=0
            //                     socket.emit('p2TurnL', oppPoints, yourPoints);
            //                 }
            //
            //             }
            //         }
            //
            //     }, 100);
            // });

        })
        socket.on('user-disconnected', () => {
            window.location.href = 'https://www.google.com';
        })
        socket.on("me", (id, room) => {
            setMe(id)

        })

        socket.on("callUser", (data) => {
            console.log("user2 Called")
            console.log(data)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
            setReceivingCall(true)


        })
        socket.on("autoCall", (room, id) => {
            player = 2
            setTimeout(function aa() {
                setTrigger(id)
                console.log("auto", id)
                // console.log
                // setMe(id)
                console.log(me, "eeeee")

            }, 2000)


        })
        socket.on('yourTurn', (yourPointss, oppPointss) => {
            console.log("turn shift", yourPointss, oppPointss)
            yourPoints = yourPointss;
            oppPoints = oppPointss;
            document.getElementById('gameStatus').removeAttribute('class')
            document.getElementById("gameStatus").textContent = "Next Turn"
            document.getElementById("gameStatus").classList.add("next")
            setTimeout(function aa() {
                document.getElementById('timer').removeAttribute('class')
                document.getElementById("gameStatus").textContent = "Your_Turn"
                document.getElementById("timer").classList.add("timerPlayer")
                document.getElementById("gameStatus").classList.add("yourA")
                GameStart()
            }, 3000)

        })
        socket.on("gameS", () => {
            if (smalT) {
                console.log("start p", player)

                document.getElementById('gameStatus').removeAttribute('class')

                document.getElementById("gameStatus").classList.add("start")
                document.getElementById("gameStatus").textContent = "Start"

                if (player === 1) {
                    setTimeout(function aa() {
                        document.getElementById("timer").textContent = ""

                        document.getElementById('gameStatus').removeAttribute('class')
                        document.getElementById('timer').removeAttribute('class')
                        document.getElementById("gameStatus").textContent = "Your_Turn"
                        document.getElementById("timer").classList.add("timerPlayer")

                        document.getElementById("gameStatus").classList.add("yourA")


                        GameStart()
                    }, 3000)
                } else {
                    document.getElementById('gameStatus').removeAttribute('class')

                    document.getElementById("gameStatus").classList.add("start")
                    document.getElementById("gameStatus").textContent = "Start"
                    timing()
                    setTimeout(function aa() {
                        faceTrigger=true
                        document.getElementById('timer').removeAttribute('class')

                        document.getElementById("timer").classList.add("timerPlayer")
                        document.getElementById("timer").textContent = ""

                        console.log("number of hit")
                        document.getElementById('gameStatus').removeAttribute('class')
                        document.getElementById("gameStatus").classList.add("opp")

                        document.getElementById("gameStatus").textContent = "Opp_Turn"

                    }, 3000)
                }
                smalT = false
            }

        })
        socket.on('getPoint', (yourPointss, oppPointss) => {

            yourPoints = yourPointss;
            oppPoints = oppPointss;
winPoint=true
            document.getElementById("timer").textContent=""
            document.getElementById('gameStatus').removeAttribute('class')
            document.getElementById('gameStatus').classList.add("winP")
            document.getElementById('gameStatus').textContent="awesome!"
            timeleft=10

            setTimeout(function aa() {

                timeleft=0

            },3000)
        });

        socket.on('youWin', () => {
            console.log("you win")
            window.location.href = 'www.google.com';
        });
    }, [])

    function callUser(id) {
        console.log("call User 1", me)
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {

            userVideo.current.srcObject = stream

        })
        socket.on("callAccepted", (signal) => {
            console.log("Accepter")


            // callUser(caller)

            setCallAccepted(true)
            peer.signal(signal)

        })

        connectionRef.current = peer
    }
    // setTimeout(function aa() {

    function answerCall() {


        setReceivingCall(false)
        console.log("ansswerred, data user 1")
        setCallAccepted(true)

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })

        // console.log(peer, "eeeeeeeeepppp")
        peer.on("signal", (data) => {
            console.log(data, "dataa signaaaaaaaaal")
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer

    }
    function hitAnswer() {
        setTimeout(function aa() {
            if (c <= 0) {

                document.getElementById("ans").click()
                console.log("done 10 serc")
                c++
            }
        }, 3000)

    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    function gameStart() {
        if (bool) {
            console.log("auto run g")
            socket.emit("startG")
            bool = false
        }
    }
    function GameStart() {
        console.log(yourPoints, oppPoints)
        faceTrigger = false;
        timeleft = 20;
        console.log('gamestart');
        // $('#hint').text('make you opponent laughing');
        // $('#turn').text('your turn');

        let downloadTimer = setInterval(function () {
            // $('#timerN').text(timeleft);

            if(!winPoint){
                document.getElementById("timer").textContent = timeleft

            }
            if(!winPoint && timeleft<10){
                document.getElementById("timer").textContent = `0${timeleft}`

            }

            if (timeleft <= 0 ) {
                timeleft = 0;
                clearInterval(downloadTimer);
                faceTrigger = true;
                console.log("before turn shift")
                document.getElementById('gameStatus').removeAttribute('class')
                document.getElementById("gameStatus").textContent = "Next Turn"
                document.getElementById("gameStatus").classList.add("next")
                document.getElementById("timer").textContent=""
                timing()
                winPoint=false

                socket.emit('p2Turn', oppPoints, yourPoints);

                // break;
            }
            
            timeleft -= 1;
        }, 1000);
    }
    function timing(){
        setTimeout(function aa() {

run()
        },3000)
        function run(){
            fakeTimer = 20;
            document.getElementById('gameStatus').removeAttribute('class')
            document.getElementById("gameStatus").textContent = "Opp_Turn"
            document.getElementById("gameStatus").classList.add("opp")
            let downloadTimer = setInterval(function () {
                if(fakeTimer>=10){
                document.getElementById("timer").textContent = fakeTimer
                }else{
                document.getElementById("timer").textContent = `0${fakeTimer}`
                }
                if (fakeTimer <= 0) {
                    fakeTimer = 0;
                    clearInterval(downloadTimer);
                    document.getElementById("timer").textContent=""

                    // break;
                }
                fakeTimer -= 1;
            }, 1000);
        }

    }
    return (
        <div>

            {callAccepted ?

                gameStart()

                : null}
            {trigger ? callUser(trigger) : null
            }
            {/*{console.log(caller,"calllllerrr")}*/}
            {/*{console.log(callerSignal,"calllerr signnaaal")}*/}
            {/* <div className="container"> */}
            <div className="pointsimg">

            <img id="point-3" src={badge}/>
            <img id="point-2" src={badge}/>
            <img id="point-1" src={badge}/>
            </div>
            <div className="video-container">
               <div id="titles">
                   <section id="backG"></section>
               <img id="imgstatus" src={titles} />
               </div>
                        
                <div className="videoleft">
                    <img id="mainscreen" src={mainscreen} />
                    {callAccepted && !callEnded ?
                        <video playsInline id="video2" ref={userVideo} muted autoPlay style={{ width: "500px" }} /> :
                        <div id="empty" style={{ width: "500px", height: "375px" }}></div>
                    }
                </div>

                    <div className="videoright">
                        <img id="seconedscreen" src={seconedscreen} />
                        {stream && <video id="video1" playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                    </div>
                


            </div>

             {/*</div> */}

            <div>

                {receivingCall ? (
                    <div className="caller">

                        <Button id="ans" style={{ display: "none" }} variant="contained" color="primary" onClick={answerCall}>
                        </Button>
                        {hitAnswer()}
                    </div>
                ) : null}
            </div>
            <div id="gameSession">
                <p id="gameStatus" className="waiting">

                    Waiting
                    {/*<span > <br/>timer</span>*/}

                </p>
                <h2 id="timer" className="timing">Timer</h2>
            </div>
        </div>
    )
}

export default App