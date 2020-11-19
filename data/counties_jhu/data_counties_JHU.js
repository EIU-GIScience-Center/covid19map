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

// The following lines avoid case_errors in some browsers	
*/
/* eslint-env es6 */
/* eslint-disable */

// THE DATA SOURCE IS A NEW CONSTANT AND MUST HAVE A UNIQUE NAME
function dataJHU_USA_Counties(){return {
	dataSourceName: "USA Counties", // THIS NAME WILL BE USED FOR IDENTIFICATION, AND APPEAR IN THE DROP-DOWN SELECTOR
	                       // IF THE NEXT PROPERTY IS TRUE
	showInSelector: false, // ONLY SHOW HIGHEST-LEVEL GEOGRAPHIES IN SELECTOR
	dataFunc: new Promise(function(resolve, reject){
		// OBJECT TO HOLD ALL SOURCE DATASETS
		var src = {};
		// NUMBER OF SOURCE DATASETS TO BE ACQUIRED
		var cart_states = {"AL":"Alabama", "CO":"Colorado", "FL":"Florida","GA":"Georgia","ID":"Idaho", 
							"IA":"Iowa", "LA":"Louisiana", "MS":"Mississippi", "NH":"New Hampshire"};
		var stateIDs = Object.keys(cart_states);
		var num_states = stateIDs.length;
		var target_length = num_states*2+3;
		
		// get geoJSONs one after the other so that the variables don't update in between
		function getGeoJsons(id){
			console.log("Getting geojsons #" + id);
			if(id<num_states){
				var stateID = stateIDs[id];
				var stateName = cart_states[stateID];
				 
				$.getJSON("data/counties_JHU/geojson/" + stateName + "_counties.geojson", function(src_data) {
					console.log("got " + stateName + " counties...")
					src[stateID] = src_data; // add to src object
					$.getJSON("data/counties_JHU/geojson/" + stateName + "_counties_cartogram.geojson", function(src_data) {
						console.log("got " + stateName + " cartogram...")
						src[stateID + "_cartogram"] = src_data; // add to src object
						getGeoJsons(id+1);
						process_data(); // attempt to process all datasets
					});	
				});
			}
		}

		getGeoJsons(0);


		// GET SOURCE DATASET (all polygons)
		// Typically this will be a geojson file placed in the same folder
		$.getJSON("data/counties_JHU/geojson/USA_counties.geojson", function(src_data) {
			console.log("got map polygons...")
			src.all_counties = src_data; // add to src object
			process_data(); // attempt to process all datasets
		});

		// GET SOURCE DATASET (case data)
		// Typically this will be a data service that provides data in the form of a geojson
		// object or a CSV file. The example below is for a CSV file, and uses JQuery and PapaParse	
		$.ajax({
			type: "GET",
			url: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv',
			dataType: "text",
			success: function(src_data) {
				console.log("got JHU county case data...");
				src.case_data = Papa.parse(src_data, {header: true}); // add to src object
				process_data(); // attempt to process all datasets
			}
		});
	

		// GET SOURCE DATASET (death data)
		// Typically this will be a data service that provides data in the form of a geojson
		// object or a CSV file. The example below is for a CSV file, and uses JQuery and PapaParse	
		$.ajax({
			type: "GET",
			url: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv',
			dataType: "text",
			success: function(src_data) {
				console.log("got JHU county death data...");
				src.death_data = Papa.parse(src_data, {header: true}); // add to src object
				process_data(); // attempt to process all datasets
			}
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
			console.log("Processing data...");
			console.log(Object.keys(src).length);
			if (Object.keys(src).length == target_length){
				console.log("processing all JHU county datasets...");
				console.log(src);
				// get tabular data from JHU object
				var case_data = src.case_data.data;
				var death_data = src.death_data.data;
				// find any rows with case_errors from tabular data
				var case_error_rows = [];
				var death_error_rows = [];
				var case_errors = src.case_data.errors;
				var death_errors = src.death_data.errors;
				if(case_errors != undefined && case_errors != null){
					for(i=0;i<case_errors.length;i++){
						if(case_errors[i].row != undefined && case_errors[i].row != null){
							case_error_rows.push(case_errors[i].row);
						}
					}
				}
				if(death_errors != undefined && death_errors != null){
					for(i=0;i<death_errors.length;i++){
						if(death_errors[i].row != undefined && death_errors[i].row != null){
							death_error_rows.push(death_errors[i].row);
						}
					}
				}
				// should be just one row; just in case, remove them all
				for(i=case_error_rows.length-1;i>=0;i--){
					case_data.splice(case_error_rows[i],1);
				}
				// should be just one row; just in case, remove them all
				for(i=death_error_rows.length-1;i>=0;i--){
					death_data.splice(death_error_rows[i],1);
				}
				
				// DEFINE AN ARRAY OF DATES IN TEMPORAL SEQUENCE																
				var dateStrings = Object.keys(case_data[0]); // pull out keys from first row of data
				dateStrings.splice(0,11); // dates are the keys starting from item 11
				function JHUdateFromString(dateString){
					var pieces = dateString
									.split("/")
									.map(function(piece){return parseInt(piece);});
					var month = pieces[0];
					var day = pieces[1];
					var year = 2000 + pieces[2];
					var this_date = new Date(year, month-1, day,0,0,0,0).toDateString();
					return this_date;
				}
				function covizDateFromString(dateString){
					var pieces = dateString
									.split("/")
									.map(function(piece){return parseInt(piece);});
					var month = pieces[0];
					var day = pieces[1];
					var year = 2000 + pieces[2];
					var this_date = new Date(year, month-1, day,0,0,0,0).toDateString();
					return this_date.slice(4,-5) + "," + this_date.slice(-5);
				}
				
				// array of dates used in the JHU file
				var JHUdates = dateStrings.map(JHUdateFromString);
				// array of dates to use in COViz
				var CovizDates = dateStrings.map(covizDateFromString);
				
				
				// DEFINE AN ARRAY OF DISTRICT IDs
				var districtIDs = [];
				for(let i=0; i < case_data.length; i++){
					var cur_row = case_data[i];
					//if(cur_row.Province_State == "Georgia"){
							districtIDs.push(cur_row.Combined_Key);
					//}
				}
				
				// DEFINE THE VARIABLES THAT WILL BE PROVIDED
				var variableNames = ["cases","deaths"]
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
				// create dictionary of values for each date
				// initializing each date value to an empty dictionary
				var dateDistrictData = {};
				for(let i=0; i < CovizDates.length; i++){
					dateDistrictData[CovizDates[i]]={};
					}
				// populate dateDistrictData with dummy values for each date/district
				for(let i=0; i < CovizDates.length; i++){
					var cur_date = CovizDates[i];
					var cur_record = dateDistrictData[cur_date];
					for(let j=0; j < districtIDs.length; j++){
						cur_districtID = districtIDs[j];
						cur_record[cur_districtID] = {};
					}
				}
				// *********************************************
			
				// go through src.case_data object and transfer values into dateDistrictData object
				for(let i=0; i < case_data.length; i++){ // loop through table rows
					var cur_row = case_data[i]; // get data record
					//if(cur_row.Province_State == "Georgia"){ // check that it is in Georgia
						var cur_districtID = cur_row.Combined_Key; // get district id 
						for(let j=0; j < CovizDates.length; j++){ // loop through dates
							if(dateDistrictData[CovizDates[j]] != undefined){
								if(dateDistrictData[CovizDates[j]][cur_districtID] != undefined){											
									// transfer values to dateDistrictData object
									dateDistrictData[CovizDates[j]][cur_districtID]['cases'] = parseInt(case_data[i][dateStrings[j]]);
								}
							}
						}
					//}
				}

				// go through src.death_data object and transfer values into dateDistrictCata object
				for(let i=0; i < death_data.length; i++){ // loop through table rows
					var cur_row = death_data[i]; // get data record
					//if(cur_row.Province_State == "Georgia"){ // check that it is in Georgia
						var cur_districtID = cur_row.Combined_Key; // get district id 
						for(let j=0; j < CovizDates.length; j++){ // loop through dates
							if(dateDistrictData[CovizDates[j]] != undefined){
								if(dateDistrictData[CovizDates[j]][cur_districtID] != undefined){											
									// transfer values to dateDistrictData object
									dateDistrictData[CovizDates[j]][cur_districtID]['deaths'] = parseInt(death_data[i][dateStrings[j]]);
								}
							}
						}
					//}
				}			
				
				// THE DATA OBJECT
				the_data_object = {
					briefDescription: "Data from the <a href='https://github.com/CSSEGISandData/COVID-19'>John Hopkins University Center for Systems Science and Engineering (JHU CSSE) COVID-19 Data Repository</a>.",
					baseFeatures: function(filter=null){
						if(filter==null){
							return src.all_counties;
						/*} else if (filter=="GA") {
							return src.Georgia_counties;
						} else if (filter=="FL") {
							return src.florida_counties;*/
						} else if (stateIDs.includes(filter)) {
							return src[filter];
						} else {
							var this_state = src.all_counties;
							this_state = JSON.parse(JSON.stringify(this_state)) // clone object
							this_state.features = this_state.features.filter(feat => feat.properties.StateAbbre==filter);
							return this_state;
						}
					},
					cartogramFeatures: function(filter=null){
						if(filter==null){
							return null;						
						/*} else if (filter=="GA") {
							return src.Georgia_cartogram;
						} else if (filter=="FL") {
							return src.florida_cartogram;*/
						} else if (stateIDs.includes(filter)) {
							return src[filter + "_cartogram"];
						} else {
							return null;
						}
					},
					defaultFilter: "GA",
					dataChildName: null,
					dataParentName: "USA",
					dates: CovizDates, 
					districtIDs: districtIDs, 
					variableNames: variableNames, 
					dateDistrictData: dateDistrictData, 
					getID: function(feat){return feat.properties.JHU_key;}, 
					getLabel: function(feat){return feat.properties.CensusName;}, 
					getPopulation: function(feat){return feat.properties.pop2018;}, 
					aggregateLabel: function(){
						if(dataSourceFilter==null){
							return "filter is null!!!";
						} else {
							return dataSourceFilter;
						}
					}		
				}

				resolve(the_data_object);

			} // end of "if (Object.keys(src).length == 3){"
		} // end of "function process_data(){"								
	}) // end of "new Promise(function(resolve, reject){"
}
}; // end of function dataCovidTracking_states=