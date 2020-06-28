/* README
This is an example of a data module script for the COViz toolkit and can be used as a 
template to load different data sources into a website that is based on the toolkit. 
New data sources will show up in the data source option selector.

To create a new data source:
1. Create a new subfolder inside the "data" folder.
2. Copy this file into the subfolder.
3. Copy any local data files (e.g. geojson files) into the same subfolder
4. Edit this script file as needed to obtain data from a different source. 
    (A) This script must define a single "constant" using the following structure:
		const <new_data_constant> = {
			dataSourceName: <string>,
			dataFunc: <Promise function>
		}
	(B) The Promise function must resolve to a data object with a structure as defined at the end 
		of this script (towards the bottom; look for "THE_DATA_OBJECT").
	(C) You should retain the same basic structure for the Promise function. This structure 
		is designed to make sure everything occurs in the right sequence. 
	(D) Please read the comments inside the Promise function for details.
    
5. In index.html:
    (A) add a reference to the script in the beginning, i.e. another line like:
	 <script src="data/states_covidtracking/data_covidtracking_states.js"></script>
	(B) add the new data constant to the dataSources array 
	  (near the beginning of the script below the last div in index.html)

// The following lines avoid errors in some browsers	
*/
/* eslint-env es6 */
/* eslint-disable */

