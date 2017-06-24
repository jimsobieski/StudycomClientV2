angular.module('myApp.contactController', ['ngRoute'])

    .controller('contactController', function ($scope, $mdDialog, $http,$location, $rootScope, Auth, contact) {

        Auth.user().then(function(response) {
            $scope.user = response;

            $scope.getContact();

        });



        $scope.getContact = function () {

            $http.get('http://localhost/Studycom/public/api/contact/'+contact.id+'/get').then(function(response) {
                $scope.contact = response.data[0];
                $scope.getTopic();
            });
        };

        $scope.getTopic = function () {

            $http.get('http://localhost/Studycom/public/api/user/'+$scope.user.id+'/contact/topic/' + $scope.contact.id +'/get').then(function(response) {
                $scope.topic = response.data[0];
                $scope.getTopicMessages($scope.topic.id);
            });
        };

        $scope.getTopicMessages = function (idTopic) {
            $http.get('http://localhost/Studycom/public/api/topic/'+idTopic+'/posts').
            then(function (response) {
                $scope.messages = response.data;
            });
        };

        $scope.deleteUser = function () {
            $http.get('http://localhost/Studycom/public/api/user/'+$scope.user.id+'/contact/'+$scope.contact.id+'/delete').
            then(function (response) {
                $location.url('http://localhost/StudycomClient/app/#/home');
            });
        };



        $scope.addMessage = function () {

            var data = {'idAuthor': $scope.user.id,
                'idTopic': $scope.topic.id,
                'text': $scope.message
            };
            $http.post('http://localhost/Studycom/public/api/topic/sendMessage', data).
            then(function (response) {
                $scope.messages.push(response.data);
            });
            $scope.message = '';

            scrollBottom();
        };

        $scope.userMessage = function (message) {
            return message.idAuthor == $scope.user.id;
        };

        $scope.leftOrRight = function (message) {
            if (message.idAuthor == $scope.user.id) {
                return 'end center';
            }
            else {
                return 'start center';
            }
        };
        $scope.authMessage = function (message) {
            if (message.idAuthor == $scope.user.id) {
                return 'topic-auth-message';
            }
            else {
                return '';
            }
        };

        $scope.openUserProfileModal = function (ev) {
            $mdDialog.show({
                controller: userProfileModalController,
                controllerAs: 'userProfileModal',
                templateUrl: 'util/userProfileModal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (answer) {

            });

            function userProfileModalController($scope, $mdDialog, $rootScope, Auth) {
                $scope.email = 'sobieskimail@yopmail.com';
                $scope.name = "jim";
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };

                $scope.addContact = function () {
                    console.log('contact ajouté');
                }

            }

        };

        var scrollBottom = function () {


        }

    });