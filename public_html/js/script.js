/**
 * Created by abhishek on 15/7/17.
 */
var msg,msglist,sendbtn,username;
var socket = io();
function getName() {
    username = window.prompt("Enter your name:");
    if(username == "" || username == null)
        getName();
}
getName();



$(function () {
    msg = $("#msg");
    msglist = $("#chat-msg-box");
    sendbtn = $("#sendbtn");

    socket.emit('login',username);
    socket.on('login-done',function (chats) {
        console.log("emit msges received",chats);
        for(chat of chats){
            msglist.append(`<b>${chat.split(':')[0]}</b> :${chat.split(':')[1]}<br>`);
        }
    });
    sendbtn.click(sendBtn);
    msg.keyup(function (ev) {
        console.log("keyup");
        if(ev.keyCode == 13)
            sendbtn.click();
    });

    socket.on('msg-rec',function (data) {
        msglist.append(`<b>${data.split(':')[0]}</b> :${data.split(':')[1]}<br>`);
    });
    socket.on('priv-msg',function (data) {
        msglist.append(`<b>${data.split(':')[0]}</b> :${data.split(':')[1]}<br>`);
    })


});

function sendBtn() {
    console.log("Msg sent");
    socket.emit("new-msg", msg.val());
    msg.val('');
}