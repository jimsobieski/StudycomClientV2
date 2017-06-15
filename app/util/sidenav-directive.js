studycom.directive("studycomSidenav", function ($http) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "util/sidenav-directive.html",
        link: function(scope) {

        },
        controller: function ($scope, $mdDialog, Auth) {

            $scope.user = null;

            Auth.user().then(function(response) {
                console.log(response);
                $scope.user = response;
                $scope.getTopics();
            });

            $scope.getTopics = function () {
                console.log('test');
                $http.get('http://localhost/Studycom/public/api/user/'+user.id+'/topic').then(function(response) {
                    console.log(response);
                    $scope.topics = response.data;

                })
                console.log('yolo');
            };


            $scope.openAddTopicDialog = function (ev) {
                $mdDialog.show({
                    controller: addTopicModalController,
                    controllerAs: 'addTopic',
                    templateUrl: 'util/addTopicModal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                }).then(function (answer) {

                });

                function addTopicModalController($scope, $mdDialog, $rootScope, Auth) {
                    $scope.name = '';

                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };

                    $scope.createTopic = function () {
                        var formData = {
                            name: $scope.name,
                        };
                        console.log(formData);

                    };
                }
            }

            $scope.openAddContactDialog = function (ev) {
                $mdDialog.show({
                    controller: addContactModalController,
                    controllerAs: 'addTopic',
                    templateUrl: 'util/addContactModal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                }).then(function (answer) {

                });

                function addContactModalController($scope, $mdDialog, $rootScope, Auth) {
                    $scope.name = '';

                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };

                    $scope.createTopic = function () {
                        var formData = {
                            name: $scope.name,
                        };
                        console.log(formData);

                    };
                }
            }
        }
    }
});