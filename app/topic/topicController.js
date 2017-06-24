angular.module('myApp.topicController', ['ngRoute'])

    .controller('topicController', function ($scope, $mdDialog, $http, $location, $rootScope, Auth, $mdSidenav, topicParams, $anchorScroll) {

        $scope.url = $location.absUrl();
        $scope.showTopicMenu = false;

        Auth.user().then(function (response) {
            $scope.user = response;
            $scope.getTopicByUrl();

        });

        $scope.socket = io.connect('http://localhost:8080');
        $scope.socket.on('connect', function () {
            $scope.socket.emit('joinChannel', 'channel/' + topicParams.id);

            $scope.socket.on('joinChannel', function () {

                $scope.socket.on('newMessage', function (message) {
                    console.log(message);
                    $scope.messageFilter(message);

                    $location.hash($scope.messages[$scope.messages.length]);
                    $anchorScroll();
                });

            })
        });


        $scope.getTopicByUrl = function () {
            var splitUrl = $scope.url.split('/');
            var idTopic = splitUrl[7];
            $http.get('http://localhost/Studycom/public/api/topic/' + idTopic + '/get').then(function (response) {
                $scope.topic = response.data[0];
                $scope.getTopicMessages($scope.topic.id);
                $scope.getTopicUsers($scope.topic.id);

            });
        };


        $scope.getTopicUsers = function (idTopic) {

            $http.get('http://localhost/Studycom/public/api/topic/' + idTopic + '/users')
                .then(function (response) {
                    $scope.users = response.data;
                });
        };

        $scope.getTopicMessages = function (idTopic) {
            $http.get('http://localhost/Studycom/public/api/topic/' + idTopic + '/posts').then(function (response) {
                $scope.messages = response.data;
            });
        };
        $scope.toggleTopicMenu = function () {
            $scope.showTopicMenu = !$scope.showTopicMenu;
        };

        $scope.addMessage = function () {

            var data = {
                'idAuthor': $scope.user.id,
                'idTopic': $scope.topic.id,
                'text': $scope.message
            };
            $http.post('http://localhost/Studycom/public/api/topic/sendMessage', data).then(function (response) {
                $scope.socket.emit('newMessage', response.data);
            });
            $scope.message = '';

            //scrollBottom();
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

        $scope.scrollBottom = function () {
            var objDiv = document.getElementById("topic-feed");
            window.scrollTo(0, objDiv);
        }

        $scope.messageFilter = function (message) {
            var messageExist = false;
            for (var i = 0; i < $scope.messages.length; i++) {
                var topicMessage = $scope.messages[i];
                if (topicMessage.id == message.id) {
                    messageExist = true;
                    i = $scope.messages.length;
                }
            }
            if(!messageExist) {
                $scope.messages.push(message);
            }
        }
    });