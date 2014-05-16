angular.module('genconEvents').controller('EventDetailCtrl',function($scope,$stateParams,events){

	$scope.groupKey = $stateParams.groupKey;
	$scope.groupValue = $stateParams.groupValue;
	$scope.title = $stateParams.title;

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

    events.getEvent($stateParams.groupKey,$stateParams.groupValue,$stateParams.title).then(function(events){
		$scope.events = events;
    });

});