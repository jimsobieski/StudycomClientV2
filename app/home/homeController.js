angular.module('myApp.homeController', ['ngRoute'])

    .controller('homeController', function ($scope, $mdDialog, $http, $rootScope, Auth, $mdSidenav) {

    $scope.user = Auth.user();
    //console.log($scope.user);


    });