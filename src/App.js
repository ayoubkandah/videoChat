import Button from "@material-ui/core/Button"
// import IconButton from "@material-ui/core/IconButton"
// import TextField from "@material-ui/core/TextField"
// import AssignmentIcon from "@material-ui/icons/Assignment"
// import PhoneIcon from "@material-ui/icons/Phone"
import React, { useEffect, useRef, useState } from "react"
// import { CopyToClipboard } from "react-copy-to-clipboard"
import Peer from "simple-peer"
import io from "socket.io-client"
import "./App.css"

let c=0;
const socket = io.connect('http://localhost:4040')
function App() {
    const [ me, setMe ] = useState("")
    const [ stream, setStream ] = useState()
    const [ receivingCall, setReceivingCall ] = useState(false)
    const [ caller, setCaller ] = useState("")
    const [ callerSignal, setCallerSignal ] = useState()
    const [ callAccepted, setCallAccepted ] = useState(false)
    const [ callEnded, setCallEnded] = useState(false)
    const [ name, setName ] = useState("")
    const [trigger,setTrigger]=useState()
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef= useRef()

    useEffect(() => {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.on("me", (id) => {
            setMe(id)

        })

        socket.on("callUser", (data) => {
            console.log("user2 Called" )
            console.log(data)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
            setReceivingCall(true)


        })
        socket.on("autoCall",(room,id)=>{
            setTimeout(function aa() {
                setTrigger(id)
                console.log("auto", id)
                // console.log
                // setMe(id)
                console.log(me, "eeeee")

            },3000)
        })
    }, [])

    function callUser(id)  {
        console.log("call User 1",me)
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

    function answerCall ()  {


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
                socket.emit("answerCall", {signal: data, to: caller})
            })
            peer.on("stream", (stream) => {
                userVideo.current.srcObject = stream
            })

            peer.signal(callerSignal)
            connectionRef.current = peer

    }
    function hitAnswer(){
            setTimeout(function aa() {
                if(c<=0) {

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

    return (
      <div>
          {trigger ?  callUser(trigger):null
          }
          {/*{console.log(caller,"calllllerrr")}*/}
          {/*{console.log(callerSignal,"calllerr signnaaal")}*/}
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        {stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ?
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
                            null}
                    </div>
                </div>

                </div>
                <div>
                    {receivingCall  ?(
                        <div className="caller">

                            <Button id="ans" style={{display:"none"}} variant="contained" color="primary" onClick={answerCall}>
                            </Button>
                            {hitAnswer()}
                        </div>
                    ) : null}
                </div>

      </div>
    )
}

export default App