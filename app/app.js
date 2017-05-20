'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngMaterial',
    'ngRoute',
    'myApp.welcomeController',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
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
        });

    $routeProvider.otherwise({redirectTo: '/'});
}]);