// THE DATA SOURCE IS A NEW CONSTANT AND MUST HAVE A UNIQUE NAME
const dataCovidTracking_states={
	dataSourceName: "US States", // THIS NAME WILL APPEAR IN THE DROP-DOWN SELECTOR
	dataFunc: new Promise(function(resolve, reject){
		// OBJECT TO HOLD ALL SOURCE DATASETS
		var src = {};
		// NUMBER OF SOURCE DATASETS TO BE ACQUIRED
		var target_length = 3;
		
		// GET SOURCE DATASET (map polygons)
		// Typically this will be a geojson file placed in the same folder, 
		// and you can use JQuery's getJSON function:
		$.getJSON("data/states_covidtracking_TEMPLATE/states.geojson", function(src_data) {
			console.log("got map polygons...")
			src.map_polys = src_data; // add to src object
			process_data(); // attempt to process all datasets
		});

		// GET SOURCE DATASET (cartogram polygons)
		// Typically this will be a geojson file placed in the same folder, 
		// and you can use JQuery's getJSON function:
		$.getJSON("data/states_covidtracking_TEMPLATE/states_cartogram.geojson", function(src_data) {
			console.log("got cartogram polys...")
			src.carto_polys = src_data; // add to src object
			process_data(); // attempt to process all datasets
		});			

		// GET SOURCE DATASET (tabular data)
		// Typically this will be a data service that provides data in the form of a geojson
		// object or a CSV file. The example below is for a geojson service

		$.getJSON("https://covidtracking.com/api/v1/states/daily.json", function(src_data) {
			console.log("got tabular data...")
			src.tab_data = src_data; // add to src object
			process_data(); // attempt to process all datasets
		});			



		// PROCESS DATA AND RESOLVE PROMISE WITH A DATA OBJECT IN SET FORMAT
		// You will need to change the code in this function to process your 
		// data and produce variables conforming to the following data object structure:
		/*
		data_object = {
			baseFeatures: a geojson object of map polygons,
			cartogramFeatures: a geojson object of cartogram polygons,
			dates: an array of date strings obtained from a javascript Date object's 
				   toDateString() method, in temporal sequence. 
			districtIDs: array of district identifiers,
			variableNames: an array of variable names ,
			dateDistrictData: a nested data object containing data that 
							  can be accessed as 
							  "dateDistrictData[<dateID>][<districtID>][<variableName>]",
			getID: a function that returns the districtID of a feature in baseFeatures,
			getLabel: a function that returns a label for the feature on the map,
			getPopulation: a function that returns the population of a feature in baseFeatures
		}   
		*/
		function process_data(){
			// The following if statement makes sure that processing occurs only
			// after all data has been acquired
			if (Object.keys(src).length == target_length){
				console.log("processing all datasets...");
				// DEFINE AN ARRAY OF DATES IN TEMPORAL SEQUENCE												
				var dates = new Set();
				
				function parseDateString(dateString){
					var dateInteger = parseInt(dateString);
					var year = Math.floor(dateInteger/10000);	
					var dateInteger = dateInteger-year*10000;
					var month = Math.floor(dateInteger/100);
					var day = dateInteger - month*100;
					return new Date(year, month-1,day,0,0,0,0).toDateString();
				}			
				
				for(let i=0; i < src.tab_data.length; i++){
					var thisDateString = src.tab_data[i]["date"];
					thisDate = parseDateString(thisDateString);
					dates.add(thisDate);
					}
				dates=Array.from(dates).reverse();
				
				// DEFINE AN ARRAY OF DISTRICT IDs
				var districtIDs = new Set();
				for(let i=0; i < src.map_polys.features.length; i++){
					districtIDs.add(src.map_polys.features[i].properties["ABBREV"]);
					}
				districtIDs = Array.from(districtIDs);
				
				// DEFINE THE VARIABLES THAT WILL BE PROVIDED
				var variableNames = ["cases","tests","deaths"]
				// You should always use variable names in "data/data_dictionary.txt" if 
				// possible, as this will allow your data to be displayed with existing map themes.
				// If you want to create a new variable:
				// 1. Add your new variable name to "data/data_dictionary.txt"
				// 2. You will need to create a new map theme to display your variable

		
				// ARRANGE DATA INTO A VARIABLE "dateDistrictData" WITH THE FORM:
				// dateDistrictData[date][districtID][variableName] = <some value>


				// *********************************************
				// If you used the variables "dates" and "districtIDs" above, 
				// You shouldn't need to change the code from here to the next line of asterisks
				//
				// Create dictionary of values for each date
				// initializing each date value to an empty dictionary
				var dateDistrictData = {};
				for(let i=0; i < dates.length; i++){
					dateDistrictData[dates[i]]={};
					}
				// populate dateDistrictData with dummy values for each date/state
				for(let i=0; i < dates.length; i++){
					var cur_date = dates[i];
					var cur_record = dateDistrictData[cur_date];
					for(let j=0; j < districtIDs.length; j++){
						cur_districtID = districtIDs[j];
						cur_record[cur_districtID] = {};
					}
				}
				// *********************************************
				
				// go through src.tab_data object and transfer values into dateDistrictData object
				for(let i=0; i < src.tab_data.length; i++){
					// get date and state
					var cur_date = parseDateString(src.tab_data[i]["date"]);
					var cur_districtID = src.tab_data[i]["state"];										
					if(dateDistrictData[cur_date] != undefined){
						if(dateDistrictData[cur_date][cur_districtID] != undefined){											
							// transfer to vals object
							dateDistrictData[cur_date][cur_districtID]['cases'] = src.tab_data[i]["positive"];
							dateDistrictData[cur_date][cur_districtID]['tests'] = src.tab_data[i]["positive"] + src.tab_data[i]["negative"];
							dateDistrictData[cur_date][cur_districtID]['deaths'] = src.tab_data[i]["death"];
						}
					}
				}
				// for this data, any negative numbers or null values should be interpreted as zeroes
				for(let i=0; i < dateDistrictData.length; i++){
					for(let j=0; j < districtIDs.length; j++){
						for(let k=0; k < dateDistrictData.length; k++){
							val = dateDistrictData[i][j][k];
							if( val < 0 || val == undefined){
								dateDistrictData[i][j][k] = 0;
							}
						}
					}
				}
				
				// THE DATA OBJECT
				the_data_object = {
					baseFeatures: src.map_polys, 
					cartogramFeatures: src.carto_polys, 
					dates: dates, 
					districtIDs: districtIDs, 
					variableNames: variableNames, 
					dateDistrictData: dateDistrictData, 
					getID: function(feat){return feat.properties.ABBREV;}, 
					getLabel: function(feat){return feat.properties.STATE_NAME;}, 
					getPopulation: function(feat){return feat.properties.POP_2010;}, 
				}
				resolve(the_data_object);

			} // end of "if (Object.keys(src).length == 3){"
		} // end of "function process_data(){"								
	}) // end of "new Promise(function(resolve, reject){"
}; // end of "const dataCovidTracking_states={