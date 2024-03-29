// A map theme that shows the cumulative rate and number of cases in each district.

// Utility variables and functions specific to this theme
// Please follow naming convention: all constants and variables here should start with theme name
// To avoid conflicts with similar variables in other theme modules
/* eslint-env es6 */
/* eslint-disable */


// The theme object
const themeDailyCases = {
	 // string: name under which this theme shows up in the theme selector
	themeName: "Daily Cases",

	// string: brief description, to show in the main window
	briefDescription: "New cases reported in the most recent 24-hour period.",
    
	// array of strings: A list of variables required to show this map theme
	requiredVariables: ["cases"],

	// function of all features, one date returning string label for aggregate value across all features
	aggregateLabelFcn: function(feats,date){
		var totalCases=0;
		var totalPop=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			totalCases += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1]);
			var pop = dataSource.getPopulation(feat);
			totalPop += pop;
		}
		var aggLbl = "";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg= "total: " + withCommas(totalCases.toFixed(0))  + "<b> (" + withCommas(toAppropriateDecimals(1000000*totalCases/totalPop)) + "/million)</b>";
		return msg;
	},

	// function of feature, date used to determine a feature's color
	choroplethValueFcn: function (feat, date) {
		var avg = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1]);
		if(avg < 0.49){avg=0.49};
		return avg;
	},

	// color interpolators to determine the feature fill color associated with a given value
	choroplethColorInterpolator: d3.interpolatePlasma,

	// function to transform choropleth values to a linear range (e.g. from 0 to 1)
    choroplethValueScale: function(d){
            if(d < 0){
                return Math.pow(Math.log(0 + 100),0.7);
            } else {
                return Math.pow(Math.log(d + 100),0.7);
            }
        },
	// If true, the color scheme will be reversed.
	invertColorScale: true,

	// The values to show colors for on the choropleth legend
	choroplethCells: expBase10CellsAndLabels()[0],

	// Corresponding labels on the choropleth legend (should be the same length as "cells")
	choroplethLabels: expBase10CellsAndLabels()[1],

	// Function to label an arbitrary cell value
	customLabel: function(val){return withCommas(Math.round(val))},

    // Fixed choropleth legend bounds
    legendmin: null,
    legendmax: null,
	
    // true - legend will be updated when user changes the date range
    // false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    fixedChoroplethLegend: false,
	
	// String: title to be used on the legend
	choroplethLegendTitle: "New Cases Per Million",
    circleLegendTitle: "New Cases Per Day",

	// string: prefix to the date display for this theme, for example indicating the time period covered
	// no longer used (?)
	datePrefix: "",

	// function of (feature, date) or fixed number representing the base radius of the circle symbol (set to zero for no circles).
	circle: true,
    circleAreaFcn: function (feat, date) {
		var todayCases = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases',false, true);}, [1]);
				if(todayCases > 0){
					return todayCases;
				} else {
					return 0;
				}
	},

	// The fill color of the circle
	circleFill: '#45c',

	// border color of the circle
	circleStroke: '#459',
	
	// function of (feature, date) that gives the tooltip text
	tooltipTextFcn: function (feat, date) {
		var pop = dataSource.getPopulation(feat);
		var new_case_count = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1])
		var new_case_rate = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1])
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + new_case_count.toFixed(0) + " new cases</p>";
		msg += "<p><b>" + toAppropriateDecimals(new_case_rate) + " new cases per million</b></p>";		
		return msg;
	}
};

