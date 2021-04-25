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

function nPreviousDate(date,dates,n){
	var finalDate = date;
	var nRemaining=n;
	while (nRemaining < 0){
		finalDate = previousDate(finalDate,dates);
		nRemaining +=1;
	}
	return finalDate;
}

function dateRangeExpression(date1,date2,includeYear, abbreviatedMonth=false){
	// parse year, month and day
	var jsDate1 = new Date(date1);
	var jsDate2 = new Date(date2);
	var y1,m1,d1,y2,m2,d2;
	y1=jsDate1.getFullYear();
	m1 = jsDate1.getMonth();
	d1 = jsDate1.getDate();
	y2=jsDate2.getFullYear();
	m2 = jsDate2.getMonth();
	d2 = jsDate2.getDate();
	
	
	console.log("DEBUGGING DATERANGEEXPRESSION");
	console.log([date1,date2]);
	console.log([y1,m1,d1,y2,m2,d2]);
	
	// handle case of different years
	if(includeYear && y1 != y2){
		return date1 + " - " + date2
	} else {		
		var expr = monthString(m1+1) + " " + d1 + " - ";
		if(abbreviatedMonth){expr = (m1+1) + "/" + d1 + "-";}
		if(m1==m2){
			expr += d2;
		} else {
			var expr2 = monthString(m2+1) + " " + d2;
			if(abbreviatedMonth){expr = (m2+1) + "/" + d1;}
			expr += expr2;
		}
		if(includeYear){
			var expr3 = ", " + y1
			if(abbreviatedMonth){expr3 = "/" + y1;}
			expr += expr3;
		}
		return expr;
	}
}

/*
 determines a date range string for a given base date and date range
  baseDate: the current date, as a string
  dateOffsets: array with 0, 2 or 4 relative offsets from baseDate
*/
function datePeriodExpression(baseDate, dateOffsets, allDates){
	if(baseDate == undefined){
		return "";
	} else if(dateOffsets == undefined){
		return baseDate;
	} else if(dateOffsets.length==0) {
		return baseDate;
	} else if(dateOffsets.length==2) {
		var date1 = nPreviousDate(baseDate,allDates,dateOffsets[0]);
		var date2 = nPreviousDate(baseDate,allDates,dateOffsets[1]);
		return dateRangeExpression(date1,date2,false,true);
	} else if(dateOffsets.length==4) {
		var date1 = nPreviousDate(baseDate,allDates,dateOffsets[0]);
		var date2 = nPreviousDate(baseDate,allDates,dateOffsets[1]);
		var date3 = nPreviousDate(baseDate,allDates,dateOffsets[2]);
		var date4 = nPreviousDate(baseDate,allDates,dateOffsets[3]);
		var expr1 = dateRangeExpression(date1,date2,false,true);
		var expr2 = dateRangeExpression(date3,date4,false,true);
		return "(" + expr1 + ") vs. (" + expr2 + ")";
	}

}



/**
 * Adds commas to a number for display purposes
 */
function withCommas(num) {
	if(num == undefined){
		return "";
	} else {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}
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

function tickDateIds(dates,maxMonthTicks){
	var out_ids = [];
	// get ids of all dates with new month
	// first date
	out_ids.push(0);
	var this_date_str = dates[0];
	var date = new Date(this_date_str);
	var last_month = date.getDate();
	for(let i=0; i < dates.length; i++){
		this_date_str = dates[i];
		date = new Date(this_date_str);
		var month = date.getMonth();
		if(month != last_month){
			last_month = month;
			out_ids.push(i);
		}
	}
	return out_ids;
}
