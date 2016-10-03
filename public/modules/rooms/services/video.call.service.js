/**
 * Created by TUNGTRAN on 9/19/2015.
 */
'use strict;'
angular.module('rooms').factory('Peers', ['$sce','socket',function($sce, socket){

    var pc_config = webrtcDetectedBrowser === 'firefox' ? {iceServers: [{'url': 'stun:192.168.1.204'}]} : {iceServers: [{'url': 'stun:stun.l.google.com:19302'}]};
    var pc_constraints = {'optional': [{'DtlsSrtpKeyAgreement': true}]};
    var roomId,userId;
    var _this = this;
    this.peerConnections;
    this.stream;
    this.videoStreams;
    this.initPeers = function(rid, uId){
        roomId = rid;
        userId = uId;
        this.stream = "";
        this.videoStreams = {};
        this.peerConnections = {};
    };
    this.getPeerConnection = function(id){
        var _this = this;
        if(this.peerConnections[id])
            return this.peerConnections[id];
        var pc = new RTCPeerConnection(pc_config, pc_constraints);
        this.peerConnections[id] = pc;
        pc.addStream(this.stream);

        pc.onicecandidate = function(evnt){
            if(evnt.candidate)
                socket.emit('msg', {room: roomId, by: userId, to: id, ice: evnt.candidate, type: 'ice'});
        };
        pc.onaddstream = function(evnt){
            _this.videoStreams[id] = $sce.trustAsResourceUrl(URL.createObjectURL(evnt.stream));
            socket.emit('privateCallReady', {by: userId, to: id, type: 'ready'} )
        };
        return pc;
    };
    this.makeOffer = function(by, to){
        var pc = this.getPeerConnection(to);
        pc.createOffer(function(sdp){
            pc.setLocalDescription(sdp);
            socket.emit('msg', {room: roomId, by : by, to: to, sdp: sdp, type: 'sdp-offer'});
        }, function(e){
            console.log("Error :" + e);
        },{mandatory: {OfferToReceiveVideo: true, OfferToReceiveAudio: true}});
    };
    socket.on('msg', function(data){
        var pc = _this.getPeerConnection(data.by);
        switch(data.type){
            case 'sdp-offer':
                pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function(){
                    pc.createAnswer(function(sdp){
                        pc.setLocalDescription(sdp);
                        socket.emit('msg', {room: roomId, by: data.to, to: data.by, sdp: sdp, type: 'sdp-answer'});
                    }, function(e){
                        console.log("Error :" + e);
                    },{mandatory: {OfferToReceiveVideo: true, OfferToReceiveAudio: true}});
                });
                break;
            case 'sdp-answer':
                pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function(){
                    console.log('Setting remote description by answer.');
                }, function(e){
                    console.error(e);
                });
                break;
            case 'ice':
                if(data.ice)
                    pc.addIceCandidate(new RTCIceCandidate(data.ice));
                break;
        }
    });
    this.deletePeer = function(id){
        if(this.peerConnections[id])
            delete this.peerConnections[id]
    };
    return this;
}]);
