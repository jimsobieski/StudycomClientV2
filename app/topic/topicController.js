angular.module('myApp.topicController', ['ngRoute'])

    .controller('topicController', function ($scope, $mdDialog, $http, $rootScope, Auth, $mdSidenav) {

        $scope.messages = [];
        $scope.message = '';

        $scope.getTopicMessages = function () {
            var messages = [];
            for(var i = 0; i< 15; i++) {
                messages.push('message '+i);
            }
            $scope.messages = messages;
        }
        $scope.getTopicMessages();


        $scope.addMessage = function () {
            $scope.messages.push($scope.message);
            $scope.message = '';
        }

    });