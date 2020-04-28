// A data source. 

// LOAD FEATURES
console.log("GETTING FEATURES...");
var dataCovidTracking_states={
	dataSourceName: "US States",
	dataFunc: new Promise(
		function(resolve, reject){
			// load base features
			$.getJSON(
				"data/states_covidtracking/states.geojson", function(data) {
					var states_base=data;
					// load cartogram features (or set to null)
					$.getJSON(
						"data/states_covidtracking/states_cartogram.geojson", function(data) {
							var states_cartogram=data;	
							// load tabular data
							$.getJSON(
								'https://covidtracking.com/api/states/daily', function(data) {
									//data is the JSON string
									// get list of unique dates												
									var dates = new Set();
									for(let i=0; i < data.length; i++){
										dates.add(data[i]["date"]);
										}
									dates=Array.from(dates).reverse();
									// create dictionary of values for each date
									// initializing each date value to an empty dictionary
									var vals = {};
									for(let i=0; i < dates.length; i++){
										vals[dates[i]]={};
										}
									// get unique list of states
									var stateIDs = new Set();
									for(let i=0; i < states_base.features.length; i++){
										stateIDs.add(states_base.features[i].properties["ABBREV"]);
										}
									stateIDs = Array.from(stateIDs);
									// populate vals array with dummy values for each date/state
									for(let i=0; i < dates.length; i++){
										var cur_date = dates[i];
										var cur_record = vals[cur_date];
										for(let j=0; j < stateIDs.length; j++){
											cur_stateID = stateIDs[j];
											cur_record[cur_stateID] = {};
										}
									}

									// go through data object and transfer values into vals object
									for(let i=0; i < data.length; i++){
										// get date and state
										var cur_date = data[i]["date"];
										var cur_stateID = data[i]["state"];
										var curValObj = vals[cur_date][cur_stateID];
										if(curValObj != undefined){
											// transfer to vals object
											vals[cur_date][cur_stateID]['positive'] = data[i]["positive"];
											vals[cur_date][cur_stateID]['negative'] = data[i]["negative"];
											vals[cur_date][cur_stateID]['death'] = data[i]["death"];
										}
									}
									
									// THE DATA OBJECT
									the_data_object = {
										baseFeatures: states_base,
										cartogramFeatures: states_cartogram,
										dates: dates,
										districtIDs: stateIDs,
										dateDistrictData: vals,
										getID: function(feat){return feat.properties.ABBREV;},
										getPopulation: function(feat){return feat.properties.POP_2010;},
										getValue: function(feat, date, varname){
											var featID = feat.properties.ABBREV;
											var val = dateDistrictData[date][featID][varname];
											if(val<0){val=0;}
											if(val==undefined){val=0;}
											return val;
										}
									}
									resolve(the_data_object);
								}
							) // got data from covidtracking.org
							.fail( 
								function(d, textStatus, error) {
									console.error("failed to get data from covidtracking.org, status: " + textStatus + ", error: "+error)
								}
							);  
						}
					)
				} // got features as geojson object
			).fail( 
				function(d, textStatus, error) {
					console.error("getJSON failed, status: " + textStatus + ", error: "+error)
				}
			);

		}
	)
};


	