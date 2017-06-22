'use strict';

angular.module('myApp.profilController', ['ngRoute'])

.controller('profilController', function($scope, Auth) {

    $scope.userEdit = false;

    Auth.user().then(function(response) {
        $scope.user = response;
        $scope.userToEdit = angular.copy($scope.user);
        console.log($scope.userToEdit);
    });

    $scope.updateUser = function () {
        $scope.editProfile();
        $scope.validUserToEdit();
    };

    $scope.cancelEdition = function () {
        $scope.editProfile();
        $scope.resetUserToEdit();
    };

    $scope.editProfile = function () {
        $scope.userEdit = !$scope.userEdit;
    };

    $scope.resetUserToEdit = function () {
        $scope.userToEdit = angular.copy($scope.user);
    };

    $scope.validUserToEdit = function () {
        $scope.user = angular.copy($scope.userToEdit);
    }
});