const themeDailyDeaths = {
	 // string: name under which this theme shows up in the theme selector
	themeName: "Daily Deaths",

	// string: brief description, to show in the main window
	briefDescription: "New deaths reported in the most recent 24-hour period.",
    
	// array of strings: A list of variables required to show this map theme
	requiredVariables: ["deaths"],
	
	// function of all features, one date returning string label for aggregate value across all features
	aggregateLabelFcn: function(feats,date){
		var totalDeaths=0;
		var totalPop=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			totalDeaths += periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1]);
			var pop = dataSource.getPopulation(feat);
			totalPop += pop;
		}
		var aggLbl = "";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg= "total: " + withCommas(totalDeaths.toFixed(0)) + "<b> (" + withCommas(toAppropriateDecimals(1000000*totalDeaths/totalPop)) + "/million)</b>";
		return msg;
	},
	
	// function of feature, date used to determine a feature's color
	choroplethValueFcn: function (feat, date) {
		var avg = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', true, true)}, [1]);
		if(avg < 0.49){avg=0.49};
		return avg;
	},

	// color interpolators to determine the feature fill color associated with a given value
	choroplethColorInterpolator: d3.interpolatePlasma,

	// function to transform choropleth values to a linear range (e.g. from 0 to 1)
    choroplethValueScale: function(d){
            if(d < 0){
                return Math.pow(Math.log(0 + 100),0.7);
            } else {
                return Math.pow(Math.log(d + 100),0.7);
            }
        },
	// If true, the color scheme will be reversed.
	invertColorScale: true,

	// The values to show colors for on the choropleth legend
	choroplethCells: expBase10CellsAndLabels()[0],

	// Corresponding labels on the choropleth legend (should be the same length as "cells")
	choroplethLabels: expBase10CellsAndLabels()[1],

	// Function to label an arbitrary cell value
	customLabel: function(val){return withCommas(Math.round(val))},
	
    // Fixed choropleth legend bounds
    legendmin: null,
    legendmax: null,
	
    // true - legend will be updated when user change the date
    // false - legend will not be updated and have fixed value from above(legendmin & legendmax)
    fixedChoroplethLegend: false,
	
	// String: title to be used on the legend
	choroplethLegendTitle: "New Deaths Per Million",
    circleLegendTitle: "New Deaths Per Day",

	// string: prefix to the date display for this theme, for example indicating the time period covered
	// no longer used (?)
	datePrefix: "",

	// function of (feature, date) or fixed number representing the base radius of the circle symbol (set to zero for no circles).
	circle: true,
    circleAreaFcn: function (feat, date) {
		var todaydeaths = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths',false, true);}, [1]);
        if(isNaN(todaydeaths)){return 0;};
        if(todaydeaths > 0){
					return todaydeaths;
				} else {
					return 0;
				}
	},

	// The fill color of the circle
	circleFill: '#45c',

	// border color of the circle
	circleStroke: '#459',
	
	// function of (feature, date) that gives the tooltip text
	tooltipTextFcn: function (feat, date) {
		var pop = dataSource.getPopulation(feat);
		var new_death_count = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1])
		var new_death_rate = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', true, true)}, [1])
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + new_death_count.toFixed(0) + " new deaths</p>";
		msg += "<p><b>" + toAppropriateDecimals(new_death_rate) + " new deaths per million</b></p>";		
		return msg;
	}
};

const themeWeeklyCases = {
	themeName: "Weekly Cases",
	briefDescription: "New cases recorded in the most recent 7-day period.",
	requiredVariables: ["cases"],
	dateRange: [-6,0],
	aggregateLabelFcn: function(feats,date){
		var totalCases=0;
		var totalPop=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			totalCases += 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]);
			var pop = dataSource.getPopulation(feat);
			totalPop += pop;
		}
		var aggLbl = "overall";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg= "total: " + withCommas(totalCases.toFixed(0)) + "<b> (" + withCommas(toAppropriateDecimals(1000000*totalCases/totalPop)) + "/million)</b>";
		return msg;
	},
	choroplethValueFcn: function (feat, date) {
		var avg = 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1,1,1,1,1]);
		if(avg < 0.49){avg=0.49};
		return avg;
	},
	quickChoroplethValueFcn: function(feat,date){
		var dailyCaseRate = parseInt(7*getValue(feat,date,'cases', true, true));
		if(dailyCaseRate < 0.49){dailyCaseRate=0.49;}
		return dailyCaseRate;
	},
	choroplethColorInterpolator: d3.interpolatePlasma,
    choroplethValueScale: function(d){
            if(d < 0){
                return Math.pow(Math.log(0 + 10),1);
            } else {
                return Math.pow(Math.log(d + 10),1);
            }
        },
	invertColorScale: true,
	choroplethCells: expBase10CellsAndLabels()[0],
	choroplethLabels: expBase10CellsAndLabels()[1],
	customLabel: function(val){return withCommas(Math.round(val))},
    legendmin: null,
    legendmax: null,
    fixedChoroplethLegend: false,
	choroplethLegendTitle: "New Cases Per Million",
    circleLegendTitle: "New Cases Per Week",
	datePrefix: "week ending",
	circle: true,
    circleAreaFcn: function (feat, date) {
		var weeklyCases = parseInt(7*periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]))
		if(weeklyCases > 0){
			return weeklyCases;
		} else {
			return 0;
		}
	},
	quickCircleAreaFcn: function(feat,date){
		var dailyCases = parseInt(7*getValue(feat,date,'cases', false, true))
		if(dailyCases > 0){
			return dailyCases;
		} else {
			return 0;
		}		
	},
	circleFill: '#45c',
	circleStroke: '#459',
	tooltipTextFcn: function (feat, date) {
		var pop = dataSource.getPopulation(feat);
		var new_case_count = parseInt(7*periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]))
		var new_case_rate = 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1,1,1,1,1])
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + withCommas(new_case_count) + " new cases/week</p>";
		msg += "<p><b>" + toAppropriateDecimals(new_case_rate) + " new cases per million</b></p>";		
		return msg;
	}
};

