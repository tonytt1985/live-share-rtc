/**
 * Created by TUNGTRAN on 8/21/2015.
 */
'use strict';
var sendChannel, receiveChannel;
//Javascript variables associated with demo buttons


//Associate handlers with buttons
/*startButton.onclick = createConnection;
 sendButton.onclick = sendData;
 closeButton.onclick = closeDataChannels;*/
angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'socket',
    function($scope, Authentication, socket) {
        //Look after different browser vendor's ways of calling the getUserMedia() API method:
//Opera --> getUserMedia
//Chrome --> webkitGetUserMedia
//Firefox --> mozGetUserMedia
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

//Clean-up function
//Collect garbage before unloading browser's window
        window.onbeforeunload = function(e){
            hangup();
        }

//Data channel information
        var sendChannel, receiveChannel;
        var sendButton = document.getElementById('sendButton');
        var sendTextarea = document.getElementById('dataChannelSend');
        var receiveTextarea = document.getElementById('dataChannelReceive');

//HTML5 <video> elements
        var localVideo = document.querySelector('#localVideo');
        var remoteVideo = document.querySelector('#remoteVideo');

//Handler associated with Send button
        //sendButton.onclick = sendData;

//Flags
        var isChannelReady = false;
        var isInitiator = false;
        var isStarted = false;

//WebRTC structure
//Streams
        var localStream;
        var remoteStream;
//Peer Connection
        var pc;

//PeerConnection ICE protocal configuration (either Firefox or Chrome)
        var pc_config = webrtcDetectedBrowser === 'firefox' ? {iceServers: [{'url': 'stun:192.168.1.206'}]} : {iceServers: [{'url': 'stun:stun.l.google.com:19302'}]};

        var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};
        var sdpConstraints = {};

//Let's get started: prompt user for input (room name)
        var room = prompt('Enter room name:');

//Send 'create or join' message to signaling server
        if(room !== ""){
            console.log('Create or join room', room);
            socket.emit('create or join', room);
        }

//Set getUserMedia Constraints
        var constraints = {video: true, audio: true};

//From this point on, execution proceeds based on asynchronous event ....

//getUserMedia() handlers ....
        function handleUserMedia(stream){
            localStream = stream;
            attachMediaStream(localVideo, stream);
            console.log('Adding local stream.');
            sendMessage('got user media');
        }

        function handleUserMediaError(error){
            console.log('navigator.getUserMedia error', error);
        }

//1. Server --> Client ...
//Handle 'create' message comming back from server
//This peer is the initiator
        socket.on('created', function(room){
            console.log('Created room ' + room);
            isInitiator = true;

            //Call getUserMedia()
            navigator.getUserMedia(constraints, handleUserMedia, handleUserMediaError);
            console.log('Getting user media with constraints', constraints);

            checkAndStart();
        });

//Handle 'full' message coming back from server
//This peer arrived too late :-(
        socket.on('full', function(){
            console.log('Room ' + room + ' is full');
        });

//Handle 'join' message coming back from server
//another peer is joining the channel
        socket.on('join', function(room){
            console.log('Another peer made a request to join room' + room);
            console.log('This peer is the initiator of room ' + room);
            isChannelReady = true;
        });

//Handle 'joined' message coming back from server
//This is the second peer joining the channel
        socket.on('joined', function(room){
            console.log('This peer have joined room ' + room);
            isChannelReady = true;

            //Call getUserMedia()
            navigator.getUserMedia(constraints, handleUserMedia, handleUserMediaError);
            console.log('Getting user media with constraints', constraints);
        });

//Server-send log message ..
        socket.on('log', function(array){
            console.log.apply(console, array);
        });

//Receive message from other peer via signaling server
        socket.on('message', function(message){
            console.log('Received message: ', message);
            if(message === 'got user media'){
                checkAndStart();
            }else if(message.type == "offer"){
                if(!isInitiator && !isStarted){
                    checkAndStart();
                }
                pc.setRemoteDescription(new RTCSessionDescription(message));
                doAnswer();
            }else if(message.type == "answer" && isStarted){
                pc.setRemoteDescription(new RTCSessionDescription(message));
            }else if(message.type == "candidate" && isStarted){
                var candidate = new RTCIceCandidate({sdpMLineIndex: message.label, candidate: message.candidate});
                pc.addIceCandidate(candidate);
            }else if(message.type == "bye" && isStarted){
                handleRemoteHangup();
            }
        });

//2. Client-->server
// Send message to other peer via the signaling server
        function sendMessage(message){
            var data = {channel: room, message: message};
            console.log('Sending message: ', data.message);
            socket.emit('message', data);
        }

//Channel negotiation trigger function
        function checkAndStart(){
            if(!isStarted && typeof localStream != 'undefined' && isChannelReady){
                createPeerConnection();
                isStarted = true;
                if(isInitiator)
                    doCall();
            }
        }

