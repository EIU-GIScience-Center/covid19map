// A map theme that shows the cumulative rate and number of deaths in each district.

// Utility variables and functions specific to this theme
// Please follow naming convention: all constants and variables here should start with theme name
// To avoid conflicts with similar variables in other theme modules
/* eslint-env es6 */
/* eslint-disable */
const deathsCumulative_legendMax = 10000;
const deathsCumulative_logScale = d3.scaleLog()
	.domain([deathsCumulative_legendMax, 100*Math.cbrt(10)]);
var localScale = d3.scalePow().exponent(0.7)(d3.scaleLog().domain([10000, 100*Math.cbrt(10)]));


// The theme object
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
