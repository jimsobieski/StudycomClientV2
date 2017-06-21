'use strict';

angular.module('myApp.profilController', ['ngRoute'])

.controller('profilController', function($scope, Auth) {

    $scope.userEdit = false;

    Auth.user().then(function(response) {
        $scope.user = response;
        $scope.userToEdit = angular.copy($scope.user);
        console.log($scope.userToEdit);
    });

    $scope.editProfile = function () {
        $scope.userEdit = !$scope.userEdit;
    }
});