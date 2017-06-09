studycom.factory('Auth', ['$http', '$localStorage', function ($http, $localStorage) {
    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }

    function getClaimsFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    var tokenClaims = getClaimsFromToken();

    return {
        signup: function (data, success, error) {
            $http.post('http://studycom.dev/api/signup', data).then(function(response) {
                console.log(response);
            }).error(function(error) {
                console.log(error);
            });
        },
        signin: function (data, success, error) {
            $http.post('http://studycom.dev/api/signin', data).then(function(response){
                $localStorage.token = response.data.token;
                console.log(response.data);
                $window.location = '/home';
            });
        },
        logout: function (success) {
            tokenClaims = {};
            delete $localStorage.token;
            success();
        },
        getTokenClaims: function () {
            return tokenClaims;
        }
    };
}
]);