//Peer connection management ...
        function createPeerConnection(){
            try{
                pc = new RTCPeerConnection(pc_config, pc_constraints);

                pc.addStream(localStream);

                pc.onicecandidate = handleIceCandidate;
                console.log('Created RTCPeerConnection with:\n' + ' config: \'' + JSON.stringify(pc_config) + '\';' + ' constraints: \'' + JSON.stringify(pc_constraints) + '\'.');
            }catch(e){
                console.log('Failed to create PeerConnection, exception: ' + e.message);
                alert('Cannot create RTCPeerConnection object.');
                return;
            }

            pc.onaddstream = handleRemoteStreamAdded;
            pc.onremovestream = handleRemoteStreamRemoved;

            if(isInitiator){
                try{
                    //Create a reliable data channel
                    sendChannel = pc.createDataChannel("sendDataChannel", {reliable: true});
                    trace('Create data channel');
                }catch(e){
                    alert('Failed to create data channel. ');
                    trace('createDataChannel() failed with exception: ' + e.message);
                }
                sendChannel.onopen = handleSendChannelStateChange;
                sendChannel.onmessage = handleMessage;
                sendChannel.onclose = handleSendChannelStateChange;
            }else{
                //Joiner
                pc.ondatachannel = gotReceiveChannel;
            }
        }

//Data channel management
        $scope.sendData = function(){
            var data = sendTextarea.value;
            if(isInitiator) sendChannel.send(data);
            else receiveChannel.send(data);
            trace('Send data ' + data);
        }


//Handlers .....
        function gotReceiveChannel(event){
            trace('Receive channel callback');
            receiveChannel = event.channel;
            receiveChannel.onmessage = handleMessage;
            receiveChannel.onopen = handleReceiveChannelStateChange;
            receiveChannel.onclose = handleReceiveChannelStateChange;
        }

        function handleMessage(event){
            trace('Received message: ' + event.data);
            receiveTextarea.value += event.data + '\n';
        }

        function handleSendChannelStateChange(){
            var readyState = sendChannel.readyState;
            trace('Send channel state is: ' + readyState);
            //if channel ready, enable user's input
            if(readyState == 'open'){
                dataChannelSend.disabled = false;
                dataChannelSend.focus();
                dataChannelSend.placeholder = "";
                sendButton.disabled = false;
            }else{
                dataChannelSend.disabled = true;
                sendButton.disabled = true;
            }
        }

        function handleReceiveChannelStateChange(){
            var readyState = receiveChannel.readyState;
            trace('Receive channel state is: ' + readyState);
            //If channel ready, enable user's input
            if(readyState == 'open'){
                dataChannelSend.disabled = false;
                dataChannelSend.focus();
                dataChannelSend.placeholder = "";
                sendButton.disabled = false;
            }else{
                dataChannelSend.disabled = true;
                sendButton.disabled = true;
            }
        }

//ICE candidates management
        function handleIceCandidate(event){
            console.log('handleIceCandidate event: ', event);
            if(event.candidate){
                sendMessage({type: 'candidate', label: event.candidate.sdpMLineIndex, id: event.candidate.sdpMid, candidate: event.candidate.candidate});
            }else{
                console.log('End of candidates.');
            }
        }

//Create offer
        function doCall(){
            console.log('Creating Offer ...');
            pc.createOffer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
        }

//Signaling error handler
        function onSignalingError(error){
            console.log('Failed to create signaling message: ' + error.name);
        }

//Create Answer
        function doAnswer(){
            console.log('Sending answer to peer.');
            pc.createAnswer(setLocalAndSendMessage, onSignalingError, sdpConstraints);
        }

//Success handler for both createOffer() and createAnswer()
        function setLocalAndSendMessage(sessionDescription){
            pc.setLocalDescription(sessionDescription);
            sendMessage(sessionDescription);
        }

//Remote stream handlers...
        function handleRemoteStreamAdded(event){
            console.log('Remote stream added.');
            attachMediaStream(remoteVideo, event.stream);
            console.log('Remote stream attached!!.');
            remoteStream = event.stream;
        }

        function handleRemoteStreamRemoved(event){
            console.log('Remote stream removed. Event: ' + event);
        }

//Clean-up functions ...
        function hangup(){
            console.log('Hanging up.');
            stop();
            sendMessage('bye');
        }

        function handleRemoteHangup(){
            console.log('Session terminated.');
            stop();
            isInitiator = false;
        }

        function stop(){
            isStarted = false;
            if(sendChannel) sendChannel.close();
            if(receiveChannel) receiveChannel.close();
            if(pc) pc.close();
            pc = null;
            sendButton.disabled = true;
        }
    }

]);