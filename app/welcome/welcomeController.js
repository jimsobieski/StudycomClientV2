'use strict';

angular.module('myApp.welcomeController', ['ngRoute'])

    .controller('welcomeController', function ($scope, $mdDialog) {

        $scope.name = 'welcome';
        var modal;

        $scope.showInscription = function () {
            modal = $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('This is an alert title')
                .textContent('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')

            $mdDialog
                .show(modal)
                .finally(function () {
                    modal = undefined;
                });
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
                $scope.status = 'You said the information was "' + answer + '".';
            })

            function connexionController($scope, $mdDialog) {
                $scope.email = '';
                $scope.password = '';
                $scope.name = "connexion";
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                }

                $scope.authConnexion = function () {
                    console.log($scope.email);
                }
            }

        }
    })