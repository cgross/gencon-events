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
        url: '/events',
        views: {
            'menuContent': {
                templateUrl: 'partial/event-list/event-list.html'
            }
        }
    });
    $stateProvider.state('app.event', {
        url: '/event',
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

angular.module('genconEvents').controller('MainCtrl',function($scope,$http,$state,$ionicSideMenuDelegate){

    $scope.groupKey = 'eventType';
    var allEvents;

    $http.get('events.json').then(function(response){
        allEvents = response.data.events;
        $scope.groups = _.groupBy(allEvents,$scope.groupKey);
    });

    $scope.getGroupTitle = function(groupName){
        if (groupName.indexOf('Non-Collectible') !== -1){
            return 'Non-Collectible Card Game';
        }
        if ($scope.groupKey === 'eventType'){
            return groupName.substring(6);
        }
        return groupName;
    };

    $scope.groupSelected = function(group,events){
        $scope.groupName = $scope.getGroupTitle(group);
        $scope.eventsGroup = _.groupBy(events,'title');
    };

    $scope.eventSelected = function(events){
        $scope.events = events;
    };

    $scope.detailKeysWhitelist = [
        // {key:'group',value:'Group'},
        // {key:'gameSystem',value:'Game System'},
        // {key:'rulesEdition',value:'Rules Edition'},
        {key:'minimumPlayers',value:'Min Players'},
        {key:'maximumPlayers',value:'Max Players'},
        // {key:'ageRequired',value:'Age Req\'d'},
        {key:'experience Required',value:'Exp Req\'d'},
        // {key:'materialsProvided',value:'Materials Provided'},
        // {key:'gmNames',value:'GM'},
        {key:'cost',value:'Cost'},
        {key:'location',value:'Location'},
        {key:'roomName',value:'Room Name'},
        {key:'tableNumber',value:'Table Number'},
        {key:'ticketsAvailable',value:'Tickets Available'}
    ];

    $scope.times = {
        all:true,
        wedMorn:true,
        wedAfter:true,
        thursMorn:true,
        thursAfter:true,
        friMorn:true,
        friAfter:true,
        satMorn:true,
        satAfter:true,
        sunMorn:true,
        sunAfter:true
    };

    $scope.search = {text:''};

    $scope.allTimes = function(){
        var value = !$scope.times.all;
        _.chain($scope.times).keys().each(function(key){
            $scope.times[key] = value;
        });
    };

    var searchTextPredicate = function(event){
        if (_.str.isBlank($scope.search.text)) {
            return true;
        }

        var words = $scope.search.text.toLowerCase().split(' ');
        var found = false;
        _.each(words,function(word){
            if (found){
                return;
            }
            if (event.title.toLowerCase().indexOf(word) !== -1 ||
                event.shortDescription.toLowerCase().indexOf(word) !== -1 ||
                event.longDescription.toLowerCase().indexOf(word) !== -1 ||
                event.group.toLowerCase().indexOf(word) !== -1 ||
                event.eventType.toLowerCase().indexOf(word) !== -1 ||
                event.gameSystem.toLowerCase().indexOf(word) !== -1 ||
                event.gmNames.toLowerCase().indexOf(word) !== -1 ||
                event.specialCategory.toLowerCase().indexOf(word) !== -1){
                found = true;
            }
        });
        return found;
    };

    var timePredicate = function(event){
        if ($scope.times.all){
            return true;
        }

        var day = event.startDateTime.substring(3,5);
        if (day === '13'){
            day = 'wed';
        } else if (day === '14'){
            day = 'thurs';
        } else if (day === '15'){
            day = 'fri';
        } else if (day === '16'){
            day = 'sat';
        } else {
            day = 'sun';
        }

        var time = event.startDateTime.substring(17,18) === 'A' ? 'Morn' : 'After';

        return $scope.times[day + time];
    };

    $scope.applyFilter = function(){

        var events = _.chain(allEvents)
            .filter(searchTextPredicate)
            .filter(timePredicate)
            .value();

        $scope.groups = _.groupBy(events,$scope.groupKey);
        $ionicSideMenuDelegate.toggleLeft();
        $state.go('app.home');
    };

    $scope.clearFilter = function(){
        $scope.search.text = '';
        _.each($scope.times,function(value,key){
            $scope.times[key] = true;
        });
    };

});
