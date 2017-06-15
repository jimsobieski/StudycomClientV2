angular.module('myApp.navbarController', ['ngRoute'])

    .controller('navbarController', function ($scope, $mdDialog, $http, $rootScope, Auth, $mdSidenav) {

        $scope.test = 'test';

        $scope.isConnected = false;

        function successAuth(res) {
            $localStorage.token = res.token;
            window.location = "/";
        }

        $scope.openSideNav = function (){
            $mdSidenav('left').toggle();
        }

        $scope.showInscription = function (ev) {
            $mdDialog.show({
                controller: inscriptionController,
                controllerAs: 'inscription',
                templateUrl: 'welcome/inscription.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {
                console.log(answer);
            })

            function inscriptionController($scope, $mdDialog) {
                $scope.email = '';
                $scope.password = '';
                $scope.confirmPassword = '';
                $scope.name = "connexion";
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                }

                $scope.authInscription = function () {
                    console.log($scope.email);
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
                $scope.email = 'sobieskimail@yopmail.com';
                $scope.password = 'studycom';
                $scope.name = "connexion";
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
                    })
                };
            }

        };
    });