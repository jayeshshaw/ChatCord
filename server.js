const express = require('express');
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const formatMessage=require('./helper/msg')
const {userJoin, getCurrentUser,userLeave, getRoomUsers}=require('./helper/users')




const app=express();
const server= http.createServer(app);
const io=socketio(server);


//Set static folder
app.use(express.static(path.join(__dirname, 'public'))); 

const botname=`ChatCord Bot`;


// Run when a client connects
io.on('connection', (socket) => {
    socket.on('joinRoom',({username,room})=>{
        const user=userJoin(socket.id,username,room);

        socket.join(user.room);


        //Welcome current user
        socket.emit(`message`, formatMessage(botname,`Welcome to ChatCord!`)) // for only the user


        //Broadcast when user connects
        socket.broadcast.to(user.room).emit(`message`, formatMessage(botname,`${user.username} has joined the chat`)); // for all the clients except current user

        // io.emit();  // for all the clients



        // Send user and room info
        io.to(user.room).emit(`roomUsers`,{
            room: user.room,
            users: getRoomUsers(user.room)
        });


    })

    





    //Listen for chat message
    socket.on('chatMessage', (msg)=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    })




    //Runs when client dissconnects
    socket.on(`disconnect`, ()=>{
        
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit(`message`, formatMessage(botname,`${user.username} has left the chat`));

            // Send user and room info
            io.to(user.room).emit(`roomUsers`,{
                room: user.room,
                users: getRoomUsers(user.room)
            });


        } 
            

    });
    

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));

