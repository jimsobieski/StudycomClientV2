angular.module('myApp.topicController', ['ngRoute'])

    .controller('topicController', function ($scope, $mdDialog, $http,$location, $rootScope, Auth, $mdSidenav, topic) {

        $scope.url = $location.absUrl();
        $scope.showTopicMenu = false;
        /* $scope.getTopicMessages = function () {
         var messages = [];
         for (var i = 1; i < 15; i++) {
         if (i % 2 == 0) {
         var message = {
         'idAuthor': 1,
         'author': 'Jim Sobieski',
         'text': 'lorem ipsum dolor sit amet'

         }
         messages.push(message);
         }
         else {
         var message = {
         'idAuthor': 2,
         'author': 'John Doe',
         'text': 'lorem ipsum dolor sit amet bla bla blabla ...'

         }
         messages.push(message);
         }

         }
         $scope.messages = messages;
         };
         $scope.getTopicMessages();
         console.log(topic);*/

        $scope.getTopicByUrl = function () {
            var splitUrl = $scope.url.split('/');
            var idTopic = splitUrl[7];
            $http.get('http://localhost/Studycom/public/api/topic/'+idTopic+'/get').then(function(response) {
                $scope.topic = response.data[0];
                $scope.getTopicMessages(topic.id);

            });
        };
        $scope.topic = $scope.getTopicByUrl();


        $scope.getTopicMessages = function (idTopic) {
            $http.get('http://localhost/Studycom/public/api/topic/'+idTopic+'/posts').
            then(function (response) {
                console.log(response.data);
                $scope.messages = response.data;
            });
        };
        $scope.toggleTopicMenu = function () {
            $scope.showTopicMenu = !$scope.showTopicMenu;
        };

        $scope.addMessage = function () {
            var message = {
                'idAuthor': 1,
                'author': 'Jim Sobieski',
                'text': $scope.message

            }
            $scope.messages.push(message);
            $scope.message = '';
            scrollBottom();
        };

        $scope.leftOrRight = function (message) {
            if (message.idAuthor == 1) {
                return 'end center';
            }
            else {
                return 'start center';
            }
        };
        $scope.authMessage = function (message) {
            if (message.idAuthor == 1) {
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
            var messages = document.getElementsByClassName('topic-message-card');
            console.log(messages[messages.length - 1]);
            messages[messages.length - 1].scrollTop = messages[messages.length - 1].scrollHeight;

        }

    });