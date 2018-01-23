(function(){
	
	var margin = {top:50, left:50,right:50,bottom:50};
	
	var width = window.innerWidth - margin.top - margin.bottom;
	var height = window.innerHeight - margin.left - margin.right;
	
	var svg = d3.select('#map')
		.append('svg')
		.attr('height', height + margin.top + margin.bottom)
		.attr('width', width + margin.left + margin.right)
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
		
	//read in the world.topojson
	d3.queue()
		.defer(d3.json, 'world.topojson')
		.await(ready)
		
	var projection = d3.geoMercator()
		.translate([width/2,height/2])
		.scale(200)
		
	var path = d3.geoPath()
		.projection(projection)
		
		
	function ready(error,data){
		var countries = topojson.feature(data, data.objects.countries1).features
		svg.selectAll('.country')
		.data(countries)
		.enter().append('path')
		.attr('class','country')
		.attr('d', path)
			.on('mouseover',function(d){
				d3.select(this).classed('selected',true)
			})
			.on('mouseout',function(d){
				d3.select(this).classed('selected',false)
			})
			
	
			
	}

	setInterval(function(){
		
		d3.json('http://api.open-notify.org/iss-now.json',function(data){
			
			var longitude = data.iss_position.longitude;
			var latitude = data.iss_position.latitude;
			var timestamp = data.timestamp;

			issCoord = [longitude,latitude];
			
			console.log(issCoord);
			
			var iss = svg.selectAll('circle')
				.data([issCoord])
				.attr('cx', function(d){return projection(d)[0];})
				.attr("cy", function (d) {return projection(d)[1];})				
					.enter()
					.append('circle')
					.attr('cx', function(d){return projection(d)[0];})
					.attr("cy", function (d) {return projection(d)[1];})
					.attr("r", "8px")
					.attr('fill','#F0F3F4')
					.attr('stroke', 'black')
					.attr('stroke-width', '2px')
		})
		
		}, 500);
	
	
	
})();