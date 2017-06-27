'use strict';

angular.module('myApp.welcomeController', ['ngRoute'])

    .controller('welcomeController', function ($scope, $mdDialog, $http, $rootScope, Auth) {

        $scope.signin = function () {
            var formData = {
                email: $scope.email,
                password: $scope.password
            };

            Auth.signin(formData, successAuth, function () {
                $rootScope.error = 'Invalid credentials.';
                $mdDialog.hide();
            }).then(function (response) {
                $window.location = '/home';

            })
        };

        $scope.signup = function () {
            var formData = {
                email: $scope.email,
                password: $scope.password
            };

            Auth.signup(formData, successAuth, function () {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.showInscription = function (ev) {
            $mdDialog.show({
                controller: inscriptionController,
                controllerAs: 'inscription',
                templateUrl: 'welcome/inscription.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {
            })

            function inscriptionController($scope, $mdDialog) {
                $scope.email = '';
                $scope.password = '';
                $scope.confirmPassword = '';
                $scope.name = "connexion";
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                }
            }
        };
        $scope.showConnexion = function (ev) {
            $mdDialog.show({
                controller: connexionController,
                controllerAs: 'connexion',
                templateUrl: 'welcome/connexion.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {

            });

            function connexionController($scope, $mdDialog, $rootScope, Auth) {
                $scope.email = '';
                $scope.password = '';
                $scope.name = "";
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };

                $scope.signin = function () {
                    var formData = {
                        email: $scope.email,
                        password: $scope.password
                    };

                    Auth.signin(formData, successAuth, function () {
                        $rootScope.error = 'Invalid credentials.';

                    });

                    function successAuth() {
                        $mdDialog.hide();
                    }
                };


            }

        };

        $scope.getToken = function () {

            var data = {
                email: 'sobieskimail@yopmail.com',
                password: 'studycom'
            }

            Auth.signin(data);

        };
        //$scope.getToken();

    })