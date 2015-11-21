window.onload = function(){
    
    Parse.initialize("KAimpzFF8jSa1QSJb0NSnMI4IHkCy4ppxHfEDJh7", "m2OZOZx62W1bgyMBjzfV46RH9JByleYbiPjo8rcp");
    
    var messageArray = [];
    
    readMessages();
    
    document.getElementById('send').onclick = function(){
        var messageString = document.getElementById('text').value;
               
        var ChatMessage = Parse.Object.extend("ChatMessage");
        var chatMessage = new ChatMessage();
        chatMessage.save({user: "Ady", 
                            color: "#ff00ff", 
                            message: messageString}, {
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
     
       //https://github.com/davin12x/TalkApp LALIT Code
    };

    //check for new messages every 1 second
    var updateMessage = setInterval(updateMessages, 1000);	
    
   
}