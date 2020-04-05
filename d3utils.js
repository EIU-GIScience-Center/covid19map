const zoom = d3.zoom()
	.scaleExtent([1, 8]);

var colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([0, 1])

function getVals(d,categories){
	var dict = [];
	var p = d.properties;
	for(var k in p){
		if(categories.includes(k)){
			dict[k]=p[k];
		};
	};
	return dict;
};

function sortByValues(obj)
{
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push({key:key, value:obj[key]});
	sortable.sort(function(a, b)
	{
		return a.value-b.value;
	});
	return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function sortedCategories(geodata,categories){
	// Sorts the categories in descending order of total values (e.g. votes)
	// initialize category totals 
	var totals=[];
	categories.forEach(function(cat){
		totals[cat]=0;
	});
	// compute totals
	geodata.features.forEach(function(feature){
		categories.forEach(function(cat){
			var v = feature.properties[cat];
			totals[cat] += v;
		});
	});
	// sort by totals
	totals = sortByValues(totals).reverse();
	// pare back to categories
	var out=[];
	totals.forEach(function(cat){
		out.push(cat.key);
	});
	return out;
}

function getTotal(d,categories){
	var p = d.properties;
	var total = 0;
	for(var k in p){
		if(categories.includes(k)){
			total += p[k];
			};
		};
	return total;
}



function getColor(d,categories, category){
	var vals = d.properties;
	if(vals[category]==0){
		norm=0;
	}
	else {
		var total = getTotal(d,categories);
		var catval = vals[category]
		var p = catval/total
		var norm = 0.01 + p;
	}
	norm=1-norm**0.25;
	return colorScale(norm);
}


function getNoPrj(){
	return d3.geoIdentity().reflectY(true);
//	return d3.geoProjection(function(x,y){return[x,y]});
}

function fitProjection(projection, data, box, center) {
	// get the bounding box for the data - might be more efficient approaches
	var left = Infinity,
		bottom = Infinity,
		right = -Infinity,
		top = -Infinity;
	// reset projection
	projection
		.scale(1)
		.translate([0, 0]);
	data.features.forEach(function(feature) {
		coords = feature.geometry.coordinates[0][0];
		var minX = d3.min(coords, function(array) {return array[0];});
		var maxX = d3.max(coords, function(array) {return array[0];});
		var minY = d3.min(coords, function(array) {return array[1];});
		var maxY = d3.max(coords, function(array) {return array[1];});
		if (minX < left) {left = minX;};
		if (maxX > right) {right = maxX;};
		if (minY < bottom) {bottom = minY;};
		if (maxY > top) {top = maxY;};
		
		});
	var temp = bottom;
	bottom = top;
	top =  temp;
	
	// project the bounding box, find aspect ratio
	function width(bb) {
		return (bb[1][0] - bb[0][0])
		}

	function height(bb) {
		return (bb[1][1] - bb[0][1]);
		}
	  
	function aspect(bb) {
		return width(bb) / height(bb);
		}
	var startbox = [[left, top],  [right, bottom]],
		a1 = aspect(startbox),
		a2 = aspect(box),
		widthDetermined = a1 > a2,
		scale = widthDetermined ?
		// scale determined by width
		width(box) / width(startbox) :
		// scale determined by height
		height(box) / height(startbox),
		// set x translation
		transX = box[0][0] - startbox[0][0] * scale,
		// set y translation
		transY = box[0][1] - startbox[0][1] * scale;
	// center if requested
	if (center) {
		transY = transY - (transY + startbox[1][1] * scale - box[1][1])/2;
		transX = transX - (transX + startbox[1][0] * scale - box[1][0])/2;
	}
	
	// if using real projection (as opposed to geoIdentity), 
	// set precision to zero to prevent D3 from adding points through "adaptive sampling"
	return projection.scale(scale).translate([transX, transY]);
	}	


function set_div_map(divid,featdata,categories, category){
	var ele = document.getElementById(divid); // Do not use #
	var width = ele.clientWidth;
	var height = ele.clientHeight;
	divid = '#' + divid;
	d3.select(divid).selectAll('svg').remove();
	

	
	var svg = d3.select(divid)
			.append('svg')
			.attr('width',width)
			.attr('height',height);


	var g = svg.append('g');
	

	
	var prj=fitProjection(getNoPrj(), featdata, [[0, 0],  [width, height]], true)
	
	var path = d3.geoPath()
		.projection(prj);

	var bounds = path.bounds(featdata), 
		dx = bounds[1][0] - bounds[0][0],
		dy = bounds[1][1] - bounds[0][1],
		x = (bounds[0][0] + bounds[1][0]) / 2,
		y = (bounds[0][1] + bounds[1][1]) / 2,
		scale = .9 / Math.max(dx / width, dy / height),
		translate = [width / 2 - scale * x, height / 2 - scale * y];

	function withCommas(num) {
		return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
	}

	function showFeatureInfo(feature){
		// show data for selected feature
		// population data is from feature itself
		showHTML = feature.properties.STATE_NAME;
		showHTML += "<BR>Population: " + withCommas(feature.properties.POP_2010);
		// remaining data is from "vals" object, lookup by date and state
		var curDate = selDate();
		var stateAbbrev = feature.properties.ABBREV;
		var stateVals = vals[curDate][stateAbbrev];
		var positive = stateVals[0];
		var negative = stateVals[1];
		var death = stateVals[2];
		showHTML += "<BR>" + positive + " cases";
		// display the text in the info pannel
		document.getElementById("mapinfo").innerHTML = showHTML;  	  
	}

	// processes user click on a specific district
	function feature_click(d,i) {
	  // d is the geometry object
	  
	  // if user clicked on active feature, reset map
	  if (active === d && active_feature_exists) return reset();
	  // otherwise, set all features on both maps to inactive
	  m.selectAll(".active").classed("active", false);
	  // set user-clicked feature on both maps to active
	  d3.select(m.node().children[i]).classed("active", active = d);
	  // record that we have an active feature
	  active_feature_exists = true;
	  // show data for selected feature
		showFeatureInfo(d);
	}

	function feature_mouseover(d,i){
		if (active_feature_exists == false){
			m.selectAll(".active").classed("active", false);
			d3.select(m.node().children[i]).classed("active", active = d);
			showFeatureInfo(d);
		}
	}
	
	function feature_mouseout(d,i){
		if (active_feature_exists == false){
			return reset();
		}
	}

	function reset() {
		m.selectAll(".active").classed("active", active = false);
		active_feature_exists = false;
		m.transition().duration(750).attr("transform", "");
		if (document.getElementById("info") != null){
			document.getElementById("info").innerHTML = "(no district selected)" ;
			};
	}


	g.selectAll('path')
		.data(featdata.features)
		.enter()
		.append('path')
		.attr('fill','#ccc')
		.attr('d',path)
		.attr("class","feature")
		.attr("fill",function(d){return "#abc";})
		.attr("stroke", "#DDD")
		.attr("stroke-width", "2px")
		.attr("transform", "translate(" + translate + ")scale(" + scale + ")")
		.on("click",feature_click)
		.on("mouseover",feature_mouseover)
		.on("mouseout",feature_mouseout);

	g.exit().remove();
	return g;

	}
	



// switches map to the given dataset
function switchto(divid,g, todata, fromdata,milliseconds){
	var ele = document.getElementById(divid); // Do not use #
	var width = ele.clientWidth;
	var height = ele.clientHeight;
	divid = '#' + divid;
	console.log("Map div: " + width + " x " + height);
	var prj=fitProjection(getNoPrj(), todata, [[0, 0],  [width, height]], true)
	var path = d3.geoPath().projection(prj);
	
	var bounds = path.bounds(todata), 
		dx = bounds[1][0] - bounds[0][0],
		dy = bounds[1][1] - bounds[0][1],
		x = (bounds[0][0] + bounds[1][0]) / 2,
		y = (bounds[0][1] + bounds[1][1]) / 2,
		scale = .9 / Math.max(dx / width, dy / height),
		translate = [width / 2 - scale * x, height / 2 - scale * y];
	
	//var new_data = d3.geoPath(todata).projection(prj2);		
	g.selectAll('path')
		.transition()
		.attr("d",function(d,i){return path(todata.features[i]);})
		.attr("transform", "translate(" + translate + ")scale(" + scale + ")")
		.duration(milliseconds);	
//.attr("d",(function(d,i){return gp(todata.features[i]);}))		
}



function check_vertex_counts(base_dataset, cartogram_dataset, label, verbose=true){
	// check to make sure number of features match
	// and each feature in base_dataset has the same 
	// number of vertices as the corresponding feature in cartogram_dataset
	// and reports any mismatches to the console
	// *** need to add check to make sure first and last vertex of every "part"
	//     have exactly the same coordinates
	console.log("Checking " + label + " for feature/vertex count mismatches...");
	var num_base = base_dataset.features.length;
	var num_cartogram = cartogram_dataset.features.length;
	if (num_base != num_cartogram){
		console.log("Number of features in " + label + " don't match!");
		console.log("  base: " + String(num_base) + " features");
		console.log("  cartogram: " + String(num_cartogram) + " features");
	}
	var mismatch = 0;
	
	for(i=0;i<Math.min(num_base,num_cartogram)-1;i++){
		var basecoordarray = base_dataset.features[i].geometry.coordinates[0][0];
		var cartcoordarray = cartogram_dataset.features[i].geometry.coordinates[0][0];
		var len1 = base_dataset.features[i].geometry.coordinates[0][0].length;
		var len2 = cartogram_dataset.features[i].geometry.coordinates[0][0].length;
		
		if(len1 != len2){
			mismatch += 1;
			if(verbose){
				console.log(label + " feature " + String(i) + ": " + String(len1) + " vs " + String(len2));
			}
		}
	}
	if(mismatch > 0){
		console.log("Warning: " + label + " vertex counts don't match on " + String(mismatch) + " features" );
	}
	
}