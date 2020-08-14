// A map theme that shows the cumulative rate and number of cases in each district.

// Utility variables and functions specific to this theme
// Please follow naming convention: all constants and variables here should start with theme name
// To avoid conflicts with similar variables in other theme modules
/* eslint-env es6 */
/* eslint-disable */

console.log("Loading Themes...");

// The theme object
const themeNewCases = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Daily Cases",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The number of new cases reported in the most recent 24-hour period.",
    
	/**
	 * A list of variables required to show this map theme
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases"],

	/**
	 * A function that gives the value used to determine a feature's color
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		var avg = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1]);
		if(avg < 0.49){avg=0.49};
		return avg;
	},

	/**
	 * A color interpolators to determine the feature fill color associated with a given
	 * value
	 *
	 * Choose from interpolators here: https://github.com/d3/d3-scale-chromatic
	 * Or build your own.
	 */
	choroplethColorInterpolator: d3.interpolateMagma,

	/**
	 * A function that takes possible values of the 
	 * choropleth value function and transforms them to a linear
	 * range (e.g. from 0 to 1) to match with a color range
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	/*choroplethValueScale: function(d){return Math.pow(Math.log(d+10),0.7);},*/
        choroplethValueScale: function(d){
            if(d < 0){
                return Math.pow(Math.log(0 + 100),0.7);
            } else {
                return Math.pow(Math.log(d + 100),0.7);
            }
        },
	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: expBase10CellsAndLabels()[0],

	/**
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: expBase10CellsAndLabels()[1],

    /**
    *Fixed Legend Value for each theme
    */
    legendmin: null,
    legendmax: null,
	
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
    updateDailyValueRange: true,
	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "New Cases Per Million",

	/**
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "",

	/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: function (feat, curDate) {
		var todayCases = periodAverage(feat, curDate, function(f,d){return getValue(f,d,'cases',false, true);}, [1]);
		if(isNaN(todayCases)){return 0;};
		if(todayCases > 0){
			// for now, set radius as sqrt of cases/fixed constant
			return Math.sqrt(todayCases)/3;
		} else {
			return 0;
		}
	},

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
		console.log("tooltip text function");
		console.log(feat);
		console.log(date);
		var pop = dataSource.getPopulation(feat);
		var new_case_count = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1])
		var new_case_rate = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1])
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + new_case_count.toFixed(0) + " new cases</p>";
		msg += "<p>" + toAppropriateDecimals(new_case_rate) + " new cases per million</p>";		
		return msg;
	}

};

const themeNewCases_7day = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Weekly Cases",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The average number of new cases/day in the most recent 7-day period.",

	/**
	 * A list of variables required to show this map theme
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases"],

	/**
	 * A function that gives the value used to determine a feature's color
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		var avg = 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1,1,1,1,1]);
		if(avg < 0.49){avg=0.49};
		return avg;
	},

	/**
	 * A color interpolators to determine the feature fill color associated with a given
	 * value
	 *
	 * Choose from interpolators here: https://github.com/d3/d3-scale-chromatic
	 * Or build your own.
	 */
	choroplethColorInterpolator: d3.interpolateMagma,

	/**
	 * A function that takes possible values of the 
	 * choropleth value function and transforms them to a linear
	 * range (e.g. from 0 to 1) to match with a color range
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	/*choroplethValueScale: function(d){return Math.pow(Math.log(d+10),0.7);},*/
        choroplethValueScale: function(d){
            if(d < 0){
                return Math.pow(Math.log(0 + 10),0.7);
            } else {
                return Math.pow(Math.log(d + 10),0.7);
            }
        },
	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: expBase10CellsAndLabels()[0],

	/**
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: expBase10CellsAndLabels()[1],


    /**
    *Fixed Legend Value for each theme
    */
    legendmin: null,
    legendmax: null,
	
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
    updateDailyValueRange: true,
	
	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "New Cases Per Million",

	/**
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "week ending",


	/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: function (feat, curDate) {
		var todayCases = periodAverage(feat, curDate, function(f,d){return getValue(f,d,'cases',false, true);}, [1,1,1,1,1,1,1]);
				if(todayCases > 0){
					// for now, set radius as sqrt of cases/fixed constant
					return Math.sqrt(todayCases)/3;
				} else {
					return 0;
				}
	},

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
		var pop = dataSource.getPopulation(feat);
		var new_case_count = parseInt(7*periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]))
		var new_case_rate = 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1,1,1,1,1])
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + withCommas(new_case_count) + " new cases/week</p>";
		msg += "<p>" + toAppropriateDecimals(new_case_rate) + " new cases per million</p>";		
		return msg;
	}

};

const themeCasesCumulative = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Total Cases",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The cumulative number of confirmed cases.",

	/**
	 * A list of variables required to show this map theme
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases"],

	/**
	 * A function that gives the value used to determine a feature's color
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		return getValue(feat,date,'cases',true);
	},

    
    	/**
	 * A function that takes possible values of the 
	 * choropleth value function and transforms them to a linear
	 * range (e.g. from 0 to 1) to match with a color range
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	choroplethValueScale: function(d){
		if(d == 0){
			return (0);
		} else {
			return (d);
		}
	},
    
	/**
	 * A color interpolators to determine the feature fill color associated with a given
	 * value
	 *
	 * Choose from interpolators here: https://github.com/d3/d3-scale-chromatic
	 * Or build your own.
	 */
	choroplethColorInterpolator: d3.interpolateMagma,

	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: expBase10CellsAndLabels()[0],

	/**
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: expBase10CellsAndLabels()[1],

    /**
    *Fixed Legend Value for each theme
    */
    legendmin: 0,
    legendmax: 10000,
	
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
	
    updateDailyValueRange: true,
	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Cases Per Million",

	/**
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "total through",

	/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: function (feat, curDate) {
		var todayCases = getValue(feat,curDate,'cases',false);
		// for now, set radius as 1/10th of sqrt of cases
		// or return zero for illustrations with no circles
		return Math.sqrt(todayCases)/8;
	},

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
		var pop = dataSource.getPopulation(feat);
		var case_count = getValue(feat,date,'cases', false);
		var case_rate = getValue(feat,date,'cases', true);
		if (isNaN(case_count)) {
			case_count = 0;
		}
		if (isNaN(case_rate)) {
			case_rate = 0;
		}
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + withCommas(case_count) + " cases</p>";
		msg += "<p>" + toAppropriateDecimals(case_rate) + " cases per million</p>";		
		return msg;
	}

}
const themePositiveTestRatio = {
	/**
	 * The name under which this variable shows up in the variable selector
	 *
	 * type: string
	 */
	themeName: "Positive Test Ratio (cumulative)",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The ratio of positive test results to total tests. A high value indicates insufficient testing.",

	/**
	 * A list of variables required to show this map theme
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases", "tests"],
	
	/**
	 * A function that gives the value for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var cases = getValue(feat, date, 'cases');
		var tests = getValue(feat, date, 'tests');
		if(tests==0){return 0;} else {return 100*cases/tests;}
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
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	choroplethValueScale: function(d){
		if(d < 0){
			return Math.pow(Math.log(0 + 1),3);
		} else {
			return Math.pow(Math.log(d + 1),3);
		}
	},

	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],

	/**
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: ["","~ 1%","","","","5%","","","","","10%","","","","","15% ~"], 

    /**
    *Fixed Legend Value for each theme
    */
    legendmin: 0,
    legendmax: 15,
    
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
    updateDailyValueRange: false,
    
	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Percent of tests with positive result.",


	/**
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "total through",

	/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: 0,

	/**
	 * The fill color of the circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleFill: '#f47',

	/**
	 * The border color of the circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleStroke: '#a04',
	
	/**
	 * A function that gives the text to use for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return A string to be used in the tooltip describing the given feature
	 *         on the given date
	 */
	tooltipTextFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var cases = getValue(feat, date, 'cases',false);
		var tests = getValue(feat, date, 'tests',false);
		if (isNaN(cases)) {
			cases = 0;
		}
		if (isNaN(tests)) {
			tests = 0;
		}
		var ptr;
		if(tests==0){ptr="n/a";} else {ptr= (100*(cases/tests)).toFixed(1) + "%";}
		msg = "<p>Tests: " + withCommas(tests) + "</p>";
		msg += "<p>Positive: " + withCommas(cases) + "</p>";
		msg += "<p>Positive Ratio: " + ptr + "</p>";
		return msg;
	}
	
}

