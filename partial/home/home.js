angular.module('genconEvents').controller('HomeCtrl',function($scope,events){

	$scope.groupKey = 'eventType';

    events.getEventsGroupedBy($scope.groupKey).then(function(groups){
        $scope.groups = groups;
    });

    $scope.$on('refresh',function(){
	    events.getEventsGroupedBy($scope.groupKey).then(function(groups){
	        $scope.groups = groups;
	    });
    });

});