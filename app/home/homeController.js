angular.module('myApp.homeController', ['ngRoute'])

    .controller('homeController', function ($scope, $mdDialog, $http, $rootScope, Auth, $mdSidenav) {

        $scope.user = null;
        if (!Auth.isConnected()) {
            window.location = 'http://localhost/StudycomClient/app/#/';
        }

    });