const themeNewPositiveTestRatio = {
	/**
	 * The name under which this variable shows up in the variable selector
	 *
	 * type: string
	 */
	themeName: "Positive Test Ratio (7-day)",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The ratio of positive test results to total tests during the most recent 3-day period. A high value indicates insufficient testing.",

	/**
	 * A list of variables required to show this map theme
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases", "tests"],

	/**
	 * A function that gives the value for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var newcases = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1,1,1,1,1]);
		var newtests = periodAverage(feat, date, function(f,d){return getValue(f,d,'tests', true, true)}, [1,1,1,1,1,1,1]);
		if(newtests==0){return 0;} else {return 100*newcases/newtests;}
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
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	choroplethValueScale: function(d){
		if(d < 0){
			return Math.pow(Math.log(0 + 1),3);
		} else {
			return Math.pow(Math.log(d + 1),3);
		}
	},

	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],

	/**
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: ["","~ 1%","","","","5%","","","","","10%","","","","","15% ~"], 
    
    /**
    *Fixed Legend Value for each theme
    */
    legendmin: 0,
    legendmax: 15,
    
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
    updateDailyValueRange: false,
	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Percent of tests with positive result.",

	/**
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "week ending",

/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: 0,

	/**
	 * The fill color of the circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleFill: '#f47',

	/**
	 * The border color of the circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleStroke: '#a04',
	
	/**
	 * A function that gives the text to use for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return A string to be used in the tooltip describing the given feature
	 *         on the given date
	 */
	tooltipTextFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var state = feat.properties["ABBREV"];		
		var newcases = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]);
		var newtests = periodAverage(feat, date, function(f,d){return getValue(f,d,'tests', false, true)}, [1,1,1,1,1,1,1]);
		if (isNaN(newcases)) {
			newcases = 0;
		}
		if (isNaN(newtests)) {
			newtests = 0;
		}
		var ptr;
		if(newtests==0){new_PTR="n/a";} else {new_PTR= (100*(newcases/newtests)).toFixed(1) + "%";}
		msg = "<p>New Tests: " + withCommas(newtests.toFixed(0)) + "</p>";
		msg += "<p>New Cases: " + withCommas(newcases.toFixed(0)) + "</p>";
		msg += "<p><b>Positive Test Ratio: " + new_PTR + "</b></p>";
		return msg;
	}
	
}
const themeCaseMortality = {
	/**
	 * The name under which this variable shows up in the variable selector
	 *
	 * type: string
	 */
	themeName: "Case Mortality (cumulative)",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The ratio of deaths to total confirmed cases.",

	/**
	 * A list of variables required to show this map theme
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases", "deaths"],

	/**
	 * A function that gives the value for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var cases = getValue(feat, date, 'cases');
		var deaths = getValue(feat, date, 'deaths');
		if(cases==0){return 0;} else {return 100*deaths/cases;}
	},

	/**
	 * A color interpolators to determine the feature fill color associated with a given
	 * value
	 *
	 * Choose from interpolators here: https://github.com/d3/d3-scale-chromatic
	 * Or build your own.
	 */
	choroplethColorInterpolator: d3.interpolatePuOr,



	/**
	 * A function that takes possible values of the 
	 * choropleth value function and transforms them to a linear
	 * range (e.g. from 0 to 1) to match with a color range
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	choroplethValueScale: function(d){
		if(d < 0){
			return Math.pow(Math.log(0 + 1),1.5);
		} else {
			return Math.pow(Math.log(d + 1),1.5);
		}
	},

	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],

	/**
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: ["","~ 1%","","","","3%","","","","5%","","","","7%","","","","9% ~",""], 

    /**
    *Fixed Legend Value for each theme
    */
    legendmin: 0,
    legendmax: 10,
    
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
    updateDailyValueRange: false,
    /**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Deaths as a percent of cases",

	/**
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "total through",

	/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: 0,

	/**
	 * The fill color of the circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleFill: '#f47',

	/**
	 * The border color of the circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleStroke: '#a04',
	
	/**
	 * A function that gives the text to use for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return A string to be used in the tooltip describing the given feature
	 *         on the given date
	 */
	tooltipTextFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var cases = getValue(feat, date, 'cases',false);
		var deaths = getValue(feat, date, 'deaths',false);
		if (isNaN(cases)) {
			cases = 0;
		}
		if (isNaN(deaths)) {
			deaths = 0;
		}
		var ptr;
		if(cases==0){ptr=0} else {ptr = 100*deaths/cases};
		msg = "<p>Cases: " + withCommas(cases) + "</p>";
		msg += "<p>Deaths: " + withCommas(deaths) + "</p>";
		msg += "<p>Case Mortality: " + ptr.toFixed(1) + "%</p>";
		return msg;
	}
	
}

