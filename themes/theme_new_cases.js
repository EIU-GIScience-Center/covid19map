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
	themeName: "New Cases",

	/**
	 * A function that gives the value used to determine a feature's color
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		return periodAverage(feat, date, function(f,d){return getValue(f,d,'positive', true, true)}, [1]);
	},

	/**
	 * A color function to determine the feature fill color associated with a given
	 * value
	 *
	 * @param value A single numeric value of our feature
	 * @return A color (in the form '#RGB' or '#RRGGBB')
	 */
	choroplethColorScale: d3.scaleSequential((d) => 
				d3.interpolateMagma(nthPowScale(0.6)(newCases_logScale(d))))
	,

	/**
	 * [value,color] pairs for assigning colors to to values outside of legend range
	 */
	lowValColor : [0,'#fff'],
	highValColor : null,

	/**
	 * A function returning the values and labels appropriate for use with
	 * our feature on the legend
	 *
	 * @param feat The feature being shown
	 * @param date The date at which the feature is shown
	 * @return An array containing two arrays.
	 *         The first is a numerical array containing the values at which
	 *         ticks should be shown in the legend
	 *         The second is a string array containing the labels to be used
	 *         at said ticks.
	 *         Obviously, the two arrays should be of the same length.
	 */
	cellsAndLabelsFcn: function (feat, date) {
		var getValsFunc = expBase10CellsAndLabelsFunc(1,newCases_legendMax);
		return getValsFunc();
	},

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
		var todayCases = periodAverage(feat, curDate, function(f,d){return getValue(f,d,'positive',false, true);}, [1]);
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
		var new_case_rate = choroplethValue(feat,date);
		var new_case_count = Math.round(new_case_rate*pop/1000000);

		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + withCommas(new_case_count) + " new cases</p>";
		msg += "<p>" + rateText(new_case_rate) + " new cases per million</p>";		
		return msg;
	}

}
