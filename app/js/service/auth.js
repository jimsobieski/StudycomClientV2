studycom.factory('Auth', ['$http', '$localStorage', function ($http, $localStorage, $q, $mdDialog) {
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
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    var tokenClaims = getClaimsFromToken();

    function getUser() {
        var tokenClaim = getClaimsFromToken();
        var userPromise = $http.get('http://localhost/Studycom/public/api/user/'+tokenClaim.sub).then(function (response) {
            return response.data;
        });
        return userPromise;
    }


    return {
        signup: function (data, success, error) {
            $http.post('http://localhost/Studycom/public/api/signup', data).then(function(response) {
                console.log(response);
                if(response.data == '') {
                    window.location = 'http://localhost/StudycomClient/app/#/';
                    error();
                }
                else {
                    $localStorage.token = response.data.token;
                    window.location = 'http://localhost/StudycomClient/app/#/home';
                    success();
                }

            });
        },
        signin: function (data, success, error) {
            $http.post('http://localhost/Studycom/public/api/signin', data).then(function(response){
                $localStorage.token = response.data.token;
                window.location = 'http://localhost/StudycomClient/app/#/home';
                success();
            });
        },
        logout: function (data) {
            tokenClaims = {};
            $http.post('http://localhost/Studycom/public/api/logout', data).then(function(response) {
                console.log(response.data);
                delete $localStorage.token;
                window.location = 'http://localhost/StudycomClient/app/#/';
            });

        },
        getTokenClaims: function () {
            return tokenClaims;
        },

        user: function () {
            return getUser();
        },

        isConnected : function () {
            if($localStorage.token) {
                return true;
            }
            return false;
        }
    };
}
]);