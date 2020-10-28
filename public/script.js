const socket = io()
const table = document.getElementById('chatTable')
const button = document.getElementById('send')
const image_button = document.getElementById('sendimage')
const inputbox = document.getElementById('text')

let name;
do {
  name = prompt('Please enter your name: ')
} while(!name)

appendMessage('You joined')
socket.emit('new-user', name)

socket.on('chat-message', data => {
  appendMessage(`${data.name}`+'\u0123' +`${data.message}`)
})

socket.on('user-connected', name => {
  appendMessage('Server'+'\u0123'+`${name}` +` connected`)
})

socket.on('user-disconnected', name => {
  appendMessage('Server'+'\u0123'+`${name}` +` disconnected`)
})


button.addEventListener("click", e => {
  e.preventDefault()
  const message = inputbox.value
  
  if(message=="")
    return;
  
  appendMessage(`You`+'\u0123' +`${message}`)
  socket.emit('send-chat-message', message)
  inputbox.value = ''
})

function appendMessage(message) {
  var res = message.split("\u0123")

  var row = table.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  console.log(res.length)

  if(res.length<2){
    cell1.innerHTML = "<b> Server </b>";
    cell2.innerHTML = "<i>" + message + "</i>";
  }
  
  else if(res[1][0]=='\u0101'){
    //alert(res[1].substring(1))
    
    var imagestring = res[1].substring(1);
    var image = new Image();
    image.src = imagestring
    cell1.innerHTML = "<b>"+res[0]+"</b>"
    image.height = 200;
    //cell2.innerHTML = "";
    cell2.appendChild(image);
    $('#scrollTable').scrollTop($('#scrollTable')[0].scrollHeight);
    var to_delete = document.getElementById('image_to_send');
    to_delete.src=""
    to_delete.style.visibility="hidden"
    
  }
  
  
  else{
    cell1.innerHTML = "<b>"+ res[0] +"</b>";
    cell2.innerHTML = "<i>" + res[1] + "</i>";
  }
  $('#scrollTable').scrollTop($('#scrollTable')[0].scrollHeight);
}

function leave_room(){
  //socket.emit('left')
  location.reload();
}

function previewFile() {
  const preview = document.getElementById('image_to_send');
  const file = document.querySelector('input[type=file]').files[0];
  const reader = new FileReader();
  var image_pot = document.getElementById('image_to_send');
  image_pot.style.visibility="visible"
  image_button.style.visibility="visible"

  reader.addEventListener("load", function () {
      // convert image file to base64 string
      preview.src = reader.result;
  }, false);

  if (file) {
      reader.readAsDataURL(file);
  }
}

$('#sendimage').click(function(){
                    
  var c = document.createElement('canvas');
  var img = document.getElementById('image_to_send');
  img.style.visibility="hidden"
  c.height = img.naturalHeight;
  c.width = img.naturalWidth;
  var ctx = c.getContext('2d');
  

  ctx.drawImage(img, 0, 0, c.width, c.height);
  var base64String = "\u0101"+c.toDataURL();
  if(c.width==0 || c.height==0)
      return;
  if(base64String !=""){
      appendMessage(`You`+'\u0123' + base64String)
      socket.emit('send-chat-message', base64String);
      img.src=""
      image_button.style.visibility="hidden"
      document.getElementById("uploadCaptureInputFile").value = "";
  }
  
});

$('#text').keypress(function(e) {
                    
  var code = e.keyCode || e.which;
  if (code == 13) {
      text = $('#text').val();
      $('#text').val('');
      if(text !=""){
        appendMessage(`You`+'\u0123' +text)
        socket.emit('send-chat-message', text)      
      }
  }

});