
angular.module('core').controller('HomeController', ['$scope', '$location','$anchorScroll', 'Authentication', 'socket', 'Categories','$http', "$interval",
	function($scope, $location, $anchorScroll, Authentication, socket, Categories, $http, $interval) {
        $scope.user = Authentication.user;
        if(!$scope.user){
            $scope.user = {username: 'GUEST'+ Math.floor(Math.random() * 1000000000000), room: 'public'};
            socket.emit('join');
        }else
            socket.emit('leaveRoom', {user: $scope.user});
        var lastChatUsername = '';
        var galleryInit;
        $scope.chatContent = [];
        socket.on('message', function(message){
            if(message.username === lastChatUsername)
                $scope.chatContent[$scope.chatContent.length - 1].textChat.push(message.textChat);
            else{
                var msg = {};
                msg.textChat = [message.textChat];
                msg.username = message.username;
                msg.room = message.room;
                $scope.chatContent.push(msg);
                lastChatUsername = message.username;
            }
            $scope.chatContent[$scope.chatContent.length - 1].timeStamp = formatTime(new Date().getTime());
            $scope.chatContent[$scope.chatContent.length - 1].isMe = false;
            //$location.hash('chatBottom');
            $anchorScroll();
        });
        $scope.sendChat = function(){
            if($scope.textChat != ''){
                var message = {};
                message.textChat = [$scope.textChat];
                message.username = $scope.user.username;
                message.room = $scope.user.room;
                if($scope.user.username == lastChatUsername)
                    $scope.chatContent[$scope.chatContent.length - 1].textChat.push($scope.textChat);
                else{
                    $scope.chatContent.push(message);
                    lastChatUsername = $scope.user.username;
                }
                socket.emit('message', {username: message.username, room: message.room, textChat: message.textChat[0]});
                $scope.chatContent[$scope.chatContent.length - 1].timeStamp = formatTime(new Date().getTime());
                $scope.chatContent[$scope.chatContent.length - 1].isMe = true;
                $scope.textChat = "";
                $location.hash('chatBottom');
                $anchorScroll();
            }
        };
        $scope.init = function(){
            Categories.query(function(cats){
                loadRoomsByCategory(0, cats);
            });
        };
        function loadRoomsByCategory(flag, cats){
            if(flag < cats.length){
                $http.get('/roomsByCategory/'+ cats[flag]._id).success(function(rooms){
                   cats[flag].rooms = rooms;
                    flag++;
                    loadRoomsByCategory(flag, cats);
                }).error(function(){
                    cats[flag].rooms = [];
                    flag++;
                    loadRoomsByCategory(flag, cats);
                });
            }else{
                $scope.categories = cats;

                galleryInit = $interval(function(){
                   if($('.mix-grid').length == $scope.categories.length){
                       $scope.stopGalleryInit();
                   }
                },1000);
            }
        }
        $scope.stopGalleryInit = function(){
            if(angular.isDefined(galleryInit)){
                $interval.cancel(galleryInit);
                page_gallery.init();
            }
        };
        function formatTime(time){
            var h = new Date(time).getHours(), m = new Date(time).getMinutes();
            var tm = ((h / 12) > 1) ? 'PM' : 'AM';
            h = (h <= 12) ? h : h % 12;
            m = (m < 10) ? ('0' + m) : m;
            h = (h < 10) ? ('0' + h) : h;
            return h + ':' + m + ' ' + tm;
        }

    }
]);