const themeWeeklyDeaths = {
	themeName: "Weekly Deaths",
	briefDescription: "New deaths recorded in the most recent 7-day period.",
	requiredVariables: ["deaths"],
	dateRange: [-6,0],
	choroplethValueFcn: function (feat, date) {
		var avg = 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', true, true)}, [1,1,1,1,1,1,1]);
		if(avg < 0.49){avg=0.49};
		return avg;
	},
	quickChoroplethValueFcn: function(feat,date){
		var dailyDeathRate = parseInt(7*getValue(feat,date,'deaths', true, true));
		if(dailyDeathRate < 0.49){dailyCaseRate=0.49;}
		return dailyDeathRate;
	},

	aggregateLabelFcn: function(feats,date){
		var totalDeaths=0;
		var totalPop=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			totalDeaths += 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1]);
			var pop = dataSource.getPopulation(feat);
			totalPop += pop;
		}
		var aggLbl = "overall";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg= "total: " + withCommas(totalDeaths.toFixed(0)) + "<b> (" + withCommas(toAppropriateDecimals(1000000*totalDeaths/totalPop)) + "/million)</b>";
		return msg;
	},

	choroplethColorInterpolator: d3.interpolatePlasma,
    choroplethValueScale: function(d){
            if(d < 0){
                return Math.pow(Math.log(0 + 10),0.7);
            } else {
                return Math.pow(Math.log(d + 10),0.7);
            }
        },
	invertColorScale: true,
	choroplethCells: expBase10CellsAndLabels()[0],
	choroplethLabels: expBase10CellsAndLabels()[1],
	customLabel: function(val){return withCommas(Math.round(val))},
    legendmin: null,
    legendmax: null,
    fixedChoroplethLegend: false,
	choroplethLegendTitle: "New Deaths Per Million",
    circleLegendTitle: "New Deaths Per Week",
	datePrefix: "week ending",
    circle: true,
    circleAreaFcn: function (feat, date) {
		var weeklyDeaths = parseInt(7*periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1]))
				if(weeklyDeaths > 0){
					return weeklyDeaths;
				} else {
					return 0;
				}
	},
	quickCircleAreaFcn: function(feat,curd){
		var dailyDeaths = parseInt(7*getValue(feat,curd,'deaths', false, true))
		if(dailyDeaths > 0){
			return dailyDeaths;
		} else {
			return 0;
		}		
	},
	circleFill: '#45c',
	circleStroke: '#459',
	tooltipTextFcn: function (feat, date) {
		var pop = dataSource.getPopulation(feat);
		var new_death_count = parseInt(7*periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1]))
		var new_death_rate = 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', true, true)}, [1,1,1,1,1,1,1])
		msg = "<p>Population: " + withCommas(pop) + "</p>";
		msg += "<p>" + withCommas(new_death_count) + " new deaths/week</p>";
		msg += "<p><b>" + toAppropriateDecimals(new_death_rate) + " new deaths per million</b></p>";		
		return msg;
	}
};

