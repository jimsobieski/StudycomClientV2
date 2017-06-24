studycom.directive("studycomSidenav", function ($http) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "util/sidenav-directive.html",
        link: function(scope) {

        },
        controller: function ($scope,$location, $mdDialog, Auth) {

            $scope.user = null;
            $scope.url = $location.absUrl();



            Auth.user().then(function(response) {
                $scope.user = response;
                $scope.getTopics();
                $scope.getContacts();
                $scope.selectTab();

            });

            $scope.selectTab = function(){
                var splitUrl = $scope.url.split('/');
                var typeTab = splitUrl[6];

                if(typeTab == 'contact'){
                    return 1;
                } else if(typeTab == 'topic'){
                    return 0;
                }

            }
            $scope.selectedTab = $scope.selectTab();

            $scope.getTopics = function () {
                $http.get('http://localhost/Studycom/public/api/user/'+$scope.user.id+'/topic').then(function(response) {
                    $scope.topics = response.data;

                })
            };

            $scope.getContacts = function () {
                $http.get('http://localhost/Studycom/public/api/user/'+$scope.user.id+'/contacts/get').then(function(response) {
                    $scope.contacts = response.data;
                })
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

                    Auth.user().then(function(response) {
                        $scope.user = response;
                    });

                    $scope.name = '';

                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };


                    $scope.createTopic = function () {
                        var formData = {
                            name: $scope.name,
                        };
                        console.log($scope.user.id);
                        $http.post('http://localhost/Studycom/public/api/user/'+ $scope.user.id+'/topic', formData)
                            .then(function(response) {
                                $mdDialog.hide();
                        })


                    };
                }
            }

            $scope.openAddContactDialog = function (ev) {
                $mdDialog.show({
                    controller: addContactModalController,
                    controllerAs: 'addTopic',
                    templateUrl: 'topic/addContactModal.html',
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

                    };
                }
            }
        }
    }
});