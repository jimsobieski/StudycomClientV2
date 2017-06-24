angular.module('myApp.homeController', ['ngRoute'])

    .controller('homeController', function ($scope, $mdDialog, $http, $rootScope, Auth, $mdSidenav) {

    $scope.user = null;

    Auth.user().then(function(response) {
        $scope.user = response;
        console.log($scope.user);

    });


    });