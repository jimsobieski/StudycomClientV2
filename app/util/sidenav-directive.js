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
                $scope.getRequests();
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
                $http.get('http://localhost:8081/api/user/'+$scope.user.id+'/topic').then(function(response) {
                    $scope.topics = response.data;
                })
            };

            $scope.getContacts = function () {
                $http.get('http://localhost:8081/api/user/'+$scope.user.id+'/contacts').then(function(response) {
                    $scope.contacts = response.data;
                })
            };

            $scope.getRequests = function () {
                $http.get('http://localhost:8081/api/user/'+$scope.user.id+'/requests').then(function(response) {
                    $scope.requests = response.data;

                })
            };

            $scope.acceptRequest = function (idRequest) {
                $http.get('http://localhost:8081/api/user/'+$scope.user.id+'/request/'+idRequest+'/accept').then(function(response) {

                    $scope.requests.forEach(function(request) {
                        if(request.id == idRequest){
                            $scope.indexAccept = $scope.requests.indexOf(request);
                        }
                    });

                    $scope.requests.splice($scope.indexAccept,1);

                    $scope.contacts.push(response.data[0]);

                })
            };

            $scope.refuseRequest = function (idRequest) {
                $http.get('http://localhost:8081/api/user/'+$scope.user.id+'/request/'+idRequest+'/refuse').then(function(response) {

                    $scope.requests.forEach(function(request) {
                        if(request.id == idRequest){
                            $scope.indexRefuse = $scope.requests.indexOf(request);
                        }
                    });

                    $scope.requests.splice($scope.indexRefuse,1);

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

                        $http.post('http://localhost:8081/api/user/'+ $scope.user.id+'/topic', formData)
                            .then(function(response) {
                                var topic = response.data;
                                $mdDialog.hide();
                                window.location = 'http://localhost/StudycomClientV2/app/#/topic/'+topic.id;
                        })


                    };
                }
            };

            $scope.openAddContactDialog = function (ev) {
                $mdDialog.show({
                    controller: addContactModalController,
                    controllerAs: 'addTopic',
                    templateUrl: 'util/addContactModal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });

                function addContactModalController($scope, $mdDialog, $rootScope, Auth) {

                    Auth.user().then(function(response) {
                        $scope.user = response;
                    });

                    $scope.email = '';
                    $scope.userNotFound = false;
                    $scope.userAlreadyContact = false;
                    $scope.userAlreadyReceiveRequest = false;
                    $scope.userIsHimself = false;

                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };

                    $scope.sendContactRequest = function () {

                        var formData = {
                            email: $scope.email
                        };

                        $http.post('http://localhost:8081/api/user/'+ $scope.user.id+'/contact/request', formData)
                            .then(function(response) {

                                if(response.data == 'invalid'){
                                    $scope.userNotFound = true;
                                } else if(response.data == 'exists'){
                                    $scope.userAlreadyContact = true;
                                }
                                else if(response.data == 'requested'){
                                    $scope.userAlreadyReceiveRequest = true;

                                }
                                else if(response.data == 'yourself'){
                                    $scope.userIsHimself = true;
                                }
                                else{
                                    $mdDialog.hide();
                                }
                            })
                    };
                }
            }
        }
    }
});