
// A module that shows the base of the best-fit exponential curve of the data in
// each state.
//
// Currently, for each day, we take all the data up to that day, and fit an
// exponential curve to it, and calculate the error of that fit.  We use the base
// color of the state to show the exponent of the best-fit curve (i.e., the best
// growth rate), and the dot to show the error.
const GrowthRateModule = {
	// The name under which this variable shows up in the variable selector
	variableName: "Growth Rate",

	/**
      * A function to add our data to the base data variable
	  *
	  * @param data The complete set of standard data in its base form.
	  *             Each datum includes tags for 'positive' (positively
	  *             tested cases), 'negative', 'deaths', etc.
	  * @param dates A list of all valid dates in the data
	  * @param states A list of all valid states in the data
	  * @return Nothing directly.  This function should add what information
	  *         it wants to return directly into the data variable
	  */
	addData: function(data, dates, states) {
		const expErr = function (series, a, b) {
			return series.map(entry => {
				const [x, y] = entry
				const expectedY = a * Math.exp(b * x)
				return (y - expectedY) * (y - expectedY)
			}).reduce((a, b) => a + b, 0) / series.length
		}
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
		for (s=0; s<states.length; s++) {
			const state = states[s]
			const stateData = data
			    .filter(datum => datum.state == state)
			      .sort((a, b) => a.doy - b.doy)
			const pointData = stateData.map(datum => [datum.doy, datum.positive])
			const minDay = pointData.map(datum => datum[0]).reduce((a, b) => Math.min(a, b))
			const maxDay = pointData.map(datum => datum[0]).reduce((a, b) => Math.max(a, b))
			for (d = minDay; d <= maxDay; ++d) {
				const dailySlice = pointData.slice(0, d - minDay)
				const dailyFit = expFit(dailySlice)
				if (dailyFit[1] > 0) {
					const dailyErr = expErr(dailySlice,
											dailyFit[0], dailyFit[1])
					stateData[d - minDay].exp = dailyFit[1]
					stateData[d - minDay].expErr = dailyErr
				}
			}
		}
	},

	// A function to copy data from the root data structure to the vals structure used for display
	copyData: function (root, display) {
		if (root.exp) {
			display.exp = Math.exp(root.exp)
			display.expErr = root.expErr
		} else {
			display.exp = 0.0
			display.expErr = 0.0
		}
	},
	
	// A function that gives the value for a given feature
	valueFcn: function (feat, date) {
		return getValue(feat, date, 'exp', false)
	},

	// A function that gives the text to use for a given feature
	valueTextFcn: function (feat, date) {
		return "Growth rate: " + getValue(feat, date, 'exp', false)
	},

	// The color scale to use for our main variable
	colorScale: function (value) {
		if (value <= 0) {
			return '#FFF'
		} else {
			return d3.scaleSequential((d) =>
				d3.interpolateMagma(d3.scaleLinear().domain([1, 3]))
			)
		}
	},

	// The color scale to use for our legend
	legendColorScale: d3.scaleSequential((d) =>
		d3.interpolateMagma(d3.scaleLinear().domain([1, 3]))
	),

	// An array of two arrays; the first being the values of the legend tics, the second, the labels
	cellsAndLablesFcn: function (feat, curDate) {
		return [
			[1, 2, 3],
			["1", "2", "3"]
		]
	},

	// The title to use on the legend for this variable
	legendTitle: "Growth rate of total cases",

	// The size of the small circle
	circleRadiusFcn: function (feat, curDate) {
		return Math.sqrt(getValue(feat, curDate, "expErr", false)) / 1000.0
	},

	// The color of the small circle
	circleFill: '#f47',

	// The color of the line of the small circle
	circleStroke: '#a04'
}
