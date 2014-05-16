angular.module('genconEvents').controller('EventListCtrl',function($scope,$stateParams,events){

	$scope.groupValue = $stateParams.groupValue;
	$scope.groupKey = $stateParams.groupKey;

	events.getEventsGroupThenGroupedByTitle($stateParams.groupKey,$stateParams.groupValue).then(function(group){
		$scope.eventsGroup = group;
	});

});