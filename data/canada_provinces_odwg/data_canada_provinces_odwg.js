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
function dataODWG_Canada_Provinces(){return {
	dataSourceName: "Canada", // THIS NAME WILL APPEAR IN THE DROP-DOWN SELECTOR
	showInSelector: true, // ONLY SHOW HIGHEST-LEVEL GEOGRAPHIES IN SELECTOR
	dataFunc: new Promise(function(resolve, reject){
		// OBJECT TO HOLD ALL SOURCE DATASETS
		var src = {};
		// NUMBER OF SOURCE DATASETS TO BE ACQUIRED
		var target_length = 5;

		// GET SOURCE DATASET (map polygons)
		// Typically this will be a geojson file placed in the same folder, 
		// and you can use JQuery's getJSON function:
		$.getJSON("data/canada_provinces_odwg/Canada_provinces_simplified.geojson", function(src_data) {
			console.log("got map polygons...")
			src.map_polys = src_data; // add to src object
			process_data(); // attempt to process all datasets
		});

		// GET SOURCE DATASET (cartogram polygons)
		// Typically this will be a geojson file placed in the same folder, 
		// and you can use JQuery's getJSON function:
		$.getJSON("data/canada_provinces_odwg/Canada_provinces_simplified_cartogram.geojson", function(src_data) {
			console.log("got Canada cartogram polys...")
			src.carto_polys = src_data; // add to src object
			process_data(); // attempt to process all datasets
		});

		// GET SOURCE DATASET (case data)
		// Typically this will be a data service that provides data in the form of a geojson
		// object or a CSV file. The example below is for a CSV file, and uses JQuery and PapaParse
		$.ajax({
			type: "GET",
			url: 'https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/timeseries_prov/cases_timeseries_prov.csv',
			dataType: "text",
			success: function(src_data) {
				console.log("got Canada case data...");
				src.case_data = Papa.parse(src_data, {header: true}); // add to src object
				process_data(); // attempt to process all datasets
			}
		});

		// GET SOURCE DATASET (death data)
		// Typically this will be a data service that provides data in the form of a geojson
		// object or a CSV file. The example below is for a CSV file, and uses JQuery and PapaParse
		$.ajax({
			type: "GET",
			url: 'https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/timeseries_prov/mortality_timeseries_prov.csv',
			dataType: "text",
			success: function(src_data) {
				console.log("got Canada death data...");
				src.death_data = Papa.parse(src_data, {header: true}); // add to src object
				process_data(); // attempt to process all datasets
			}
		});

		// GET SOURCE DATASET (testing data)
		// Typically this will be a data service that provides data in the form of a geojson
		// object or a CSV file. The example below is for a CSV file, and uses JQuery and PapaParse
		$.ajax({
			type: "GET",
			url: 'https://raw.githubusercontent.com/ishaberry/Covid19Canada/master/timeseries_prov/testing_timeseries_prov.csv',
			dataType: "text",
			success: function(src_data) {
				console.log("got Canada testing data...");
				src.testing_data = Papa.parse(src_data, {header: true}); // add to src object
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
			if (Object.keys(src).length == target_length){
				console.log("processing all datasets... (CANADIAN)");
				// get tabular data from Canada Working Group object
				var case_data = src.case_data.data;
				var death_data = src.death_data.data;
				var testing_data = src.testing_data.data;

				// find any rows with case_errors from tabular data
				var case_error_rows = [];
				var death_error_rows = [];
				var testing_error_rows = [];
				var case_errors = src.case_data.errors;
				var death_errors = src.death_data.errors;
				var testing_errors = src.testing_data.errors;
				if(case_errors != undefined && case_errors != null){
					for(let i=0;i<case_errors.length;i++){
						if(case_errors[i].row != undefined && case_errors[i].row != null){
							case_error_rows.push(case_errors[i].row);
						}
					}
				}
				if(death_errors != undefined && death_errors != null){
					for(let i=0;i<death_errors.length;i++){
						if(death_errors[i].row != undefined && death_errors[i].row != null){
							death_error_rows.push(death_errors[i].row);
						}
					}
				}
				if(testing_errors != undefined && testing_errors != null){
					for(let i=0;i<testing_errors.length;i++){
						if(testing_errors[i].row != undefined && testing_errors[i].row != null){
							testing_error_rows.push(testing_errors[i].row);
						}
					}
				}
				// should be just one row; just in case, remove them all
				for(let i=case_error_rows.length-1;i>=0;i--){
					case_data.splice(case_error_rows[i],1);
				}
				// should be just one row; just in case, remove them all
				for(let i=death_error_rows.length-1;i>=0;i--){
					death_data.splice(death_error_rows[i],1);
				}
				// should be just one row; just in case, remove them all
				for(let i=testing_error_rows.length-1;i>=0;i--){
					testing_data.splice(testing_error_rows[i],1);
				}

				// DEFINE AN ARRAY OF DATES IN TEMPORAL SEQUENCE
				var dates = new Set();

				function dateFromString(dateString){
					var pieces = dateString
						.split("-")
						.map(function(piece){return parseInt(piece);});
					var day = pieces[0];
					var month = pieces[1];
					var year = pieces[2];
					var this_date = new Date(year, month-1, day,0,0,0,0).toDateString(); //why month-1???
					return this_date;
				}

				for(let i=0; i < case_data.length; i++){
					var thisDateString = case_data[i]["date_report"];
					thisDate = dateFromString(thisDateString);
					dates.add(thisDate);
				}
				dates=Array.from(dates)

				// DEFINE AN ARRAY OF DISTRICT IDs
				var districtIDs = new Set();
				for(let i=0; i < src.map_polys.features.length; i++){
					districtIDs.add(src.map_polys.features[i].properties["Cov19ID"]);
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
						// set values to zero initially
						dateDistrictData[cur_date][cur_districtID]['cases']=0;
						dateDistrictData[cur_date][cur_districtID]['tests']=0;
						dateDistrictData[cur_date][cur_districtID]['deaths']=0;
					}
				}
				// *********************************************

				// go through case_data object and transfer values into dateDistrictData object
				for(let i=0; i < case_data.length; i++){
					// get date and state
					var cur_date = dateFromString(case_data[i]["date_report"]);
					var cur_districtID = case_data[i]["province"];
					if(dateDistrictData[cur_date] != undefined){
						if(dateDistrictData[cur_date][cur_districtID] != undefined){
							// transfer to vals object
							dateDistrictData[cur_date][cur_districtID]['cases'] = case_data[i]["cumulative_cases"];
						}
					}
				}

				// go through death_data object and transfer values into dateDistrictData object
				for(let i=0; i < death_data.length; i++){
					// get date and state
					var cur_date = dateFromString(death_data[i]["date_death_report"]);
					var cur_districtID = death_data[i]["province"];
					if(dateDistrictData[cur_date] != undefined){
						if(dateDistrictData[cur_date][cur_districtID] != undefined){
							// transfer to vals object
							dateDistrictData[cur_date][cur_districtID]['deaths'] = death_data[i]["cumulative_deaths"];
						}
					}
				}

				// go through testing_data object and transfer values into dateDistrictData object
				// get list of all province names for debugging
				provinceSet = new Set();
				
				for(let i=0; i < testing_data.length; i++){
					// get date and state
					var cur_date = dateFromString(testing_data[i]["date_testing"]);
					var cur_districtID = testing_data[i]["province"];
					provinceSet.add(cur_districtID);
					if(dateDistrictData[cur_date] != undefined){
						if(dateDistrictData[cur_date][cur_districtID] != undefined){
							// transfer to vals object
							dateDistrictData[cur_date][cur_districtID]['tests'] = testing_data[i]["cumulative_testing"];
						}
					}
				}
				
				// THE DATA OBJECT
				the_data_object = {
					briefDescription: "Data from the <a href='https://github.com/ishaberry/Covid19Canada'>COVID-19 Canadian Open Data Working Group</a>.",
					baseFeatures: function(filter=null){
						return src.map_polys;
					},
					cartogramFeatures: function(filter=null){
						return src.carto_polys; 
					},
					defaultFilter: null,
					dataChildName: null,
					dataParentName: null,
					dates: dates,
					districtIDs: districtIDs,
					variableNames: variableNames,
					dateDistrictData: dateDistrictData,
					getID: function(feat){return feat.properties.Cov19ID;},
					getLabel: function(feat){return feat.properties.name;},
					getPopulation: function(feat){return feat.properties.Pop2020q1;},
					aggregateLabel: function(){return "Canada";}
				}
				resolve(the_data_object);

			} // end of "if (Object.keys(src).length == 3){"
		} // end of "function process_data(){"								
		}) // end of "new Promise(function(resolve, reject){"
	}
}; // end of function dataODWG_Canada_Provinces