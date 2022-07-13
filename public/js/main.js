const form=document.getElementById('chat-form')
const chatmsg=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');


//Get username and room from URL
const {username, room}= Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

const socket=io();

//Join chatrom

socket.emit('joinRoom',{username,room});



// Get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
}) 



//Message from server
socket.on(`message`, message =>{
    // console.log(message);
    outputMessage(message);


    //Scroll down
    chatmsg.scrollTop=chatmsg.scrollHeight;

});

 

// Message submit
form.addEventListener('submit', (e)=>{
    e.preventDefault();

    //Get msg text
    let msg=e.target.elements.msg.value;
    msg=msg.trim();
    if(!msg)return false;
    
    //Emit msg to server
    socket.emit(`chatMessage`,  msg)


    //Clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
});





//Output Message to DOM
function outputMessage(msg){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`
    <p class="meta">${msg.username}   <span>${msg.time}</span></p>
    <p class="text">
    ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add Room name to Dom
function outputRoomName(room){
    roomName.innerText=room;
}

//Add users to DOM
function outputUsers(users){
    userList.innerHTML=`
    ${users.map(user => `<li> ${user.username}</li>`).join('')}
    `;
};

// Prompt the user before leave chat room
// document.getElementById('leave-btn').addEventListener('click', () => {
//     const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
//     if (leaveRoom) {
//       window.location = '../index.html';
//     }else{
//         window.location = '../chat.html';
//     }
//   });
  