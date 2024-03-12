//const variables...
const socket = io();
const form = document.getElementById('send-container');
const input = document.getElementById('input');
const username = prompt("Enter Your Name");
const messages = document.getElementById('AllChats');
const userInfo = document.getElementById('ConnectedUsers');
const audio = new Audio('./tunes/message.mp4');
const leaveAudio = new Audio('./tunes/leave.mp4');
var pos = 'right';


//functions...
function getTime() {
  const messages = document.querySelectorAll('.Message');
  const date = new Date();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;

  Array.from(messages).forEach(message => {
    message.style.setProperty('--after-content', `"${timeString}"`);
  });

};

//when view of user got full by the messages then it's auto showes the newer messasges to the user...
function scrollToBottom() {
  let chatMessage = document.getElementById('AllChats');
  chatMessage.scrollTop = chatMessage.scrollHeight;
}

(function getName() {
  let userNameContainer = document.querySelector("#userName");
  let userNameh1 = userNameContainer.querySelector('h1');
  userNameh1.innerHTML = username;

  //for addition first latter in the circle;
  let circle = document.querySelector("#circle");
  let circleContent = circle.querySelector('h1');
  let firstLetter = username.charAt(0);
  circleContent.innerHTML = firstLetter;
})();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    audio.play();
    let newDiv = document.createElement("div");
    newDiv.classList.add("Message", pos);// Set the id attribute
    newDiv.innerHTML = "<span class='username'>" + username + "</span><br> " + input.value; // Set the text content
    messages.appendChild(newDiv); // Append it to the body

    //calling time function so that the updated time of chat can show up to user
    getTime();

    //callling scroll function so that user does can see newer chats on thier screen
    scrollToBottom()

    socket.emit('chat-message', input.value, username, pos);

    input.value = '';
  }
});


//socketes...
socket.emit('new-joined', username,);

socket.on('chat message', (msg, username, pos) => {
  //palying audio when user send a message in the chat...
  audio.play();

  //message  div
  let messageDiv = document.createElement("div");
  messageDiv.classList.add("Message", pos);// Set the id attribute
  messageDiv.innerHTML = "<span class='username'>" + username + "</span><br> " + msg; // Set the text content
  messages.appendChild(messageDiv); // Append it to the body, for example  

  //calling time function to show the updated time..
  getTime();
  //callling scroll function so that user does can see newer chats on thier screen
  scrollToBottom();
});

socket.on('user-name', (name) => {
  // Create elements
  let userProfileContainer = document.createElement('div');
  userProfileContainer.classList.add('userProfileContainer');

  let userImage = document.createElement('div');
  userImage.classList.add('userImage');
  let userImageText = document.createElement('h1');
  userImageText.textContent = name.charAt(0); // Assuming 'U' as the user's initial
  userImage.appendChild(userImageText);

  let userName = document.createElement('div');
  userName.classList.add('userName');
  let userNameText = document.createElement('h1');
  userNameText.textContent = name; // Assuming 'User 1' as the username
  userName.appendChild(userNameText);
  // Append elements
  userProfileContainer.appendChild(userImage);
  userProfileContainer.appendChild(userName);
  // Append to div#ConnectedUsers
  let connectedUsersDiv = document.getElementById('ConnectedUsers');
  connectedUsersDiv.appendChild(userProfileContainer);
});

socket.on('leave', () => {
  //playing audio when user left the chat..
  leaveAudio.play();

  let userName = document.querySelectorAll('.userName');
  let userImage = document.querySelectorAll('.userImage');
  // Remove the last element from userName
  userName = removeLastElement(userName);
  // Remove the last element from userImage
  userImage = removeLastElement(userImage);

  function removeLastElement(nodeList) {
    const length = nodeList.length;
    if (length > 0) {
      nodeList[length - 1].remove();
    }
    return nodeList;
  }

});


