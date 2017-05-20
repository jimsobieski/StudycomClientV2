studycom.controller('SidenavController', function($scope, $http) {
    
    $scope.topics = null;
    $scope.name = "test";
    $http.get('/api/topic/show').
        then(function(response) {
            $scope.topics = response.data;
            console.log($scope.topics);
        });
    
    
});