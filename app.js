angular.module('genconEvents', ['ionic']);

angular.module('genconEvents').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('app',{
        url:'/app',
        abstract:true,
        templateUrl:'partial/sidemenu/sidemenu.html'
    });
    $stateProvider.state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'partial/home/home.html'
            }
        }
    });
    $stateProvider.state('app.events', {
        url: '/events?groupKey&groupValue',
        views: {
            'menuContent': {
                templateUrl: 'partial/event-list/event-list.html'
            }
        }
    });
    $stateProvider.state('app.event', {
        url: '/event?title&groupKey&groupValue',
        views: {
            'menuContent': {
                templateUrl: 'partial/event-detail/event-detail.html'
            }
        }
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('app/home');

});

angular.module('genconEvents').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
