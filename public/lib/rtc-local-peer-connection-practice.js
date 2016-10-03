/**
 * Created by TUNGTRAN on 8/3/2015.
 */
'use strict;'
var localStream, localPeerConnection, remotePeerConnection;
var localVideo, remoteVideo;
//Just allow the user to click on the Call button a start-up
var btn = {startButton: false,callButton: true, hangupButton: true};
//Utility function for logging information to the Javascript console
function log(text){
    console.log("At time: " + (performance.now()/1000).toFixed(3) + " --> "+ text);
};
function successCallback(stream){
    log("Receive local stream");
    if(window.URL){
        localVideo.src = window.URL.createObjectURL(stream);
    }else{
        localVideo.src = stream;
    }
    localStream = stream;
    //We can now enable the Call button
    callButton = false;
};

//Function associated with clicking on the Start button
//This is the event triggering all other actions
function start(){
    log("Request local stream");
    //First of all, disable Start button on the page
    btn.startButton = true;
    //Get ready to deal with different browser vendors ...
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    //Now, call getUserMedia()
    navigator.getUserMedia({video: true, audio: true}, successCallback, function(error){
        log("navigator.getUserMedia() error: " + error);
    });
};

//Function associated with clicking on Call button
//This is enable upon successful completion of the Start button handler
function call(){
   //First of all, disable the Call button on the page ...
    btn.callButton = true;
    //.... and enable Hangup button
    btn.hangupButton = false;
    log("Starting call");

    //Note that getVideoTracks() and getAudioTracks() are not currently support in Firefox ..
    //... just use them with Chrome
    if(navigator.webkitGetUserMedia){
        //Log info about video and audio device in use
        if(localStream.getVideoTracks().length > 0){
            log("Using video device: " + localStream.getVideoTracks()[0].label);
        }
        if(localStream.getAudioTracks().length > 0){
            log("Using audio device: " + localStream.getAudioTracks()[0].label);
        }

        //Chrome
        if(navigator.webkitGetUserMedia){
            RTCPeerConnection  = webkitRTCPeerConnection;
        }
        //Firefox
        else if(navigator.mozGetUserMedia){
            RTCPeerConnection = mozRTCPeerConnection;
            RTCSessionDescription = mozRTCSessionDescription;
            RTCIceCandidate = mozRTCIceCandidate;
        }
        log("RTCPeerConnection object: " + RTCPeerConnection);

        //This is an optional configuration string, associated with NAT traversal setup
        var servers = null;

        //Create a local PeerConnection object
        localPeerConnection = new RTCPeerConnection(servers);
        log("Create local peer connection object localPeerConnection");
        //Add a handler associated with ICE protocol events
        localPeerConnection.onicecandidate = gotLocalIceCandidate;

        //Create a remote PeerConnection object
        remotePeerConnection = new RTCPeerConnection(servers);
        log("Create remote peer connection object remotePeerConnection");
        //Add a handler associate with ICE protocol events ...
        remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
        // ... and a second handler to be activated as soon as the remote stream becomes available
        remotePeerConnection.onaddstream = gotRemoteStream;

        //Add local stream (as returned by getUserMedia()) to the local PeerConnection
        localPeerConnection.addStream(localStream);
        log("Add localStream to localPeerConnection");

        //We're all set! Create a Offer to be 'sent' to the callee as soon as the local SDP is ready.
        localPeerConnection.createOffer(gotLocalDescription, onSignalingError);
    }
};

function onSignalingError(error){
    console.log('Failed to create signaling message :' + error);
};

//Handler to be called when the 'local' SDP becomes available
function gotLocalDescription (description){
    //Add local desctiption to local PeerConnection
    localPeerConnection.setLocalDescription(description);
    log('Offer from localPeerConnection: \n' + description.sdp);

    //Do the same with the 'pseudoremote' PeerConnetion
    //Note: this is a part that will have to be changed if you want the communicating peers to become remote
    //(which calls for the setup of a proper signaling channel)
    remotePeerConnection.setRemoteDescription(description);

    //Create the Answer to the received Offer based on the 'local' description
    remotePeerConnection.createAnswer(gotRemoteDescription, onSignalingError);
};

//Handler to be called when the remote SDP becomes available
function gotRemoteDescription(description){
    //Set the remote description as the local description of the remote PeerConnection
    remotePeerConnection.setLocalDescription(description);
    log('Answer from remote PeerConnection: \n' + description.sdp);
    //Conversely, set the remote description as the remote description of the local PeerConnection
    localPeerConnection.setRemoteDescription(description);
};

//Handler to be called when hanging up the call
function hangup(){
    log('End call');
    //Close PeerConnection
    localPeerConnection.close();
    remotePeerConnection.close();
    //Reset local variables
    localPeerConnection = null;
    remotePeerConnection = null;
    //Disable hangup button
    btn.hangupButton = true;
    //Enable call button to allow for new calls to be established
    btn.callButton = false;
}

//Handler to be called as soon as the remote stream becomes available
function gotRemoteStream(event){
    //Associated to remote video element with the retrieved stream
    if(window.URL)
        remoteVideo.src = window.URL.createObjectURL(event.stream);
    else
        remoteVideo.src = event.stream;
    log('Received remote stream');
};

//Handler to be called whenever a new local ICE candidate becomes available
function gotLocalIceCandidate(event){
    if(event.candidate) {
        //Add candidate to remote PeerConnection
        remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        log('Remote ICE candidate: \n' + event.candidate.candidate);
    }
};

function gotRemoteIceCandidate(event){
    if(event.candidate){
        //Add candidate to the local PeerConnection
        localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        log('Remote ICEcandidate: \n' + event.candidate.candidate);
    }
};