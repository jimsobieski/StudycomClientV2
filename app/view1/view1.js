'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($http) {

    var getMessages = function () {
        $http.get('http://studycom.dev/api/topic/2/posts').
        then(function (response) {
            console.log(response.data);
        });

    };
    getMessages();
});