const themeDailyChangeCases = {
	themeName: "Daily Change in Cases",
	briefDescription: "The ratio of new cases today to new cases one week ago.",
	requiredVariables: ["cases"],
	dateRange: [-13,-7,-6,0],
	aggregateLabelFcn: function(feats,date){
		var todayCases=0;
		var casesOneWeekAgo=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			todayCases += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1]);
			casesOneWeekAgo += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,0,0,0,0,0,0,1]);
		}
		var msg = "";
		if(casesOneWeekAgo==0){
			if(todayCases==0){
				msg = "no data"; 
			} else {
				msg = "no data for prior week"; 
			}
		} else {
			var ratio = todayCases/casesOneWeekAgo; 
			if(ratio < 1){
				ratio = 100*(1-ratio);
				msg = "-" + ratio.toFixed(0) + "%";
			} else {
				ratio = 100*(ratio-1);
				msg = "+" + ratio.toFixed(0) + "%";
			}
		}
		var aggLbl = "overall";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg = aggLbl + " overall: " + msg;
		return msg;
	},
	choroplethValueFcn: function (feat, date) {
		var currentCases = getValue(feat,date,'cases', false, false)
		var currentCasesPerMillion = getValue(feat,date,'cases', true, false)
		var increaseInCases = getValue(feat,date,'cases', false, true)
		var this_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1])
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,0,0,0,0,0,0,1])
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

	choroplethColorInterpolator: d3.interpolateRdBu,
	choroplethValueScale: function(d){return d;},
	invertColorScale: true,
	choroplethCells: [0.2,0.5,0.7,0.8,0.9,1,1.1,1.2,1.3,1.5,1.8],
	choroplethLabels: ["","-50%","","-20%","","even","","+20%","","+50%",""],
    customLabel: function(val){
		if(val < 1){
			return "-" + Math.round(1-curVal).toString() + "%"
		} else {
			return "+" + Math.round(curVal-1).toString() + "%"
		}
	},
	legendmin: 0.2,
    legendmax: 1.8,
    fixedChoroplethLegend: true,
	choroplethLegendTitle: "Increase in cases vs. one week ago",
	datePrefix: "week ending",
    circle: false,
	circleAreaFcn: function (feat, date) {return 0;},
	circleFill: '#45c',
	circleStroke: '#459',
	tooltipTextFcn: function (feat, date) {
		var one_week_ago = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,0,0,0,0,0,0,1])
		var today = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1])		
		var increase;
		if(one_week_ago==0){
			var increase="Increase: n/a";
		} else {
			var increase = today/one_week_ago ;
			if (increase <= 1){
				increase = 100*(1-increase);
				increase = "Decrease: " + increase.toFixed(1) + "%"
			} else {
				increase = 100*(increase-1);
				increase = "Increase: " + increase.toFixed(1) + "%"
			}
			
		}
		msg = "<p>One week ago: " + one_week_ago.toFixed(1) + " new cases/day</p>";
		msg += "<p>Today: " + today.toFixed(1) + " new cases/day</p>";
		msg += "<p><b>" + increase + "</b></p>";		
		return msg;
	}
}


const themeWeeklyChangeCases = {
	themeName: "Weekly Change in Cases",
	briefDescription: "The ratio of new cases in the past 7 days to new cases in the 7 days prior.",
	requiredVariables: ["cases"],
	dateRange: [-13,-7,-6,0],
	aggregateLabelFcn: function(feats,date){
		var thisWeekTotalCases=0;
		var priorWeekTotalCases=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			thisWeekTotalCases += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]);
			priorWeekTotalCases += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1]);
		}
		var msg = "";
		if(priorWeekTotalCases==0){
			if(thisWeekTotalCases==0){
				msg = "no data"; 
			} else {
				msg = "no data for prior week"; 
			}
		} else {
			var ratio = thisWeekTotalCases/priorWeekTotalCases; 
			if(ratio < 1){
				ratio = 100*(1-ratio);
				msg = "-" + ratio.toFixed(0) + "%";
			} else {
				ratio = 100*(ratio-1);
				msg = "+" + ratio.toFixed(0) + "%";
			}
		}
		var aggLbl = "overall";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg = aggLbl + " overall: " + msg;
		return msg;
	},
	choroplethValueFcn: function (feat, date) {
		//var currentCases = getValue(feat,date,'cases', false, false)
		//var currentCasesPerMillion = getValue(feat,date,'cases', true, false)
		//var increaseInCases = getValue(feat,date,'cases', false, true)
		var this_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1])
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1])
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
	quickChoroplethValueFcn: function (feat, date) {
		//var currentCases = getValue(feat,date,'cases', false, false)
		//var currentCasesPerMillion = getValue(feat,date,'cases', true, false)
		//var increaseInCases = getValue(feat,date,'cases', false, true)
		var this_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [1])
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, true)}, [0,0,0,0,0,0,0,1])
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

	choroplethColorInterpolator: d3.interpolateRdBu,
	choroplethValueScale: function(d){return d;},
	invertColorScale: true,
	choroplethCells: [0.2,0.5,0.7,0.8,0.9,1,1.1,1.2,1.3,1.5,1.8],
	choroplethLabels: ["","-50%","","-20%","","even","","+20%","","+50%",""],
    customLabel: function(val){
		if(val < 1){
			return "-" + Math.round(1-val).toString() + "%"
		} else {
			return "+" + Math.round(val-1).toString() + "%"
		}
	},
    legendmin: 0.2,
    legendmax: 1.8,
    fixedChoroplethLegend: true,
	choroplethLegendTitle: "Increase in cases vs. prior week",
	datePrefix: "week ending",
    circle: false,
	circleAreaFcn: function (feat, date) {return 0;},
	circleFill: '#45c',
	circleStroke: '#459',
	tooltipTextFcn: function (feat, date) {
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
		msg = "<p>Previous week: " + prior_week.toFixed(1) + " new cases/day</p>";
		msg += "<p>This week: " + this_week.toFixed(1) + " new cases/day</p>";
		msg += "<p><b>" + increase + "</b></p>";		
		return msg;
	}
}