const themeCaseMortality_7day = {
	/**
	 * The name under which this variable shows up in the variable selector
	 *
	 * type: string
	 */
	themeName: "Case Mortality (7-day)",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The ratio of deaths to total confirmed cases 7 days earlier.",
    
	/**
	 * A list of variables required to show this map theme
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases","deaths"],
	
	/**
	 * A function that gives the value for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		var dateID = dates.indexOf(date);
		if(dateID < 7){
			return 0;
		} else {
			var prevDate = dates[dateID-7];
			var state = feat.properties["ABBREV"];		
			var cases = getValue(feat, prevDate, 'cases');
			var deaths = getValue(feat, date, 'deaths');
			if(cases==0){return 0;} else {return 100*deaths/cases;}
		}
	},

	/**
	 * A color interpolators to determine the feature fill color associated with a given
	 * value
	 *
	 * Choose from interpolators here: https://github.com/d3/d3-scale-chromatic
	 * Or build your own.
	 */
	choroplethColorInterpolator: d3.interpolatePuOr,


	/**
	 * A function that takes possible values of the 
	 * choropleth value function and transforms them to a linear
	 * range (e.g. from 0 to 1) to match with a color range
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	choroplethValueScale: function(d){
		if(d < 0){
			return Math.pow(Math.log(0 + 1),1.5);
		} else {
			return Math.pow(Math.log(d + 1),1.5);
		}
	},

	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],
	/**
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: ["","~ 1%","","","","3%","","","","5%","","","","7%","","","","9% ~",""], 
	
    /**
    *Fixed Legend Value for each theme
    */
    legendmin: 0,
    legendmax: 10,
    
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
    updateDailyValueRange: false,
    /**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Deaths as a percent of reported cases.",

	/**
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "week ending",

/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: 0,

	/**
	 * The fill color of the circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleFill: '#f47',

	/**
	 * The border color of the circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleStroke: '#a04',
	
	/**
	 * A function that gives the text to use for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return A string to be used in the tooltip describing the given feature
	 *         on the given date
	 */
	tooltipTextFcn: function (feat, date) {
		var dateID = dates.indexOf(date);
		if(dateID < 7){
			console.log("insufficient data for themeCaseMortality");
			console.log("dateID: " + dateID);
			console.log(date);
			return "insufficient data";
		} else {
			var prevDate = dates[dateID-7];
			var state = feat.properties["ABBREV"];		
			var cases = getValue(feat, prevDate, 'cases');
			var deaths = getValue(feat, date, 'deaths');
			var ptr;
			if(cases==0){ptr=0} else {ptr = 100*deaths/cases};
			msg = "<p>Cases (7-days prior): " + withCommas(cases) + "</p>";
			msg += "<p>Deaths: " + withCommas(deaths) + "</p>";
			msg += "<p>Case Mortality: " + ptr.toFixed(1) + "%</p>";
			return msg;
		}
	}
	
}
const themeDeathsCumulative = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Total Deaths",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The cumulative number of deaths.",
    
	/**
	 * A list of variables required to show this map theme
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
		return getValue(feat,date,'deaths',true);
	},

    
    	/**
	 * A function that takes possible values of the 
	 * choropleth value function and transforms them to a linear
	 * range (e.g. from 0 to 1) to match with a color range
	 *
	 * @param value A single numeric value of our feature
	 * @return A transformed value
	 */
	choroplethValueScale: function(d){
		if(d == 0){
			return (0);
		} else {
			return (d);
		}
	},
    
	/**
	 * A color interpolators to determine the feature fill color associated with a given
	 * value
	 *
	 * Choose from interpolators here: https://github.com/d3/d3-scale-chromatic
	 * Or build your own.
	 */
	choroplethColorInterpolator: d3.interpolateMagma,

	/**
	 * If true, the color scheme will be reversed.
	 */
	invertColorScale: true,

	/**
	 * The values to show colors for on the choropleth legend
	 */
	choroplethCells: expBase10CellsAndLabels()[0],

	/**
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: expBase10CellsAndLabels()[1],

    /**
    *Fixed Legend Value for each theme
    */
    legendmin: 0,
    legendmax: 10000,
	
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
	
    updateDailyValueRange: true,
	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "deaths Per Million (total deaths indicated by circle size)",

	/**
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "total through",

	/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: function (feat, curDate) {
		var todaydeaths = getValue(feat,curDate,'deaths',false);
		// for now, set radius as 1/10th of sqrt of deaths
		// or return zero for illustrations with no circles
		return Math.sqrt(todaydeaths)/8;
	},

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
		var pop = dataSource.getPopulation(feat);
		var death_count = getValue(feat,date,'deaths', false);
		var death_rate = getValue(feat,date,'deaths', true);
        var tdr = 100*death_count/pop;
		if (isNaN(death_count)) {
			death_count = 0;
		}
		if (isNaN(death_rate)) {
			death_rate = 0;
		}
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + withCommas(death_count) + " deaths</p>";
		msg += "<p>" + toAppropriateDecimals(death_rate) + " deaths per million</p>";	
        msg += "<p>Total Mortality: " + tdr.toFixed(2) + "%</p>";
		return msg;
	}

}
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
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "week ending",

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
	}

}
const themeCaseIncreaseDayOverWeek = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Today vs. prior week",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The difference between today's cases and the average for the past week.",
    
	/**
	 * A list of variables required to show this map theme
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases"],

	/**
	 * A function that gives the value used to determine a feature's color
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,1,1,1,1,1,1,1])
		var today = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1])
		if(prior_week==0){
			if(today==0){
				return 1;
			} else {
				return 2;
			}
		} else {
			return today/prior_week;
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
	 * The corresponding labels on the choropleth legend
	 * obviously this should be the same length as "cells"
	 */
	choroplethLabels: ["","-50%","","-20%","","even","","+20%","","+50%",""],

    /**
    *Fixed Legend Value for each theme
    */
    legendmin: 0.2,
    legendmax: 1.8,
    
    /**
    *updateDailyValueRange will choose whether the legend will be automatically updated or not
    *true - legend will be updated when user change the date
    *false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    */
    updateDailyValueRange: false,
    

	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Increase vs. previous week",

	/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
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
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,1,1,1,1,1,1,1]).toFixed(2)
		var today = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1]).toFixed(0)
		var increase;
		if(prior_week==0){
			var increase="Increase: n/a";
		} else {
			var increase = today/prior_week ;
			if (increase <= 1){
				increase = 100*(1-increase);
				increase = "Decrease: " + increase.toFixed(1) + "%"
			} else {
				increase = 100*(increase-1);
				increase = "Increase: " + increase.toFixed(1) + "%"
			}
			
		}

		msg = "<p>Prior week: " + prior_week + " new cases/day</p>";
		msg += "<p>Today: " + today + " new cases</p>";
		msg += "<p>" + increase + "</p>";		
		return msg;
	}

}
const themeCaseIncreaseWeekOverWeek = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Cases, Comparison",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The difference between new cases this week vs. the previous week.",
    
	/**
	 * A list of variables required to show this map theme. 
	 * Look in "data/data_dictionary.txt" for a list of available variable names.
	 * Note that each data source might only provide certain variables. If a data source does 
	 * not provide all of the variables required by your theme, your theme will not be 
	 * available for that data source.
	 *
	 * type: array of strings
	 */

	requiredVariables: ["cases"],

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
		var currentCases = getValue(feat,date,'cases', false, false)
		// Example 2: Get the number of cases per million people:
		var currentCasesPerMillion = getValue(feat,date,'cases', true, false)
		// Example 3: Get the increase in cases over the previous day (i.e. the number of NEW cases):
		var increaseInCases = getValue(feat,date,'cases', false, true)
		
		// (2) The ***periodAverage*** function can get an average of any variable for any time period prior to each slider date
		// It is defined in utils.js and has the following signature:
		//     periodAverage=function(feat, date, valFunc, periodWts)
		// You can use "getValue" for the value function, and a simple array of numbers for periodWts.
		// Example 1: Get the 7-day average number of new cases/day:		
		var this_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1])
		// Example 2: Get the 7-day average for the previous week
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1])
		
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
	 * A prefix to the date display for this theme, for example indicating the time period covered
	 *
	 * type: string
	 */
	datePrefix: "week ending",

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
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1])
		var this_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1])		
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
		msg = "<p>Previous week: " + prior_week.toFixed(1) + " new cases/day</p>";
		msg += "<p>This week: " + this_week.toFixed(1) + " new cases/day</p>";
		msg += "<p>" + increase + "</p>";		
		return msg;
	}

}
