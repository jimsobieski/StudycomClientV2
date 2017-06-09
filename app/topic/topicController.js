angular.module('myApp.topicController', ['ngRoute'])

    .controller('topicController', function ($scope, $mdDialog, $http, $rootScope, Auth, $mdSidenav) {

        $scope.messages = [];
        $scope.message = '';

        $scope.getTopicMessages = function () {
            var messages = [];
            for(var i = 1; i< 15; i++) {
                if(i%2==0) {
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
        }
        $scope.getTopicMessages();


        $scope.addMessage = function () {
            var message = {
                'idAuthor': 1,
                'author': 'Jim Sobieski',
                'text': $scope.message

            }
            $scope.messages.push(message);
            $scope.message = '';
            scrollBottom();
        }

        $scope.leftOrRight = function (message) {
            if (message.idAuthor==1) {
                return 'end center';
            }
            else {
                return 'start center';
            }
        }
        $scope.authMessage = function (message) {
            if (message.idAuthor==1) {
                return 'topic-auth-message';
            }
            else {
                return '';
            }
        }

        var scrollBottom = function () {
            var messages = document.getElementsByClassName('topic-message-card');
            console.log(messages[messages.length-1]);
            messages[messages.length-1].scrollTop = messages[messages.length-1].scrollHeight;

        }

    });