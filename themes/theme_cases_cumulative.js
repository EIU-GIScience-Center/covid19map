// A map theme that shows the cumulative rate and number of cases in each district.

// Utility variables and functions specific to this theme
// Please follow naming convention: all constants and variables here should start with theme name
// To avoid conflicts with similar variables in other theme modules
/* eslint-env es6 */
/* eslint-disable */
const casesCumulative_legendMax = 10000;
const casesCumulative_logScale = d3.scaleLog()
	.domain([casesCumulative_legendMax, 100*Math.cbrt(10)]);
var localScale = d3.scalePow().exponent(0.7)(d3.scaleLog().domain([10000, 100*Math.cbrt(10)]));


// The theme object
const themeCasesCumulative = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Cases (cumulative)",

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
	
    updateDailyValueRange: true,
	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Cases Per Million (total cases indicated by circle size)",

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
		if ((case_count == undefined)||(isNaN(case_count))) {
			case_count = 0;
		}
		if ((case_rate == undefined)||isNaN(case_rate)) {
			case_rate = 0;
		}
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + withCommas(case_count) + " cases</p>";
		msg += "<p>" + toAppropriateDecimals(case_rate) + " cases per million</p>";		
		return msg;
	}

}
