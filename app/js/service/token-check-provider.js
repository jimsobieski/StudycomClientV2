studycom.factory('tokenCheckProvider', ['$localStorage', function($localStorage) {
    if(typeof $localStorage.token !== 'undefined') {
        return true;
    }
    return false;
}]);