const themeWeeklyChangeDeaths = {
	themeName: "Weekly Change in Deaths",
	briefDescription: "The ratio of new deaths in the past 7 days to new deaths in the 7 days prior.",
	requiredVariables: ["deaths"],
	dateRange: [-13,-7,-6,0],
	aggregateLabelFcn: function(feats,date){
		var thisWeekTotalDeaths=0;
		var priorWeekTotalDeaths=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			thisWeekTotalDeaths += periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1]);
			priorWeekTotalDeaths += periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1]);
		}
		var msg = "";
		if(priorWeekTotalDeaths==0){
			if(thisWeekTotalDeaths==0){
				msg = "no data"; 
			} else {
				msg = "no data for prior week"; 
			}
		} else {
			var ratio = thisWeekTotalDeaths/priorWeekTotalDeaths; 
			if(ratio < 1){
				ratio = 100*(1-ratio);
				msg = "-" + ratio.toFixed(0) + "%";
			} else {
				ratio = 100*(ratio-1);
				msg = "+" + ratio.toFixed(0) + "%";
			}
		}
		var aggLbl = "overall";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg= aggLbl + " overall: " + msg;
		return msg;
	},
	choroplethValueFcn: function (feat, date) {
		var currentDeaths = getValue(feat,date,'deaths', false, false)
		var currentDeathsPerMillion = getValue(feat,date,'deaths', true, false)
		var increaseInDeaths = getValue(feat,date,'deaths', false, true)
		var this_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1])
		var prior_week = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [0,0,0,0,0,0,0,1,1,1,1,1,1,1])
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
	choroplethColorInterpolator: d3.interpolateRdBu,
	choroplethValueScale: function(d){return d;},
	invertColorScale: true,
	choroplethCells: [0.2,0.5,0.7,0.8,0.9,1,1.1,1.2,1.3,1.5,1.8],
	choroplethLabels: ["","-50%","","-20%","","even","","+20%","","+50%",""],
    customLabel: function(val){
		if(val < 1){
			return "-" + Math.round(1-curVal).toString() + "%"
		} else {
			return "+" + Math.round(curVal-1).toString() + "%"
		}
	},
    legendmin: 0.2,
    legendmax: 1.8,
    fixedChoroplethLegend: true,
	choroplethLegendTitle: "Increase in deaths vs. prior week",
	datePrefix: "week ending",
    circle: false,
	circleAreaFcn: function (feat, date) {return 0;},
	circleFill: '#45c',
	circleStroke: '#459',
	tooltipTextFcn: function (feat, date) {
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
		msg = "<p>Previous week: " + prior_week.toFixed(1) + " deaths/day</p>";
		msg += "<p>This week: " + this_week.toFixed(1) + " deaths/day</p>";
		msg += "<p><b>" + increase + "</b></p>";		
		return msg;
	}
}

