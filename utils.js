// load functions that don't require data, map or slider to be loaded
/* eslint-env es6 */
/* eslint-disable */
/**
 * Provides the 3-letter abbrev. for a given month ID # (1-12)
 */
function monthString(monthID){
	if (monthID==1){return "Jan";}
	if (monthID==2){return "Feb";}
	if (monthID==3){return "Mar";}
	if (monthID==4){return "Apr";}
	if (monthID==5){return "May";}
	if (monthID==6){return "Jun";}
	if (monthID==7){return "Jul";}
	if (monthID==8){return "Aug";}
	if (monthID==9){return "Sep";}
	if (monthID==10){return "Oct";}
	if (monthID==11){return "Nov";}
	if (monthID==12){return "Dec";}
	return ""; // if monthID is invalid, don't break the code - just show nothing
}

function daysInMonth(monthID){
	if (monthID==1){return 31;}
	if (monthID==2){return 28;}
	if (monthID==3){return 31;}
	if (monthID==4){return 30;}
	if (monthID==5){return 31;}
	if (monthID==6){return 30;}
	if (monthID==7){return 31;}
	if (monthID==8){return 31;}
	if (monthID==9){return 30;}
	if (monthID==10){return 31;}
	if (monthID==11){return 30;}
	if (monthID==12){return 31;}
	return -1; // if monthID is invalid, don't break the code - just show nothing
}


/**
 * Takes a date in YYYYMMDD format and returns the year, monthID and day as integers
 */
function parseDate(dateString){
	var dateInteger = parseInt(dateString);
	var year = Math.floor(dateInteger/10000);	
	var dateInteger = dateInteger-year*10000;
	var month = Math.floor(dateInteger/100);
	var day = dateInteger - month*100;
	return [year, month, day];
}

/**
 * Returns the date prior to the input date in the dates array, or null if input is first date in array
 */
function previousDate(date, dates){
	if(date==null){return null;}
	var dateID = dates.indexOf(date);
	if(dateID==0){
		return null;
	} else {
		return dates[dateID-1];
	}
}

/**
 * Adds commas to a number for display purposes
 */
function withCommas(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/**
 * Formats a number to show 0,1 or 2 decimal places depending on how large it is
 */
function toAppropriateDecimals(rate){
	if(rate < 1){return rate.toFixed(2);}
	else if (rate < 10){return rate.toFixed(1);}
	else {return rate.toFixed(0);}
}

function expBase10CellsAndLabels(minVal=1,maxVal=100000){				
	var cr10 = Math.cbrt(10);
	var curVal = minVal;
	var legendCells = [];
	var legendLabels = [];
	while (curVal < maxVal + 1){
		// add to legend values and labels
		legendCells.push(curVal);
		if (Math.round(curVal)%10 == 0 || Math.round(curVal)==1){
			legendLabels.push(withCommas(Math.round(curVal)));
		} else {
			legendLabels.push("");
		}
		// increment
		curVal *= cr10; 
	}
	return [legendCells, legendLabels];
}

function periodAverage(feat, date, valFunc, periodWts){
	// computes the weighted average for days ending on the input date
	// function must take only feat and date as input
	// example: if weights are [1,0.5,0.25] then the return value
	// will be (1*today+0.5*yesterday+0.25*2daysage)/1.75
	// if the weights extend before the data start date, 
	// data will be averaged from the data start date
	var count=0;
	var valsum=0;
	var weightSum=0;
	var i=0;
	var d=date;
	while(d != null && i < periodWts.length){
		var curval = valFunc(feat,d);
		valsum += periodWts[i] * valFunc(feat, d);
		weightSum += periodWts[i];
		i += 1;
		d = previousDate(d,dataSource.dates);
	}
	if(weightSum==0){
		return 0;
	} else {
		var returnVal = valsum/weightSum;
		if(isNaN(returnVal)){
			return 0
		} else {
			return returnVal;
		}
	}
}

function twoVarAreaAverage(feats, date, numFunc, denFunc) {
	// computes the average for days ending on the input date
	// of the quotient of two functions: numfunc/denfunc
	// function must take only feat and date as input

	let totalA = 0;
	let totalB = 0;

	for (let f in feats) {
		totalA += numFunc(feats[f], date);
		totalB += denFunc(feats[f], date);
	}

	if (totalB == 0) {
		return 0;
	} else {
		return totalA/totalB;
	}

}

function area(coords){
	var a=0;
	for(let i=0; i<coords.length;i++){
		var j = i + 1;
		if(j==coords.length){j=0;}
		var xi=coords[i][0],yi=coords[i][1],xj=coords[j][0],yj=coords[j][1];
		a += (coords[j][0]-coords[i][0])*(coords[i][1]+coords[j][1]);
	}
	return a/2;
}

function featureArea(feat){
	var geo = feat['geometry'];
	var coordlists = geo['coordinates'];
	var featArea=0;
	for(let i=0;i<coordlists.length;i++){
		var coords = coordlists[i][0];
		featArea += area(coords);
	}
	return featArea;
}

function coordCentroid(coords, A=-1){
	var cX=0, cY=0;
	if(A==-1){A = area(coords)}
	for(let i=0; i<coords.length;i++){
		var j = i + 1;
		if(j==coords.length){j=0;}
		var xi=coords[i][0],yi=coords[i][1],xj=coords[j][0],yj=coords[j][1];
		var cross = (xi*yj-xj*yi);
		cX += (xi+xj)*cross;
		cY += (yi+yj)*cross;
	}
	return [-cX/(6*A),-cY/(6*A)];
}

function centroid(feat,A=-1){
	var geo = feat['geometry'];
	var coordlists = geo['coordinates'];
	var maxArea=-1;
	var C;
	for(let i=0;i<coordlists.length;i++){
		var coords = coordlists[i][0];
		var A = area(coords);
		if(A > maxArea){	
			maxArea = A;
			C = coordCentroid(coords,A);
		}
	}
	return C;		
}

function daysBetween(date1,date2){
	parse
}

function nearestDate(date,dates){
	if (dates.includes(date)){
		return date;
	} else {
		
	}
}
