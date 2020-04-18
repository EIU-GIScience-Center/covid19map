
// A module that shows the base of the best-fit exponential curve of the data in
// each state.
//
// Currently, for each day, we take all the data up to that day, and fit an
// exponential curve to it, and calculate the error of that fit.  We use the base
// color of the state to show the exponent of the best-fit curve (i.e., the best
// growth rate), and the dot to show the error.

function sum(x){
	var s = 0;
	for(i=0;i<x.length;i++){
		s+=x[i];
	}
	return s
}

function sumproduct(x,y){
	var sp=0;
	for(i=0;i<x.length;i++){
		sp += x[i] * y[i];
	}
	return sp
}

function sumsq(x){
	var ss = 0;
	for(i=0;i<x.length;i++){
		ss+=x[i]**2;
	}
	return ss
}

function mean(x){
	var s = sum(x);
	return s/x.length;
}

function stdev(x){
	var mn = mean(x);
	var sd = 0;
	for (i=0; i<x.length; i++){
		sd += (x[i]-mn)**2;
	}
	return Math.sqrt(sd/x.length);
}

/**
  * A function to fit an equation in the form y = ax + b to data.
  *
  * @param x The x-values.
  * @param y The y-values.
  * @return [a,b]
  */
function linear_fit(x,y){
	if(x.length < 2){return [1,1];}
	const x_mean = mean(x);
	const y_mean = mean(y);
	const sx = stdev(x);
	const sy = stdev(y);
	if(sy==0){return [1,y_mean-x_mean];}
	const xy_mean = sumproduct(x,y)/x.length;
	const x2mean = sumsq(x)/x.length;
	const y2mean = sumsq(y)/y.length;
	const rxy_numerator = xy_mean-x_mean*y_mean;
	const rxy_denominator = Math.sqrt((x2mean-x_mean**2)*(y2mean-y_mean**2));
	const rxy = rxy_numerator/rxy_denominator;
	const a = rxy*sy/sx;
	const b = y_mean-a*x_mean;
	return [a,b];
}



const GrowthRateModule = {
	/**
	 * The name under which this variable shows up in the variable selector
	 *
	 * type: string
	 */
	variableName: "Growth Rate",

	/**
	 * A function that gives the value for a given feature
	 *
	 * @param feat The feature whose value is desired
	 * @param date The date for which the feature's value is desired
	 * @return An appropriate number
	 */
	valueFcn: function (feat, date) {
		var idx = dates.indexOf(date);
		var start_idx = idx-5;
		if(start_idx < 0){start_idx = 0;}		
		xs = [];
		ys = [];
		for(i=start_idx; i < idx+1; i++){
			var today_cases = getValue(feat,dates[i],'positive',false);
			if(today_cases > 0){
				xs.push(i);
				ys.push(Math.log(today_cases));
			}
		}
		var a=0;
		var b=0;
		[a,b] = linear_fit(xs,ys);
		return Math.exp(a);
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
		var GR = choroplethValue(feat,date);
		return "<p>Growth rate: " + GR.toFixed(2) + "x/day</p>"
	},

	/**
	 * A color function to determine the color associated with a given
	 * value
	 *
	 * @param value A single numeric value of our feature
	 * @return A color (in the form '#RGB' or '#RRGGBB')
	 */
	color : d3.scaleLinear()
		.domain([0.5, 2.0])
		.range(['#e6eeff', '#003399']),

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
			[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
			["0.5", "", "1", "", "1.5", "", "2"]
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
