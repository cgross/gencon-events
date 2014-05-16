angular.module('genconEvents').factory('events',function($http) {

	var eventsService = {};

	var eventsPromise;

	var filter = {text:'',times:{all:true}};

	var groupedByPromise;
	var groupedByKey;

	var groupKeyValuePromise;
	var groupKeyValuePromiseKey;
	var groupKeyValuePromiseValue;

	eventsService.getEvents = function(){
		if (!eventsPromise){
			eventsPromise = $http.get('events.json').then(function(response){
				return _.chain(response.data.events)
		            .filter(searchTextPredicate.bind(undefined,filter))
		            .filter(timePredicate.bind(undefined,filter))
		            .value();
			});
		}
		return eventsPromise;
	};

	eventsService.getEventsGroupedBy = function(groupKey){
		if (!groupedByPromise || groupKey !== groupedByKey){
			groupedByPromise = eventsService.getEvents().then(function(events){
				return _.groupBy(events,groupKey);
			});
			groupedByKey = groupKey;
		}
		return groupedByPromise;
	};

	eventsService.getEventsGroupThenGroupedByTitle = function(groupKey,groupValue){
		if (!groupKeyValuePromise ||
			!(groupKey === groupKeyValuePromiseKey && groupValue === groupKeyValuePromiseValue)){

			groupKeyValuePromise = eventsService.getEventsGroupedBy(groupKey).then(function(groups){
				return _.groupBy(groups[groupValue],'title');
			});
			groupKeyValuePromiseKey = groupKey;
			groupKeyValuePromiseValue = groupValue;
		}
		return groupKeyValuePromise;
	};

	eventsService.getEvent = function(groupKey,groupValue,eventTitle){
		return eventsService.getEventsGroupThenGroupedByTitle(groupKey,groupValue).then(function(groups){
			return groups[eventTitle];
		});
	};

	eventsService.applyFilter = function(newFilter){
		filter = newFilter;
		eventsPromise = null;
		groupedByPromise = null;
		groupedByKey = null;
		groupKeyValuePromise = null;
		return;
	};

    var searchTextPredicate = function(filter,event){
        if (_.str.isBlank(filter.text)) {
            return true;
        }

        var words = filter.text.toLowerCase().split(' ');
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

    var timePredicate = function(filter,event){
        if (filter.times.all){
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

        return filter.times[day + time];
    };


	return eventsService;
});