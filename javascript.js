window.onload = function(){
    
    Parse.initialize("KAimpzFF8jSa1QSJb0NSnMI4IHkCy4ppxHfEDJh7", "m2OZOZx62W1bgyMBjzfV46RH9JByleYbiPjo8rcp");
    
    //Me
    var myName = "Ady";
    var myColor = "#ff00ff";
    
    //populate the users
    var toUsers = [{value:'All', text: 'All'}, 
                   {value:'Kevin', text: 'Kevin'}, 
                   {value:'Lalit', text: 'Lalit'}, 
                   {value:'Tiago', text: 'Tiago'}];
    
    var select = document.getElementById('toWhom');
    
    for (var i = 0; i < toUsers.length; i ++) {
        option = document.createElement('option');
        option.setAttribute('value', toUsers[i].value);
        option.appendChild(document.createTextNode(toUsers[i].text));
        
        select.appendChild(option);
    }
    
    //prepare to read the messages
    var messageArray = [];
    readMessages();
    
    //saving message on Parse when button send is clicked
    document.getElementById('send').onclick = function(){
        var messageString = document.getElementById('text').value;
               
        var ChatMessage = Parse.Object.extend("ChatMessage");
        var chatMessage = new ChatMessage();
        
        chatMessage.save({  user: myName, 
                            color: myColor, 
                            message: messageString,
                            to: $("#toWhom").val()}, {
              success: function(object) {
                readMessages();
              },
              error: function(model, error) {
                
              }
        });
	};
    
    function updateMessages(){
        
        document.getElementById('messages').value = messageArray;

        tinymce.init({
            selector:'textarea',
            readonly : true,
            toolbar: false,
            menubar: false,
            resize: false
        });	
        
    };
    
    function addMessage(user, message, color){
        messageArray.push('<p style="color:' + color + '">' + user + ': ' + message + '</p>');
    }
    
    function readMessages(){
        var ChatMessage = Parse.Object.extend("ChatMessage");
        var allMessages = new Parse.Query(ChatMessage);
        allMessages.ascending("createdAt");
        allMessages.containedIn("to",["All", myName]);
        
        allMessages.find({
            success: function(allMessages) {
                messageArray = [];
                tinymce.remove();
                 allMessages.forEach(function(entry) {
                     var chatMessage = new Parse.Query(ChatMessage);
                     chatMessage.get(entry.id, {
                          success: function(chatMessage) {
                            // The object was retrieved successfully.
                                var user = chatMessage.get("user");
                                var message = chatMessage.get("message");
                                var color = chatMessage.get("color");

                                addMessage(user, message, color);
                                //updateMessages();
                          },
                          error: function(object, error) {
                            // The object was not retrieved successfully.
                            // error is a Parse.Error with an error code and message.
                              console.error(error);
                          }
                     });
                 });
            }
        });
     
    };

    //check for new messages every 5 second
    var updateMessage = setInterval(updateMessages, 1000);	
   
}