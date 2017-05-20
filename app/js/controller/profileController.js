studycom.controller('ProfileController', function($scope, $http, $location) {
  
    $scope.variable = "variable test";
    
    $http.get('/user/auth').
        then(function(response) {
          
            $scope.user = response.data;   
            
        });
});