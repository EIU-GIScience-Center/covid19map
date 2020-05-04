/* README
This is an example of a data module script for the COViz toolkit and can be used as a 
template to load different data sources into a website that is based on the toolkit. 
New data sources will show up in the data source option selector.

To create a new data source:
1. Create a new subfolder inside the data folder.
2. Copy this file into the subfolder, and rename the file as appropriate.
3. Copy any local data stores (e.g. geojson files) into the same subfolder
4. Edit this script file as needed to obtain data from a different source. 
   You will need to retain the same basic structure. That is, the script must 
   define a single "constant" with the following structure:
	<new_data_constant> = {
		dataSourceName: <string>,
		dataFunc: <Promise function>
	}
   The Promise function must resolve to a data object with a structure as defined below 
	(towards the bottom; look for "THE_DATA_OBJECT"). Note that all data must be obtained
	at the time the promise function is resolved.

   To make this work, you are encouraged to retain the basic structure of this script file,
    modifying only the sections needed to obtain data from a different source and 
	rearrange the data into the required structure.

   You should also use existing variable names (see "data_dictionary.txt") if they can  
    appropriately refer to your data. If you create any new variable names, you will need
	to create a new theme to display that variable.
	
5. In index.html:
    - add a reference to the script in the beginning, i.e. another line like:
	 <script src="data/states_covidtracking/data_covidtracking_states.js"></script>
	- add the new data constant to the dataSources array 
	  (near the beginning of the script below the last div in index.html)

	
*/

// THE DATA SOURCE IS A NEW CONSTANT AND MUST HAVE A UNIQUE NAME
const dataCovidTracking_states={
	dataSourceName: "US States",
	dataFunc: new Promise(
		function(resolve, reject){
			// THE BASE FEATURES WILL TYPICALLY BE STORED IN A LOCAL GEOJSON FILE,
			// WHICH YOU CAN LOAD WITH JQUERY
			$.getJSON(
				"data/states_covidtracking/states.geojson", function(data) {
					// save the base features to a variable
					var states_base=data;
					// THE CARTOGRAM FEATURES (OPTIONAL) WILL ALSO TYPICALLY BE STORED
					// IN A LOCAL GEOJSON FILE
					// IF YOU HAVE NO CARTOGRAM, YOU CAN SET THE CARTORAM FEATURES TO null BELOW.
					$.getJSON(
						"data/states_covidtracking/states_cartogram.geojson", function(data) {
							// save the cartogram features to a variable
							var states_cartogram=data;	
							// TABULAR DATA IS LOADED FROM AN EXTERNAL SOURCE
							$.getJSON(
								'https://covidtracking.com/api/v1/states/daily.json', function(json_data) {
									//data is the JSON string
									
									// DEFINE AN ARRAY OF DATES IN TEMPORAL SEQUENCE												
									var dates = new Set();
									for(let i=0; i < json_data.length; i++){
										var thisDate = json_data[i]["date"];
										dates.add(thisDate);
										}
									dates=Array.from(dates).reverse();
									
									// DEFINE AN ARRAY OF DISTRICT IDs
									var stateIDs = new Set();
									for(let i=0; i < states_base.features.length; i++){
										stateIDs.add(states_base.features[i].properties["ABBREV"]);
										}
									stateIDs = Array.from(stateIDs);
									
									// DEFINE THE VARIABLES THAT WILL BE PROVIDED
									// ALWAYS USE VARIABLE NAMES IN "data_dictionary.txt" IF POSSIBLE
									// (OR ADD NEW ENTRIES TO THE DICTIONARY IF YOU OBTAIN A NEW TYPE OF DATA)
									var variableNames = ["cases","tests","deaths"]
							
									// ARRANGE DATA INTO A VARIABLE "dateDistrictData" WITH THE FORM:
									// dateDistrictData[date][districtID][variableName] = <some value>

									// create dictionary of values for each date
									// initializing each date value to an empty dictionary
									var dateDistrictData = {};
									for(let i=0; i < dates.length; i++){
										dateDistrictData[dates[i]]={};
										}
									// populate dateDistrictData with dummy values for each date/state
									for(let i=0; i < dates.length; i++){
										var cur_date = dates[i];
										var cur_record = dateDistrictData[cur_date];
										for(let j=0; j < stateIDs.length; j++){
											cur_stateID = stateIDs[j];
											cur_record[cur_stateID] = {};
										}
									}
									// go through json_data object and transfer values into dateDistrictData object
									for(let i=0; i < json_data.length; i++){
										// get date and state
										var cur_date = json_data[i]["date"];
										var cur_stateID = json_data[i]["state"];										
										if(dateDistrictData[cur_date] != undefined){
											if(dateDistrictData[cur_date][cur_stateID] != undefined){											
												// transfer to vals object
												dateDistrictData[cur_date][cur_stateID]['cases'] = json_data[i]["positive"];
												dateDistrictData[cur_date][cur_stateID]['tests'] = json_data[i]["positive"] + json_data[i]["negative"];
												dateDistrictData[cur_date][cur_stateID]['deaths'] = json_data[i]["death"];
											}
										}
									}
									// THE DATA OBJECT
									/*
									The data object should have the following structure:
									data_object = {
										baseFeatures: geojson feature collection,
										cartogramFeatures: geojson feature collection (or null),
										dates: array of date identifiers in temporal sequence,
										districtIDs: array of district identifiers,
										dateDistrictData: an object or array containing the data values,
										getID: a function that returns the ID of an input feature,
										getPopulation: a function that returns the population of an input feature,
										getValue: a function that returns the value for a given variable
										          in a given district on a given date
									}   
									*/
									the_data_object = {
										baseFeatures: states_base,
										cartogramFeatures: states_cartogram,
										dates: dates,
										districtIDs: stateIDs,
										variableNames: variableNames,
										dateDistrictData: dateDistrictData,
										getID: function(feat){return feat.properties.ABBREV;},
										getPopulation: function(feat){return feat.properties.POP_2010;},
										getValue: function(dateDistrictData,featID, date, varname){
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


	