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
        if(typeof $localStorage.token !== 'undefined') {
            //var tokenClaim = getClaimsFromToken();
            var data = {
                token: $localStorage.token
            }
            var userPromise = $http.post('http://localhost:8081/api/user', data).then(function (response) {
                return response.data;
            });
            return userPromise;
        }
        return null;

    }


    return {
        signup: function (data, success, error) {
            $http.post('http://localhost:8081/api/signup', data).then(function(response) {
                if(response.data == '') {
                    error();
                }
                else {
                    $localStorage.token = response.data.token;
                    window.location = 'http://localhost/StudycomClientV2/app/#/home';
                    success();
                }

            });
        },
        signin: function (data, success, error) {
            $http.post('http://localhost:8081/api/signin', data).then(function(response){
                if(response.data == false) {
                    error();
                }
                else {
                    $localStorage.token = response.data.token;
                    window.location = 'http://localhost/StudycomClientV2/app/#/home';
                    success();
                }

            });
        },
        logout: function (data) {
            tokenClaims = {};
            $http.post('http://localhost:8081/api/logout', data).then(function(response) {
                delete $localStorage.token;
                window.location = 'http://localhost/StudycomClientV2/app/#/';
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