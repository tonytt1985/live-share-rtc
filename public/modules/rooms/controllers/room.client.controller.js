/**
 * Created by TUNGTRAN on 9/3/2015.
 */
angular.module('rooms').controller('RoomController', ['$scope', '$location','$anchorScroll', 'Authentication', 'socket', 'Rooms','$http', '$stateParams', '$cookies', '$sce','$interval', 'videoStream', 'Peers',
    function($scope, $location, $anchorScroll, Authentication, socket, Rooms, $http, $stateParams, $cookies, $sce, $interval, videoStream, Peers) {
        $scope.user = Authentication.user;
        if(!$scope.user){
            $location.path('/signin');
        }
        $scope.users = [];
        $scope.usersChat = {};
        $scope.currentChat = {id: $stateParams.roomId, contentChat: []};
        $scope.callingUser = {};
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "positionClass": "toast-bottom-full-width",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "10000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "slideDown",
            "hideMethod": "slideUp"
        };
        /*Init modal alert*/
        $scope.modalAlert = {type: 'info', content: ''};
        /*End init modal alert*/
        /*Init*/
        $scope.findOne = function(){
            $scope.room = Rooms.get({roomId: $stateParams.roomId}, function(room){
                socket.emit('joinRoom', {
                    user: $scope.user,
                    roomId: room._id
                });
                $scope.changeChat($stateParams.roomId);
                $scope.currentChat.id = $stateParams.roomId;
                $scope.currentChat.contentChat = [];
            });
        };
        /*End init*/

        /*Socket connection*/
        socket.on('disconnect',function(){
            $scope.modalAlert.type = "error";
            $scope.modalAlert.content = "You're disconneted!"
            $('#modal-alert').modal('show');
        });
        socket.on('reconnect', function(){
            socket.emit('joinRoom', {
                user: $scope.user,
                roomId: $stateParams.roomId
            });
            $('#modal-alert').modal('hide');
        });
        socket.on('reconnecting', function(){
            $scope.modalAlert.content = "You're reconnecting ...!"
        });
        /*End socket connection*/

        /*Text Chat*/
        socket.on('message', function(message){
            var chat;
            if($scope.room._id === message.sendTo)
                chat = $scope.usersChat[$scope.room._id];
            else{
                if($scope.usersChat[message.userId] == undefined){
                    $scope.usersChat[message.userId] = {};
                    $scope.usersChat[message.userId].chatContent = [];
                }
                chat = $scope.usersChat[message.userId];
            }
            if(message.room !== message.sendTo){
                if(message.userId !== $scope.currentChat.id)
                    jQuery('#' + message.userId).addClass('chat-warning');
            }else{
                if(message.sendTo !== $scope.currentChat.id)
                    jQuery('#' + message.sendTo).addClass('chat-warning');
            }

            var msg = {
                textChat: [message.textChat],
                username: message.username,
                room: $stateParams.roomId,
                timeStamp: formatTime(new Date().getTime()),
                isMe: false
            };
            chat.chatContent.push(msg);
            //jQuery('#me-chat-box').slimScroll({scrollTo : jQuery('#me-chat-container').height() + 'px'});
        });
        $scope.sendChat = function(){
            if($scope.textChat != ''){
                var message = {
                    textChat: [$scope.textChat],
                    username: $scope.user.username,
                    room: $stateParams.roomId
                };
                socket.emit('message', {username: message.username, room: message.room, textChat: message.textChat[0], sendTo: $scope.currentChat.id, userId: $scope.user._id});
                message.timeStamp = formatTime(new Date().getTime());
                message.isMe = true;
                $scope.currentChat.chatContent.push(message);
                $scope.textChat = "";
                //jQuery('#me-chat-box').slimScroll({scrollTo : jQuery('#me-chat-container').height() + 'px'});
            }
        };
        $scope.changeChat = function(id){
            if($scope.usersChat[id] == undefined){
                $scope.usersChat[id] = {};
                $scope.usersChat[id].chatContent = [];
            }
            $scope.currentChat.id = id;
            $scope.currentChat.chatContent =  $scope.usersChat[id].chatContent;
            //jQuery('#me-chat-box').slimScroll({scrollTo : jQuery('#me-chat-container').height() + 'px'});
            jQuery('#'+id).removeClass('chat-warning');
        };
        $scope.scrollToBottom = function(){
            var scroll = $interval(function(){
                jQuery('#me-chat-box').slimScroll({scrollTo : jQuery('#me-chat-container').height() + 'px'});
                $interval.cancel(scroll);
            },10);
        };
        /*End text chat*/
        /*Room*/
        socket.on('userJoinedRoom', function(message){
            var flag = true;
            for(var i in $scope.users){
                if($scope.users[i]._id === message.user._id){
                    flag = false;
                    break;
                }
            }
            if(flag)
                $scope.users.push(message.user);
        });
        socket.on('userLeftRoom', function(message){
            for(var i in $scope.users){
                if($scope.users[i]._id === message.user._id){
                    $scope.users.splice(i, 1);
                    if($scope.callingUser._id == message.user._id){
                        $scope.inCall = false;
                        $scope.callingStream = "";
                        $('#modal-custom-dialog').modal('hide');
                    }
                    Peers.deletePeer(message.user._id);
                }
            }
        });
        socket.on('joinedRoom', function(message){
            $scope.users = message.listUsers;
        });
        /*End room*/

        /*Video call*/
        $scope.inCall = false;
        $scope.peers = {};
        var stream;
        var callWaiting;
        Peers.initPeers($stateParams.roomId, $scope.user._id);
        Peers.videoStreams = $scope.peers;

        $scope.makeCall = function(){
            $scope.inCall = true;
            socket.emit('privateCall', {room: $stateParams.roomId, by: $scope.user._id, to: $scope.currentChat.id, type: 'call'});
            callWaiting = $interval(function(){
                $scope.inCall = false;
                $interval.cancel(callWaiting);
            },30000);
            //$('#modal-custom-dialog').modal('show');
        };
        $scope.endCall = function(){
            $scope.inCall = false;
            $scope.callingStream = "";
            $('#modal-custom-dialog').modal('hide');
            Peers.deletePeer($scope.callingUser._id);
            socket.emit('privateCall', {room: $stateParams.roomId, by: $scope.user._id, to: $scope.callingUser._id, type: 'endcall'});
        };
        $scope.acceptCall = function(){
            $scope.inCall = true;
            videoStream.get().then(function(s){
                stream = s;
                Peers.stream = stream;
                $scope.inCall = true;
                socket.emit('privateCall', {room: $stateParams.roomId, by: $scope.user._id, to: $scope.callingUser._id, type: 'accept'})
            },function(e){
                toastr.error('WebRTC is not supported by your browser.');
                socket.emit('privateCall', {room: $stateParams.roomId, by: $scope.user._id, to: $scope.callingUser._id, type: 'deny'});
            });
            $interval.cancel(callWaiting);
        };
        $scope.unacceptCall = function(){
            $scope.inCall = false;
            socket.emit('privateCall', {room: $stateParams.roomId, by: $scope.user._id, to: $scope.callingUser._id, type: 'deny'});
            $interval.cancel(callWaiting);
        };
        socket.on('privateCall', function(data){
            switch(data.type){
                case 'call':
                    if(!$scope.inCall){
                        for(var i in $scope.users){
                            if($scope.users[i]._id == data.by){
                                $scope.callingUser = $scope.users[i];
                                $('#modal-confirm').modal('show');
                                break;
                            }
                        }
                        callWaiting = $interval(function(){
                            $scope.inCall = false;
                            $('#modal-confirm').modal('hide');
                            $interval.cancel(callWaiting);
                        },30000);
                    }
                    else
                        socket.emit('privateCall', {room: $stateParams.roomId, by: $scope.user._id, to: $scope.callingUser._id, type: 'deny'});
                    break;
                case 'accept':
                    if(!$scope.inCall){
                        videoStream.get().then(function(s){
                            stream = s;
                            Peers.stream = stream;
                            $scope.callingStream = $scope.peers[data.to];
                            Peers.makeOffer($scope.user._id, data.by);
                        },function(){
                            $scope.inCall = false;
                            socket.emit('privateCall', {room: $stateParams.roomId, by: $scope.user._id, to: $scope.callingUser._id, type: 'deny'});
                        });
                        for(var i in $scope.users){
                            if($scope.users[i]._id == data.by){
                                $scope.callingUser = $scope.users[i];
                                break;
                            }
                        }
                    }
                    else
                        socket.emit('privateCall', {room: $stateParams.roomId, by: $scope.user._id, to: $scope.callingUser._id, type: 'deny'});
                    $interval.cancel(callWaiting);
                    break;
                case 'deny':
                    Peers.initPeers($stateParams.roomId, $scope.user._id);
                    Peers.videoStreams = $scope.peers;
                    toastr.error('Your friend is not available.');
                    $scope.inCall = false;
                    $interval.cancel(callWaiting);
                    break;
                case 'endcall':
                    $scope.inCall = false;
                    $scope.callingStream = "";
                    Peers.deletePeer($scope.callingUser._id);
                    $('#modal-custom-dialog').modal('hide');
                default:
                    break;
            }
        });
        socket.on('privateCallReady', function(data){
            $scope.callingStream = $scope.peers[data.to];
            $('#modal-custom-dialog').modal('show');
        });
        /*End video call*/

        function formatTime(time){
            var h = new Date(time).getHours(), m = new Date(time).getMinutes();
            var tm = ((h / 12) > 1) ? 'PM' : 'AM';
            h = (h <= 12) ? h : h % 12;
            m = (m < 10) ? ('0' + m) : m;
            h = (h < 10) ? ('0' + h) : h;
            return h + ':' + m + ' ' + tm;
        }
    }
]).directive('repeatEnd', function(){
    return {
        restrict: "A",
        link: function(scope, element, attrs){
            if(scope.$eval(attrs.repeatEnd));
        }
    };
});
