angular.module('myApp.topicController', ['ngRoute'])

    .controller('topicController', function ($scope, $mdDialog, $http, $location, $rootScope, Auth, $mdSidenav, topicParams, $anchorScroll) {

        $scope.url = $location.absUrl();
        $scope.showTopicMenu = false;
        $scope.message = '';
        $scope.users = [];

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

                $scope.getContacts();

            });
        };


        $scope.getTopicUsers = function (idTopic) {

            $http.get('http://localhost/Studycom/public/api/topic/' + idTopic + '/users')
                .then(function (response) {
                    $scope.users = response.data;
                });
        };

        $scope.isContactToAddToTopic = function (contact) {
            if (!$scope.users.includes(contact)) {
                return true;
            }
            return false;
        };

        $scope.getTopicMessages = function (idTopic) {
            $http.get('http://localhost/Studycom/public/api/topic/' + idTopic + '/posts').then(function (response) {
                $scope.messages = response.data;
                //$scope.scrollBottom();
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
        };

        $scope.userMessage = function (message) {
            return message.idAuthor == $scope.user.id;
        };

        $scope.leaveTopic = function () {
            $http.get('http://localhost/Studycom/public/api/user/' + $scope.user.id + '/topic/' + $scope.topic.id + '/leave').then(function (response) {
                $location.url('http://localhost/StudycomClient/app/#/home');
            });
        };

        $scope.deleteTopic = function () {
            $http.get('http://localhost/Studycom/public/api/topic/' + $scope.topic.id + '/delete').then(function (response) {
                $location.url('http://localhost/StudycomClient/app/#/home');
            });
        };

        $scope.deleteUserFromTopic = function (idUser) {
            $http.get('http://localhost/Studycom/public/api/topic/' + $scope.topic.id + '/user/' + idUser + '/delete').then(function (response) {

                $scope.users.forEach(function (user) {
                    if (user.id == response.data[0].id) {
                        $scope.index = $scope.users.indexOf(user);
                    }
                });

                $scope.users.splice($scope.index, 1);
            });
        };

        $scope.getContacts = function () {
            $http.get('http://localhost/Studycom/public/api/user/' + $scope.user.id + '/contacts/get')
                .then(function (response) {
                    $scope.contacts = response.data;
                })
        };

        $scope.addTopicUser = function (contact) {

            var formData = {
                'idTopic': $scope.topic.id,
                'idUser': contact.id
            };
            console.log(formData);
            $http.post('http://localhost/Studycom/public/api/topic/addContact', formData)
                .then(function (response) {
                    console.log(response.data);
                    $scope.users.push(contact);
                    $mdDialog.hide();
                })
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

        $scope.scrollBottom = function () {
            var objDiv = document.getElementById("topic-feed");
            console.log('scroll');
            window.scrollTo(objDiv.height, objDiv);
        }

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

        $scope.openModifyTopicNameModal = function (ev) {
            $mdDialog.show({
                controller: modifyTopicNameModalController,
                controllerAs: 'modifyTopicNameModal',
                templateUrl: 'topic/modifyTopicNameModal.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            }).then(function (response) {

            });

            function modifyTopicNameModalController($scope, $mdDialog, $location) {

                $scope.url = $location.absUrl();
                $scope.name = '';


                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };


                $scope.modifyTopicName = function () {

                    var splitUrl = $scope.url.split('/');
                    var idTopic = splitUrl[7];

                    var formData = {
                        name: $scope.name
                    };

                    $http.post('http://localhost/Studycom/public/api/topic/' + idTopic + '/modify', formData)
                        .then(function (response) {
                            window.location = 'http://localhost/StudycomClient/app/#/topic/' + idTopic;
                            $mdDialog.hide();
                        })
                };

            }

        };

        $scope.messageFilter = function (message) {
            var messageExist = false;
            for (var i = 0; i < $scope.messages.length; i++) {
                var topicMessage = $scope.messages[i];
                if (topicMessage.id == message.id) {
                    messageExist = true;
                    i = $scope.messages.length;
                }
            }
            if (!messageExist) {
                $scope.messages.push(message);
                $scope.$apply();
            }
        }
    });