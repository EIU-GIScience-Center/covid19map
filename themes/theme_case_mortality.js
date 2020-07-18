// A map theme that shows the cumulative rate and number of cases in each district.

// Utility variables and functions specific to this theme
// Please follow naming convention: all constants and variables here should start with theme name
// To avoid conflicts with similar variables in other theme modules
/* eslint-env es6 */
/* eslint-disable */
const themeCaseMortality = {
	/**
	 * The name under which this variable shows up in the variable selector
	 *
	 * type: string
	 */
	themeName: "Mortality Ratio (cumulative)",

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
