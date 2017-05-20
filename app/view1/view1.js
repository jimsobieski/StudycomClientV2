'use strict';

angular.module('myApp.view1', ['ngRoute'])

.controller('View1Ctrl', function($http) {

    var getMessages = function () {
        $http.get('http://studycom.dev/api/topic/2/posts').
        then(function (response) {
            console.log(response.data);
        });

    };
    getMessages();
});