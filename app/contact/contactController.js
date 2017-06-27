angular.module('myApp.contactController', ['ngRoute'])

    .controller('contactController', function ($scope, $mdDialog, $http,$location, $rootScope, Auth, contact) {

        Auth.user().then(function(response) {
            $scope.user = response;
            $scope.message = '';
            $scope.getContact();

        });

        $scope.socket = io.connect('http://localhost:8080');
        $scope.socket.on('connect', function () {
            $scope.socket.emit('joinChannel', 'channel/' + contact.id);

            $scope.socket.on('joinChannel', function () {

                $scope.socket.on('newMessage', function (message) {
                    $scope.messageFilter(message);

                });

            })
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
                window.location = 'http://localhost/StudycomClient/app/#/home';

            });
        };



        $scope.addMessage = function () {

            var data = {'idAuthor': $scope.user.id,
                'idTopic': $scope.topic.id,
                'text': $scope.message
            };
            $http.post('http://localhost/Studycom/public/api/topic/sendMessage', data).
            then(function (response) {
                $scope.socket.emit('newMessage', response.data);
            });
            $scope.message = '';
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

        $scope.openUserProfileModal = function (idAuthor) {
            $mdDialog.show({
                controller: userProfileModalController,
                controllerAs: 'userProfileModal',
                templateUrl: 'util/userProfileModal.html',
                parent: angular.element(document.body),
                locals: {
                    idAuthor: idAuthor
                },
                clickOutsideToClose: true
            }).then(function (answer) {

            });

            function userProfileModalController($scope, $mdDialog, Auth,idAuthor) {

                Auth.user().then(function(response) {
                    $scope.user = response;
                    $scope.getAuthor();
                    $scope.getContacts();
                    $scope.getNumberOfContacts();
                    $scope.getMutualContacts();
                    $scope.getMutualTopics();

                });

                $scope.getAuthor = function () {
                    $http.get('http://localhost/Studycom/public/api/author/'+idAuthor+'/get')
                        .then(function(response) {

                            $scope.author = response.data[0];
                        })
                };

                $scope.getContacts = function () {
                    $http.get('http://localhost/Studycom/public/api/user/'+$scope.user.id+'/contacts/get')
                        .then(function(response) {
                            $scope.contacts = response.data;
                        })
                };

                $scope.getNumberOfContacts = function () {
                    $http.get('http://localhost/Studycom/public/api/user/'+idAuthor+'/number/contacts')
                        .then(function(response) {
                            $scope.numberOfContacts = response.data;
                        })
                };

                $scope.getMutualContacts = function () {
                    $http.get('http://localhost/Studycom/public/api/user/'+$scope.user.id+'/user2/'+idAuthor+'/mutual/contacts')
                        .then(function(response) {
                            $scope.mutualContacts = response.data;
                        })
                };

                $scope.getMutualTopics = function () {
                    $http.get('http://localhost/Studycom/public/api/user/'+$scope.user.id+'/user2/'+idAuthor+'/mutual/topics')
                        .then(function(response) {
                            $scope.mutualTopics = response.data;
                        })
                };

                $scope.isInAuthorContacts = function () {

                    $scope.show = true;
                    /*$scope.contacts.forEach(function(contact) {
                     if($scope.author.id == contact.id){
                     $scope.show = false;
                     }
                     });*/

                    return $scope.show;

                };

                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };

                $scope.addContact = function () {

                    var formData = {
                        email: $scope.author.email
                    };

                    $http.post('http://localhost/Studycom/public/api/user/'+ $scope.user.id+'/contact/request', formData)
                        .then(function(response) {
                            $mdDialog.hide();
                        })
                }

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
            if(!messageExist) {
                $scope.messages.push(message);
                $scope.$apply();
            }
        }

    });