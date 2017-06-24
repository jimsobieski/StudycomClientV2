'use strict';

angular.module('myApp.profilController', ['ngRoute'])

.controller('profilController', function($scope, $http, Auth) {

    $scope.userEdit = false;

    Auth.user().then(function(response) {
        $scope.user = response;
        console.log($scope.user);
        $scope.userToEdit = angular.copy($scope.user);
        console.log($scope.userToEdit);
    });

    $scope.updateUser = function () {

        $http.post('http://localhost/Studycom/public/api/user/update', $scope.userToEdit).
        then(function (response) {
            $scope.user = $scope.userToEdit;
            $scope.editProfile();
        });
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