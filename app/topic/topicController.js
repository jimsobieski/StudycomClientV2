angular.module('myApp.topicController', ['ngRoute'])

    .controller('topicController', function ($scope, $mdDialog, $http, $location, $rootScope, Auth, $mdSidenav, topicParams, $localStorage, FileUploader) {

        $scope.url = $location.absUrl();
        $scope.showTopicMenu = false;
        $scope.message = '';
        $scope.users = [];
        if (!Auth.isConnected()) {
            window.location = 'http://localhost/StudycomClientV2/app/#/';
        }

        Auth.user().then(function (response) {
            $scope.user = response;
            $scope.isTopicMember();
            $scope.getTopicByUrl();

        });

        $scope.socket = io.connect('http://localhost:8080');
        $scope.socket.on('connect', function () {
            $scope.socket.emit('joinChannel', 'channel/' + topicParams.id);

            $scope.socket.on('joinChannel', function () {

                $scope.socket.on('newMessage', function (message) {
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
            var bool = true;
            angular.forEach($scope.users, function(user, index) {
                if(user.id == contact.id) {
                    bool = false;
                }
            });
            return bool;
        };

        $scope.isTopicMember = function () {
            var formData = {
                'idUser': $scope.user.id,
                'idTopic': parseInt(topicParams.id)
            };

            $http.post('http://localhost/Studycom/public/api/topic/userMember', formData).then(function (response) {
                if(response.data == 0) {
                    window.location = 'http://localhost/StudycomClientV2/app/#/home';
                }
            })
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
        };

        $scope.userMessage = function (message) {
            return message.idAuthor == $scope.user.id;
        };

        $scope.leaveTopic = function () {
            $http.get('http://localhost/Studycom/public/api/user/' + $scope.user.id + '/topic/' + $scope.topic.id + '/leave').then(function (response) {
                window.location = 'http://localhost/StudycomClientV2/app/#/home';
            });
        };

        $scope.deleteTopic = function () {
            var data = {
                'idTopic': $scope.topic.id,
                'idUser': $scope.user.id
            };
            $http.post('http://localhost/Studycom/public/api/topic/delete',data).then(function (response) {
                window.location = 'http://localhost/StudycomClientV2/app/#/home';
            });
        };

        $scope.deleteUserFromTopic = function (idUser) {
            var data = {
                'idTopic': $scope.topic.id,
                'idUserConnected': $scope.user.id,
                'idUser': idUser
            };
            $http.post('http://localhost/Studycom/public/api/topic/user/delete',data).then(function (response) {

                if(response.data != 'denied'){
                    $scope.users.forEach(function (user) {
                        if (user.id == response.data[0].id) {
                            $scope.index = $scope.users.indexOf(user);
                        }
                    });

                    $scope.users.splice($scope.index, 1);
                }
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
                'idUser': contact.id,
                'idUserConnected': $scope.user.id
            };

            $http.post('http://localhost/Studycom/public/api/topic/addContact', formData)
                .then(function (response) {
                    if(response.data != 'denied'){
                        $scope.users.push(contact);
                        $mdDialog.hide();
                    }
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
            else if(message.idtype == 2) {
                return 'topic-prof-message';
            }
            else {
                return '';
            }
        };

        $scope.scrollBottom = function () {
            var objDiv = document.getElementById("topic-feed");
            window.scrollTo(objDiv.height, objDiv);
        }

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

            function userProfileModalController($scope, $mdDialog, $rootScope, Auth,idAuthor) {

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

            function modifyTopicNameModalController($scope, $mdDialog, $location,Auth) {

                $scope.url = $location.absUrl();
                $scope.name = '';

                Auth.user().then(function(response) {
                    $scope.user = response;
                });


                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };


                $scope.modifyTopicName = function () {

                    var splitUrl = $scope.url.split('/');
                    var idTopic = splitUrl[7];

                    var formData = {
                        name: $scope.name,
                        idUser:$scope.user.id,
                        idTopic: idTopic
                    };

                    $http.post('http://localhost/Studycom/public/api/topic/modify', formData)
                        .then(function (response) {
                            window.location = 'http://localhost/StudycomClient/app/#/home';
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
        };

        $scope.uploader = new FileUploader();

        $scope.uploadFile = function () {
            console.log($scope.uploader);
            $scope.uploader.uploadItem();
        }
    });