var socket = io();

document.forms.login.onsubmit = function() {
  socket.emit('login', document.getElementById('user').value, document.getElementById('pass').value);
  document.getElementById('pass').value = '';
  return false;
};
document.forms.chat.onsubmit = function() {
  socket.emit('chat message', document.getElementById('mess').value);
  document.getElementById('mess').value = '';
  return false;
};
socket.on('chat message', function(msg) {
  var li = document.createElement('li');
  li.innerText = msg;
  document.getElementById('msg').appendChild(li);
});