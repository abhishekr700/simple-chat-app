/**
 * Created by abhishek on 14/7/17.
 */
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socketio(server);

var users = [];
var chats = [];

app.use('/',express.static(__dirname + "/public_html"));
app.get('/chats',function (r,s) {
    s.send(chats);
});
app.get('/users',function (r,s) {
    s.send(users);
});

io.on('connection',function (socket) {
    var userIndex = 3;
    console.log("New client connected...");
    socket.on('login',function (user) {
            console.log("new login");
            users.push({
                name: user,
                id: socket.id
            });
            console.log("pushed");
            for(var i = 0;i < users.length;i++){
                // console.log("index finding");
                // console.log(typeof users.id,typeof socket.id);
                if(users[i].id == socket.id)
                    userIndex = i;

            }
            console.log(userIndex,":",socket.id);
            console.log("stored in arr");
            socket.emit("login-done",chats)
    });
    socket.on("new-msg",function (data) {
        if(data.charAt(0) == '@'){
            var targetId = null;
            var user = data.split(" ")[0].substr(1);
            for(var i = 0;i<users.length; i++){
                if(users[i].name == user){
                    targetId = users[i].id;
                }
            }
            if(targetId != null){
                let msg = users[userIndex].name + ":  " + data;
                io.to(targetId).emit("priv-msg",msg);
                socket.emit("priv-msg",msg);
            }
        }
        else {

            // console.log("received:",data);
            let msg = users[userIndex].name + ":  " + data;
            io.emit("msg-rec", msg);
            chats.push(msg);
        }
    })

});


server.listen(80,function () {
    console.log("Server running on 3333...");
});