studycom.controller('TopicController', function ($scope, $http, $location, UserService) {
    $scope.url = $location.absUrl();


    UserService.user().then(function(user){
        $scope.user = user;
    });

    axios.get('/oauth/clients')
        .then(function(response) {
        console.log(response.data);
});

    $scope.getTopic = function () {
        var splitUrl = $scope.url.split('/');
        var idTopic = splitUrl[4];
        $http.get('/api/topic/'+idTopic+'/get').then(function(response) {
            $scope.topic = response.data[0];
            console.log($scope.topic);
            $scope.getMessages($scope.topic.id);

        });
    };
    $scope.topic = $scope.getTopic();


    $scope.getMessages = function (idTopic) {
        $http.get('/api/topic/'+idTopic+'/posts').
                then(function (response) {
                    $scope.messages = response.data;
                });
    };



    $scope.postMessage = function () {
        
        var data = {'idAuthor': $scope.user.id,
                    'idTopic': $scope.topic.id,
                    'text': $scope.text
        };
        $http.post('/topic/sendMessage', data).
                then(function (response) {
                    $scope.messages.push(response.data);
                });
        $scope.text = '';
    }
});



