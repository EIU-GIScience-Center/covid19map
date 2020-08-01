// A map theme that shows the cumulative rate and number of cases in each district.

// To make your own theme:
// 1. Copy this file to a new theme file and rename appropriately
// 2. Modify your file to capture your desired map variable, descriptions and cartographic symbolization.
//    a. Change the name of the constant on the first line. 
// 		 Be sure to choose a unique name, so that it will not conflict with any others.
//    b. Modify the value in each key-value pair appropriately.
//       Again, please avoid conflicts with other scripts by making sure you don't defined
//       any global variables or constants. 
// 3. Add your theme to index.html
//    a. Create a reference to your new script at the top of index.html
//    b. Search for "var themes" and add the name of your constant (just below) to the array.

/* eslint-env es6 */
/* eslint-disable */


// The theme object
const themeDeathIncreaseWeekOverWeek = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Deaths, Comparison",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The difference between deaths this week vs. the previous week.",
    
	/**
	 * A list of variables required to show this map theme. 
	 * Look in "data/data_dictionary.txt" for a list of available variable names.
	 * Note that each data source might only provide certain variables. If a data source does 
	 * not provide all of the variables required by your theme, your theme will not be 
	 * available for that data source.
	 *
	 * type: array of strings
	 */

	requiredVariables: ["deaths"],

	/**
	 * A function that gives the value used to determine a feature's color
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		// Two helper functions are available to you:
		
		// (1) The ***getValue*** function can get the value of any variable for a given feature and date
		// It is defined in index.html and has the following signature:
		// 			getValue = function(feat, date, varName, perMillion=false, getIncrease = false)
		// Example 1: Get the number of cases on the current date:
		var currentDeaths = getValue(feat,date,'deaths', false, false)
		// Example 2: Get the number of cases per million people:
		var currentDeathsPerMillion = getValue(feat,date,'deaths', true, false)
		// Example 3: Get the increase in cases over the previous day (i.e. the number of NEW cases):
		var increaseInDeaths = getValue(feat,date,'deaths', false, true)
		
		// (2) The ***periodAverage*** function can get an average of any variable for any time period prior to each slider date
		// It is defined in utils.js and has the following signature:
		//     periodAverage=function(feat, date, valFunc, periodWts)
		// You can use "getValue" for the value function, and a simple array of numbers for periodWts.
		// Example 1: Get the 7-day average number of new cases/day:		
		var this_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1])
		// Example 2: Get the 7-day average for the previous week
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1])
		
		// This theme uses the last two variables to determine the rate at which cases are increaseing or decreasing.
		// The following code returns the calculated value
		// First, handle special cases:
		if(prior_week==0){
			if(this_week==0){
				return 1; // No data, so we want a neutral color. A ratio of 1 means no increase or decrease.
			} else {
				return 2; // Increase from zero to a non-zero value, so we want a dark color. An increase of 2x is pretty big.
			}
		} else {
			return this_week/prior_week; // The usual case: just return the increase ratio.
		}
	},

	/**
	 * A color interpolators to determine the feature fill color associated with a given
	 * value
	 *
	 * Choose from interpolators here: https://github.com/d3/d3-scale-chromatic
	 * Or build your own.
	 */
	choroplethColorInterpolator: d3.interpolateRdBu,

	/**
	 * A function that takes possible values of the 
	 * choropleth value function and transforms them to a linear
	 * range (e.g. from 0 to 1) to match with a color range
	 * For no transformation, just return the input value.
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	choroplethValueScale: function(d){return d;},

	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: [0.2,0.5,0.7,0.8,0.9,1,1.1,1.2,1.3,1.5,1.8],

	/**
	 * The corresponding labels on the choropleth legend.
	 * This should be the same length as "cells"
	 */
	choroplethLabels: ["","-50%","","-20%","","even","","+20%","","+50%",""],

    /**
    *Fixed legend bounds, to be used when the legend is not automatically updated.
    */
    legendmin: 0.2,
    legendmax: 1.8,
    
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user changes the date, except during animated playback.
    *false - legend will not be updated and will have fixed value bounds from above(legendmin & legendmax)
    */
    updateDailyValueRange: false,
    

	/**
	 * The title to be used on the legend
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Increase vs. previous week",

	/**
	 * The size of the circle symbol (set to zero for no circles).
	 * May be a function or a constant value.
	 * If using a function, it should have the following parameters:
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: 0,

	/**
	 * The fill color of the circle
	 *
	 * type: color value or function of (feat, date) => color
	 */
	circleFill: '#45c',

	/**
	 * The border color of the circle
	 *
	 * type: color value or function of (feat, date) => color
	 */
	circleStroke: '#459',
	
		/**
	 * A function that gives the text to use for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return A string to be used in the tooltip describing the given feature
	 *         on the given date
	 */
	tooltipTextFcn: function (feat, date) {
		// First make some calculations.
		// You can use the same ***getValue*** and ***periodAverage*** functions as described above.
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1])
		var this_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1])		
		var increase;
		if(prior_week==0){
			var increase="Increase: n/a";
		} else {
			var increase = this_week/prior_week ;
			if (increase <= 1){
				increase = 100*(1-increase);
				increase = "Decrease: " + increase.toFixed(1) + "%"
			} else {
				increase = 100*(increase-1);
				increase = "Increase: " + increase.toFixed(1) + "%"
			}
			
		}
		// The message to show in the tooltip:
		msg = "<p>Previous week: " + prior_week.toFixed(1) + " deaths/day</p>";
		msg += "<p>This week: " + this_week.toFixed(1) + " deathss/day</p>";
		msg += "<p>" + increase + "</p>";		
		return msg;
	},

	/**
	 * A function that gives the average choropleth value for a group of features
	 *
	 * @param feats: The list of features to be averaged
	 * @param date: The date for which the features' average value is desired
	 * @return The average value of the features
	 */
	averageValueFcn: function (feats, date) {
		// The function areaAverage in utils makes this easier for most cases - it'll do that work for you given
		// a function to find the numerator and the denominator value of your rate - but in cases like this, where
		// you have specific special cases, you might need to average the values by hand, like below.

		var avg = areaAverage(feats, date,
			function (f, d) {return periodAverage(f, d,
				function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1])},
			function (f, d) {return periodAverage(f, d,
				function (f, d) {return getValue(f,d,'deaths', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1])},
			1, 2)

		return avg;
	}

}
