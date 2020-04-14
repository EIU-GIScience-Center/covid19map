// load functions that don't require data, map or slider to be loaded
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

function parseDate(date){
	var year = Math.floor(date/10000);
	var date = date-year*10000;
	var month = Math.floor(date/100);
	var day = date - month*100;
	return [year, month, day];
}

function previousDate(date){
	if(date==null){return null;}
	var dateID = dates.indexOf(date);
	if(dateID==0){
		return null;
	} else {
		return dates[dateID-1];
	}
}

function withCommas(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function withK(num){
	return withCommas(num).replace(',000','k');
	
}

function rateText(rate){
	if(rate < 1){return rate.toFixed(2);}
	else if (rate < 10){return rate.toFixed(1);}
	else {return rate.toFixed(0);}
}