const themeWeeklyPositivityRate = {
	themeName: "Weekly Positivity Rate",
	briefDescription: "The ratio of positive test results to total tests during the most recent 7-day period.",
	requiredVariables: ["cases", "tests"],
	dateRange: [-6,0],
	
	aggregateLabelFcn: function(feats,date){
		var newCases=0;
		var newTests=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			newCases += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1,1,1,1,1]);
			newTests += periodAverage(feat, date, function(f,d){return getValue(f,d,'tests', true, true)}, [1,1,1,1,1,1,1]);
		}
		var aggLbl = "overall: ";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel() + " overall: ";};
		if(newTests==0){
			aggLbl += "no test data"; 
		} else {
			var pct = 100*newCases/newTests;
			aggLbl += pct.toFixed(1);
		}
		return aggLbl;
	},
	
	choroplethValueFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var newcases = periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', true, true)}, [1,1,1,1,1,1,1]);
		var newtests = periodAverage(feat, date, function(f,d){return getValue(f,d,'tests', true, true)}, [1,1,1,1,1,1,1]);
		if(newtests==0){return 0;} else {return 100*newcases/newtests;}
	},
	choroplethColorInterpolator: d3.interpolateRdBu,
	choroplethValueScale: function(d){
		if(d < 0){
			return Math.pow(Math.log(0 + 1),3);
		} else {
			return Math.pow(Math.log(d + 1),3);
		}
	},
	invertColorScale: true,
	choroplethCells: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
	choroplethLabels: ["","~ 1%","","","","5%","","","","","10%","","","","","15% ~"], 
    customLabel: function(val){return Math.round(val).toString() + "%"},
    legendmin: 0,
    legendmax: 15,
    fixedChoroplethLegend: true,
	choroplethLegendTitle: "Percent of tests with positive result.",
	datePrefix: "week ending",
    circle: false,
	circleAreaFcn: function (feat, date) {return 0;},
	circleFill: '#f47',
	circleStroke: '#a04',
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

const themeWeeklyCaseMortality = {
	themeName: "Weekly Case Mortality",
	briefDescription: "The ratio of deaths in the past 7 days to new confirmed cases 3 weeks earlier.",
	requiredVariables: ["cases","deaths"],
	dateRange: [-6,0],
	aggregateLabelFcn: function(feats,date){
		var totNewCases=0;
		var totNewDeaths=0;
		var dateID = dataSource.dates.indexOf(date);
		var prevDate = dataSource.dates[dateID-21];
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			var newCases = 7*periodAverage(feat, prevDate, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]);
			var newDeaths = 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1]);
			totNewCases += newCases;
			totNewDeaths += newDeaths;
		}
		var aggLbl = "overall: ";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel() + " overall: ";};
		if(totNewCases==0){
			aggLbl += "no case data"; 
		} else {
			var pct = 100*totNewDeaths/totNewCases;
			aggLbl += pct.toFixed(1) + "%";
		}
		console.log(aggLbl);
		return aggLbl;
	},
	choroplethValueFcn: function (feat, date) {
		var dateID = dataSource.dates.indexOf(date);
		if(dateID < 21){
			return 0;
		} else {			
			var prevDate = dataSource.dates[dateID-21];
			var state = feat.properties["ABBREV"];		
			var cases = periodAverage(feat, prevDate, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]);
			var deaths = periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1]);
			if(cases==0){return 0;} else {return 100*deaths/cases;}
		}
	},
	choroplethColorInterpolator: d3.interpolatePuOr,
	choroplethValueScale: function(d){
		if(d < 0){
			return Math.pow(Math.log(0 + 1),1.5);
		} else {
			return Math.pow(Math.log(d + 1),1.5);
		}
	},
	invertColorScale: false,
	choroplethCells: [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],
	choroplethLabels: ["","~ 1%","","","","3%","","","","5%","","","","7%","","","","9% ~",""], 
    legendmin: 0,
    legendmax: 10,
    fixedChoroplethLegend: true,
	choroplethLegendTitle: "Ratio of deaths in the past 7 days to new cases 3 weeks earlier..",
	datePrefix: "week ending",
    circle: false,
	circleAreaFcn: function (feat, date) {return 0;},
	circleFill: '#f47',
	circleStroke: '#a04',
	tooltipTextFcn: function (feat, date) {
		var dateID = dataSource.dates.indexOf(date);
		if(dateID < 21){
			return "insufficient data";
		} else {
			var prevDate = dataSource.dates[dateID-21];
			var state = feat.properties["ABBREV"];		
			//var cases = getValue(feat, prevDate, 'cases');
			//var deaths = getValue(feat, date, 'deaths');
			var cases = 7*periodAverage(feat, prevDate, function(f,d){return getValue(f,d,'cases', false, true)}, [1,1,1,1,1,1,1]);
			var deaths = 7*periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, true)}, [1,1,1,1,1,1,1]);
			var ptr;
			if(cases==0){ptr=0} else {ptr = 100*deaths/cases};
			var msg = "<p>Deaths (past week): " + withCommas(deaths.toFixed(0)) + "</p>";
			msg += "<p>Cases (3 weeks prior): " + withCommas(cases.toFixed(0)) + "</p>";
			msg += "<p><b>Case Mortality: " + ptr.toFixed(1) + "%</b></p>";
			return msg;
		}
	}	
}

