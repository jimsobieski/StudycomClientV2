'use strict';

// Declare app level module which depends on views, and components
var studycom = angular.module('myApp', [
    'ngMaterial',
    'ngRoute',
    'ngStorage',
    'myApp.welcomeController',
    'myApp.homeController',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
]).constant('urls', {
    BASE: 'http://studycom.dev',
    BASE_API: 'http://http://studycom.dev/api'
}).config(['$locationProvider', '$routeProvider', '$httpProvider', function ($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.hashPrefix('');


    $routeProvider.when('/', {
        templateUrl: "welcome/welcome.html",
        controller: "welcomeController"
    }).when('/view2', {
        templateUrl: 'view2/view2.html',
        controller: 'View2Ctrl'
    }).when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
    }).when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeController'
});;

    $routeProvider.otherwise({redirectTo: '/'});

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                console.log(config.headers);
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token.token;
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
