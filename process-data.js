/*jslint node: true */
var csv = require('csv');
var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var moment = require('moment');

var data = {events:[]};

csv()
.from.stream(fs.createReadStream('events.txt'),{delimiter:'\t',columns:true})
.transform(function(row,index){
	var newItem = {};
	_.each(_.keys(row),function(key){
		var newKey = key
		  .replace(/[^a-zA-Z ]/g, "")
		  .toLowerCase();
		newKey = _s.camelize(newKey);
		newItem[newKey] = row[key];
	});

	var m = moment(newItem.startDateTime,"MM/DD/YYYY hh:mm A");
	newItem.shortStart = m.format('ddh:m:a').replace(':0:','');

	data.events.push(newItem);
})
.on('end',function(){

	var grouped = _.groupBy(data.events,'title');

	fs.writeFileSync('events.json',JSON.stringify(data,undefined,2));
});