const themeCumulativeCases = {
	themeName: "Cumulative Cases",
	briefDescription: "The cumulative number of confirmed cases.",
	requiredVariables: ["cases"],
	aggregateLabelFcn: function(feats,date){
		var totalCases=0;
		var totalPop=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			totalCases += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, false)}, [1]);
			var pop = dataSource.getPopulation(feat);
			totalPop += pop;
		}
		var aggLbl = "";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg= "total: " + withCommas(totalCases.toFixed(0)) + "<b> (" + withCommas(toAppropriateDecimals(1000000*totalCases/totalPop)) + "/million)</b>";
		return msg;
	},
	choroplethValueFcn: function (feat, date) {
		return getValue(feat,date,'cases',true);
	},
	choroplethValueScale: function(d){
		if(d == 0){
			return (0);
		} else {
			return (d);
		}
	},
	choroplethColorInterpolator: d3.interpolatePlasma,
	invertColorScale: true,
	choroplethCells: expBase10CellsAndLabels()[0],
	choroplethLabels: expBase10CellsAndLabels()[1],
	customLabel: function(val){return withCommas(Math.round(val))},
    legendmin: 0,
    legendmax: 10000,
    fixedChoroplethLegend: false,
	choroplethLegendTitle: "Cases Per Million",
    circleLegendTitle: "Total Cases",
	datePrefix: "total through",
	circle: true,
    circleAreaFcn: function (feat, date) {
		var totalCases = getValue(feat,date,'cases',false);
		return totalCases;
	},
	circleFill: '#45c',
	circleStroke: '#459',
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
		msg += "<p><b>" + withCommas(toAppropriateDecimals(case_rate)) + " cases per million</b></p>";		
		return msg;
	}
}

const themeCumulativeDeaths = {
	themeName: "Cumulative Deaths",
	briefDescription: "The cumulative number of deaths.",
	requiredVariables: ["deaths"],
	aggregateLabelFcn: function(feats,date){
		var totalDeaths=0;
		var totalPop=0;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			totalDeaths += periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, false)}, [1]);
			var pop = dataSource.getPopulation(feat);
			totalPop += pop;
		}
		var aggLbl = "";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		msg= "total: " + withCommas(totalDeaths.toFixed(0)) + "<b> (" + withCommas(toAppropriateDecimals(1000000*totalDeaths/totalPop)) + "/million)</b>";
		return msg;
	},
	choroplethValueFcn: function (feat, date) {
		return getValue(feat,date,'cases',true);
	},
	choroplethValueFcn: function (feat, date) {
		return getValue(feat,date,'deaths',true);
	},
	choroplethValueScale: function(d){
		if(d == 0){
			return (0);
		} else {
			return (d);
		}
	},
	choroplethColorInterpolator: d3.interpolatePlasma,
	invertColorScale: true,
	choroplethCells: expBase10CellsAndLabels()[0],
	choroplethLabels: expBase10CellsAndLabels()[1],
	customLabel: function(val){return withCommas(Math.round(val))},
    legendmin: 0,
    legendmax: 10000,
    fixedChoroplethLegend: false,
	choroplethLegendTitle: "deaths Per Million",
    circleLegendTitle: "Total deaths",
	datePrefix: "total through",
	circle: true,
    circleAreaFcn: function (feat, date) {
		var totaldeaths = getValue(feat,date,'deaths',false);
		return totaldeaths;
	},
	circleFill: '#45c',
	circleStroke: '#459',
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
		msg += "<p><b>" + withCommas(toAppropriateDecimals(death_rate)) + " deaths per million</b></p>";	
        msg += "<p>Total Mortality: " + tdr.toFixed(2) + "%</p>";
		return msg;
	}
}

