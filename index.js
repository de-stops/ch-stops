const got = require('got');
const csv = require('csv');

const didok_liste_url = "https://data.sbb.ch/explore/dataset/didok-liste/download/?format=csv&timezone=Europe/Berlin&use_labels_for_header=true"

const queryStops = function(url) {

	return new Promise(function(resolve, reject){
		got(url, {
			headers: {
				'Accept' : '*/*'
			}
		})
		.then(response => {
			csv.parse(response.body, {columns: true, delimiter: ";"}, function(err, stops) {
				if (err) {
					reject(err);
				}
				else {
					resolve(stops);
				}
			});
		})
		.catch(error => {
			reject(error);
		});
	});
};

const convertStops = function(stops) {
	return stops.map(convertStop);
};

const convertStop = function(stop) {
	const latLon = stop.geopos.split(",");

	return {
		stop_id : stop.Nummer,
		stop_name : stop.Name,
		stop_lon : latLon[1],
		stop_lat : latLon[0],
		stop_code : ""
	};
};

const removeStopsWithoutCoordinates = function(stops) {
	return stops.filter(stop => stop.stop_lon && stop.stop_lat);
};

const removeDuplicateStops = function(stops) {
	const filteredStops = [];
	const stopsById = {};

	stops.forEach(stop => {
		const existingStop = stopsById[stop.stop_id];
		if (existingStop) {
			if (	stop.stop_id !== existingStop.stop_id ||
				stop.stop_name !== existingStop.stop_name ||
				stop.stop_lon !== existingStop.stop_lon ||
				stop.stop_lat !== existingStop.stop_lat)
			{
				// console.log("Duplicate but different stop.");
				// console.log("Existing stop:", existingStop);
				// console.log("Duplicate stop:", stop);
			}
		}
		else {
			stopsById[stop.stop_id] = stop;
			filteredStops.push(stop);
		}
	});
	return filteredStops;
};

const sortStops = function(stops) {
	return stops.sort((s1, s2) => s1.stop_id < s2.stop_id);
};

const outputStops = function(stops) {
	csv.stringify(stops, {header: true, quotedString: true, columns: ["stop_id", "stop_name", "stop_lon", "stop_lat", "stop_code"]}, function(err, data){
		process.stdout.write(data);
	});
}

const exportStops = function()  {
	queryStops(didok_liste_url)
	.then(convertStops)
	.then(removeStopsWithoutCoordinates)
	.then(removeDuplicateStops)
	.then(sortStops)
	.then(outputStops)
	.catch(error => console.log(error));
};

exportStops();
