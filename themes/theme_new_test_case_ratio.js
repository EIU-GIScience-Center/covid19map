// A map theme that shows the cumulative rate and number of cases in each district.

// Utility variables and functions specific to this theme
// Please follow naming convention: all constants and variables here should start with theme name
// To avoid conflicts with similar variables in other theme modules

const testCaseRatio_logScale = d3.scaleLog()
				.domain([0.01, 1]);

const themeNewTestCaseRatio = {
	/**
	 * The name under which this variable shows up in the variable selector
	 *
	 * type: string
	 */
	themeName: "New Tests/New Cases",

	/**
	 * A function that gives the value for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	choroplethValueFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var newcases = periodAverage(feat, date, function(f,d){return getValue(f,d,'positive', true, true)}, [1,1,1]);
		var newtests = newcases + periodAverage(feat, date, function(f,d){return getValue(f,d,'negative', true, true)}, [1,1,1]);
		if(newcases==0){return 0;} else {return newtests/newcases;}
	},


	/**
	 * A color function to determine the color associated with a given
	 * value
	 *
	 * @param value A single numeric value of our feature
	 * @return A color (in the form '#RGB' or '#RRGGBB')
	 */
	 
	choroplethColorScale : d3.scaleSequential((d) => 
				d3.interpolateBlues(1-(testCaseRatio_logScale(1/(Math.pow(d,1.3))))))
	,

	/**
	 * [value,color] pairs for assigning colors to to values outside of legend range
	 */
	lowValColor : [1,'#fff'],
	highValColor : [20,'#005'],
	

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
		
		return [
			[1, 2, 5, 10, 20, 30, 50],
			["1", "", "5", "", "20", "", "50"]
		]
	},

	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	choroplethLegendTitle: "Number of tests performed for each positive test result.",

/**
	 * The size of the circle symbol (set to zero for no circles).
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value or function(feat, date) that computes a numerical value, 
	 *         interpreted as the radius of the circle, in pixels
	 */
	circleRadiusFcn: function (feat, curDate) {
		return 0;
	},

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
		var newcases = periodAverage(feat, date, function(f,d){return getValue(f,d,'positive', false, true)}, [1,1,1]);
		var newtests = newcases + periodAverage(feat, date, function(f,d){return getValue(f,d,'negative', false, true)}, [1,1,1]);
		var new_test_case_ratio ;
		if(newcases==0){new_test_case_ratio="n/a";} else {new_test_case_ratio= (newtests/newcases).toFixed(1) + "x";}
		msg = "<p>New Tests: " + withCommas(newtests.toFixed(0)) + "</p>";
		msg += "<p>New Cases: " + withCommas(newcases.toFixed(0)) + "</p>";
		msg += "<p>Test/Case Ratio: " + new_test_case_ratio + "</p>";
		return msg;
	}
	
}