const themeCumulativePositivityRate = {
	themeName: "Cumulative Positivity Rate",
	briefDescription: "The ratio of positive test results to total tests.",
	requiredVariables: ["cases", "tests"],
	aggregateLabelFcn: function(feats,date){
		var totalCases=0;
		var totalTests=0;
		var ratio;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			totalCases += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, false)}, [1]);
			totalTests += periodAverage(feat, date, function(f,d){return getValue(f,d,'tests', false, false)}, [1]);
		}
		var aggLbl = "overall";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		if(totalTests==0){
			ratio = "no tests reported";
		} else {
			ratio = 100*totalCases/totalTests;
			ratio = ratio.toFixed(1).toString() + "%";
		}
		msg= aggLbl + ": " + ratio;
		return msg;
	},
	choroplethValueFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var cases = getValue(feat, date, 'cases');
		var tests = getValue(feat, date, 'tests');
		if(tests==0){return 0;} else {return 100*cases/tests;}
	},
	choroplethColorInterpolator: d3.interpolateRdBu,
	choroplethValueScale: function(d){
		if(d < 0){
			return Math.pow(Math.log(0 + 1),3);
		} else {
			return Math.pow(Math.log(d + 1),3);
		}
	},
	invertColorScale: true,
	choroplethCells: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
	choroplethLabels: ["","~ 1%","","","","5%","","","","","10%","","","","","15% ~"], 
    legendmin: 0,
    legendmax: 15,
    fixedChoroplethLegend: true,
	choroplethLegendTitle: "Percent of tests with positive result.",
	datePrefix: "total through",
    circle: false,
	circleAreaFcn: function (feat, date) {return 0;},
	circleFill: '#f47',
	circleStroke: '#a04',
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
		msg += "<p><b>Positive Ratio: " + ptr + "</b></p>";
		return msg;
	}	
}

const themeCumulativeCaseMortality = {
	themeName: "Cumulative Case Mortality",
	briefDescription: "The ratio of deaths to total confirmed cases.",
	requiredVariables: ["cases", "deaths"],
	aggregateLabelFcn: function(feats,date){
		var totalCases=0;
		var totalDeaths=0;
		var ratio;
		for(i=0;i<feats.length;i++){
			var feat = feats[i];
			totalCases += periodAverage(feat, date, function(f,d){return getValue(f,d,'cases', false, false)}, [1]);
			totalDeaths += periodAverage(feat, date, function(f,d){return getValue(f,d,'deaths', false, false)}, [1]);
		}
		var aggLbl = "overall";
		if(dataSource.aggregateLabel != undefined){aggLbl = dataSource.aggregateLabel();};
		if(totalCases==0){
			ratio = "no cases reported";
		} else {
			ratio = 100*totalDeaths/totalCases;
			ratio = ratio.toFixed(1).toString() + "%";
		}
		msg= aggLbl + ": " + ratio;
		return msg;
	},	
	
	
	
	choroplethValueFcn: function (feat, date) {
		var state = feat.properties["ABBREV"];		
		var cases = getValue(feat, date, 'cases');
		var deaths = getValue(feat, date, 'deaths');
		if(cases==0){return 0;} else {return 100*deaths/cases;}
	},
	choroplethColorInterpolator: d3.interpolatePuOr,
	choroplethValueScale: function(d){
		if(d < 0){
			return Math.pow(Math.log(0 + 1),1.5);
		} else {
			return Math.pow(Math.log(d + 1),1.5);
		}
	},
	invertColorScale: false,
	choroplethCells: [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5],
	choroplethLabels: ["","~ 1%","","","","3%","","","","5%","","","","7%","","","","9% ~",""], 
    legendmin: 0,
    legendmax: 10,
    fixedChoroplethLegend: true,
	choroplethLegendTitle: "Deaths as a percent of cases",
	datePrefix: "total through",
    circle: false,
	circleAreaFcn: function (feat, date) {return 0;},
	circleFill: '#f47',
	circleStroke: '#a04',
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
		msg += "<p><b>Case Mortality: " + ptr.toFixed(1) + "%</b></p>";
		return msg;
	}	
}




/*
const themeWeeklyChangeCases = {
	themeName: "Today vs. prior week",
	briefDescription: "The difference between today's cases and the average for the past week.",
	requiredVariables: ["cases"],
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
	choroplethColorInterpolator: d3.interpolateRdBu,
	choroplethValueScale: function(d){return d;},
	invertColorScale: true,
	choroplethCells: [0.2,0.5,0.7,0.8,0.9,1,1.1,1.2,1.3,1.5,1.8],
	choroplethLabels: ["","-50%","","-20%","","even","","+20%","","+50%",""],
    legendmin: 0.2,
    legendmax: 1.8,
    fixedChoroplethLegend: true,
	choroplethLegendTitle: "Increase vs. previous week",
	circleRadiusFcn: 0,
	circleFill: '#45c',
	circleStroke: '#459',
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
*/

