/**
 * Created by TUNGTRAN on 9/19/2015.
 */
'use strict;'
angular.module('rooms').factory('videoStream', function($q){
    var stream;
    return {
        get: function(){
            if(stream)
                return $q.when(stream);
            else{
                var d = $q.defer();
                getUserMedia({
                    video: true,
                    audio:true
                }, function(s){
                    stream = s;
                    d.resolve(stream);
                }, function(e){
                    d.reject(e);
                });
                return d.promise;
            }
        }
    };
});