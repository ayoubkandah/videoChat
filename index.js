const port = process.env.PORT || 3000;
// const { render } = require('ejs');
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
app.use(require("cors")())
app.set('view engine', 'ejs')
app.use(express.static('public'))
let client=0;
 let rooms=[]
 let index=0;
 let room=0;
 let userID;
// app.get('/pvp', (req, res) => {
//   res.redirect(`/pvp`)
// })
app.get("/playerDisc/:id",(req,res)=>{
//--make update and increase value for player id params
res.render("playerDisc.ejs")
})

app.get('/pvp/', (req, res) => {
  res.render('pvp.ejs', { roomId: "req.params.room" })
})
app.get("/s/:e",(req,res)=>{
  console.log(req.params.e)


})

io.on('connection', socket => {


  socket.on('join-room', ( roomId,userId) => {
   client++
   
    if(client%2!==0){
      index=client-index-1
      rooms.push(index) 
      
      // console.log(rooms[index])
      room=rooms[index]
      // console.log(room,"roooooom")

      socket.Room=room
      socket.join(room)
      console.log(room,"player")
     

      // socket.to(room).emit('user-connected', userId)

      // console.log(socket.id)
      // socket.emit("waiting")
   }else if(client%2==0){
      console.log("starting");
      console.log(rooms[index])
      socket.Room=room

      socket.join(room)
      console.log(room,"player 2")

   index++
   console.log(userId)
  //  socket.nsp.to(room).emit("start",room)
  socket.emit('player2', 2)
  socket.to(room).emit('user-connected', userId)
  

   }else{
   }
   //---
    // socket.join(roomId)


    socket.on('disconnect', () => {
      if(client>0){
        client--;
        }
     
        if(client%2==0&&index>0){
           index--
           rooms.pop()
     
        }
      // console.log("disc")
      
      socket.to(room).emit('user-disconnected', userId)
    })
  })
  socket.on("startV",(roomId,userId)=>{
    console.log(userId)
    socke.nsp.to(room).emit('user-connected', userId)

  })
})

server.listen(port,()=>{console.log(port,"listtt");})