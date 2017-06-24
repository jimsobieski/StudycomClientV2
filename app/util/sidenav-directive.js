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

                        $http.post('http://localhost/Studycom/public/api/user/'+ $scope.user.id+'/topic', formData)
                            .then(function(response) {
                                var topic = response.data;
                                $mdDialog.hide();
                                window.location = 'http://localhost/StudycomClient/app/#/topic/'+topic.id;
                        })


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

                    Auth.user().then(function(response) {
                        $scope.user = response;
                    });

                    $scope.email = '';

                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };

                    $scope.sendContactRequest = function () {

                        var formData = {
                            email: $scope.email
                        };

                        $http.post('http://localhost/Studycom/public/api/user/'+ $scope.user.id+'/contact/request', formData)
                            .then(function(response) {

                                if(response.data == 'invalid'){
                                    console.log('Cette adresse mail n\'existe pas !');


                                } else if(response.data == 'exists'){
                                    console.log('Deja dans votre liste de contacts !');

                                }
                                else if(response.data == 'requested'){
                                    console.log('Vous avez deja envoyé une requete à ce contact !');

                                }else{
                                    console.log('demande de contact envoyée');
                                    $mdDialog.hide();

                                }
                            })

                    };
                }
            }
        }
    }
});