// A map theme that shows the cumulative rate and number of cases in each district.

// Utility variables and functions specific to this theme
// Please follow naming convention: all constants and variables here should start with theme name
// To avoid conflicts with similar variables in other theme modules

const newCases_legendMax = 10000;
const newCases_logScale = d3.scaleLog()
	.domain([newCases_legendMax, 1]);

// The theme object
const themeNewCases = {

	/**
	 * The name under which this theme shows up in the theme selector
	 *
	 * type: string
	 */
	themeName: "Cases (3-day)",

	/**
	 * A brief description, to show in the main window
	 *
	 * type: string
	 */
	
	briefDescription: "The average number of new cases/day in the most recent 3-day period.",


	/**
	 * A function that gives the value used to determine a feature's color
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		return periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1]);
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
	choroplethValueScale: function(d){return Math.pow(Math.log(d),0.7);},

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
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "New Cases Per Million",

	/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: function (feat, curDate) {
		var todayCases = periodAverage(feat, curDate, function(f,d){return getValue(f,d,'cases',false, true);}, [1,1,1]);
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
		var pop = getPopulation(feat);
		var new_case_count = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1])
		var new_case_rate = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1])

		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + new_case_count.toFixed(2) + " new cases/day</p>";
		msg += "<p>" + toAppropriateDecimals(new_case_rate) + " new cases per million</p>";		
		return msg;
	}

}
