// Declare app level module which depends on views, and components
var studycom = angular.module('myApp', [
    'ngMaterial',
    'ngRoute',
    'ngStorage',
    'myApp.welcomeController',
    'myApp.navbarController',
    'myApp.homeController',
    'myApp.view1',
    'myApp.profilController',
    'myApp.topicController',
    'myApp.version'
]).constant('urls', {
    BASE: 'http://studycom.dev',
    BASE_API: 'http://localhost/Studycom/public/api'
}).config(['$locationProvider', '$routeProvider', '$httpProvider', '$qProvider', function ($locationProvider, $routeProvider, $httpProvider, $qProvider) {

    $qProvider.errorOnUnhandledRejections(false);

    $locationProvider.hashPrefix('');


    $routeProvider.when('/', {
        templateUrl: "welcome/welcome.html",
        controller: "welcomeController"
    }).when('/profil', {
        templateUrl: 'profil/profil.html',
        controller: 'profilController'
    }).when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
    }).when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeController'
    }).when('/topic/:id', {
        templateUrl: 'topic/topic.html',
        controller: 'topicController'
    });

    $routeProvider.otherwise({redirectTo: '/'});

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);
}])
