
// A module that shows the base of the best-fit exponential curve of the data in
// each state.
//
// Currently, for each day, we take all the data up to that day, and fit an
// exponential curve to it, and calculate the error of that fit.  We use the base
// color of the state to show the exponent of the best-fit curve (i.e., the best
// growth rate), and the dot to show the error.

/**
  * A function to determine the error of an exponential function fit to a data series
  *
  * @param series The series of data that the exponential function was fit to. 
  * @param a First parameter of the fitted exponential function.
  * @param b Second parameter of the fitted exponential function.
  * @return The error in the fitted function (RMSE?)
  */

const expErr = function (series, a, b) {
		return Math.sqrt(series.map(entry => {
			const [x, y] = entry
			const expectedY = a * Math.exp(b * x)
			return (y - expectedY) * (y - expectedY)
		}).reduce((a, b) => a + b, 0) / series.length)
	}

/**
  * A function to determine the error of an exponential function fit to a data series
  *
  * @param pts The series of data that the exponential function will be fit to. 
  * @return [a,b] The two parameters defining the exponential function.
  */

const expFit = function (pts) {
	const goodPts = pts.filter(pt => pt[1] > 0)
	const n = goodPts.length

	if (n > 2) {
		const sumX = goodPts.map(pt => pt[0]).reduce((a, b) => a + b, 0)
		const sumX2 = goodPts.map(pt => pt[0] * pt[0]).reduce((a, b) => a + b, 0)
		const sumY = goodPts.map(pt => Math.log(pt[1])).reduce((a, b) => a + b, 0)
		const sumXY = goodPts.map(pt => pt[0] * Math.log(pt[1])).reduce((a, b) => a + b, 0)
		const a = Math.exp((sumX2 * sumY - sumX * sumXY) / (n * sumX2 - sumX * sumX))
		const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
		return [a, b]
	} else {
		return [0.0, 0.0]
	}
}

const linearScale = d3.scaleLinear()
				.domain([1, 2]);

const GrowthRateModule = {
	/**
	 * The name under which this variable shows up in the variable selector
	 *
	 * type: string
	 */
	variableName: "Growth Rate",


	/**
	 * A function to copy data from the root data structure to the vals structure
	 * used for display
	 *
	 * @param root The datum from which we are copying data.  This should be a
	 *             single datum from the data array passed in to addData, above
	 * @param display The individual datum that is seen by the visualization
	 */
	copyData: function (root, display) {
		if (root.exp) {
			display.exp = Math.exp(root.exp)
			display.expErr = root.expErr
		} else {
			display.exp = 0.0
			display.expErr = 0.0
		}
	},

	/**
	 * A function that gives the value for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	valueFcn: function (feat, date) {
		console.log("We're here...");
		var state = feat.properties["ABBREV"];		
		var caseData = dates.map(datum => getValue(feat, datum, 'positive'));
		var n = caseData.length;
		for(i=0;i<n;i++){
			caseData[i] = [i,caseData[i]];
		}
		const curDay = dates.indexOf(date);
		if (curDay > 2){
			startDay = curDay -3;
		} else {
			startDay = 0;
		}
		const dailySlice = caseData.slice(startDay, curDay);		
		const dailyFit = expFit(dailySlice);
		console.log(dailyFit);
		if (dailyFit[1] > 0) {
			const dailyErr = expErr(dailySlice,
									dailyFit[0], dailyFit[1])
		}
		return dailyFit[1];
	},

	/**
	 * A function that gives the text to use for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return A string to be used in the tooltip describing the given feature
	 *         on the given date
	 */
	valueTextFcn: function (feat, date) {
		var GR = getValue(feat, date, 'exp', false);
		var DE = getValue(feat, date, 'expErr', false);
		return "<p>Growth rate: " + GR.toFixed(2) + "x/day</p>" +
			"<p>Daily error: " + DE.toFixed(2) + "</p>"
	},

	/**
	 * A color function to determine the color associated with a given
	 * value
	 *
	 * @param value A single numeric value of our feature
	 * @return A color (in the form '#RGB' or '#RRGGBB')
	 */
	 
	color : d3.scaleSequential((d) => 
				d3.interpolateBlues((linearScale(d))))
	,

	lowValColor : [0,'#fff'],
	highValColor : [1,'#005'],
	

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
			[1, 1.25, 1.5, 1.75, 2],
			["1", ".", "1.5", ".", "2"]
		]
	},

	/**
	 * The title to be used on the legend for this module's feature
	 *
	 * type: string
	 */
	legendTitle: "Growth rate of total cases",

	/**
	 * The size of the small circle.
	 *
	 * @param feat The feature whose circle size is desired
	 * @param date The date for which the feature is being evaluated
	 * @return a numerical value, interpretted as the radius of the small
	 *         circle, in pixels
	 */
	circleRadiusFcn: function (feat, curDate) {
		console.log("hello??");
		return 0;
	},

	/**
	 * The fill color of the small circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleFill: '#f47',

	/**
	 * The border color of the small circle
	 *
	 * type: color (i.e., '#RGB' or '#RRGGBB') (though maybe a function of
	 *       (feat, date) => color would work too, like it does everything else?)
	 */
	circleStroke: '#a04'
}
