var data = [
  {name: "Perfetti", value: 60},
  {name: "ABC", value: 20},
  {name: "Pako", value: 30},
  {name: "Inkosau", value: 15},
  {name: "Perfetti-N", value: 10},
  {name: "Belfoods", value: 11},
  {name: "Ultrajaya", value: 12},
  {name: "Medion", value: 5},
  {name: "SUJ", value: 8},
  {name: "King", value: 3},
];

// Set Margins
var width = 500;
var height = 450;
var thickness = 40;
var duration = 750;
var padding = 150;
var opacity = .8;
var opacityHover = 1;
var otherOpacityOnHover = .8;
var tooltipMargin = 13;

// Scheme Color Design
var radius = Math.min(width-padding, height-padding) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Create SVG Canvas
var svg = d3.select("#chart")
    .append('svg')
    .attr('class', 'pie')
    .attr('width', width)
    .attr('height', height);

var g = svg.append('g')
    .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

var outerArc = d3.arc()
    .innerRadius(radius * 1.1)
    .outerRadius(radius * 1.1);

var label = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 10);

var pie = d3.pie()
    .value(function(d) { return d.value; })
    .sort(null);

var path = g.selectAll('path')
    .data(pie(data))
    .enter()
    .append("g")  
    .append('path')
    .attr('d', arc)
    .attr('fill', (d,i) => color(i))
    .style('opacity', opacity)
    .style('stroke', 'white')
    .on("mouseover", function(d) {
        d3.selectAll('path')
          .style("opacity", otherOpacityOnHover);
        d3.select(this) 
          .style("opacity", opacityHover);

        var g = d3.select("svg")
          .append("g")
          .attr("class", "tooltip")
          .style("opacity", 0);
   
        g.append("text")
          .attr("class", "name-text")
          .attr('fill','#fff')
          .text(`${d.data.name} (${d.data.value})`)
          .attr('text-anchor', 'middle')
          .attr('font-size','11px');
      
        var text = g.select("text");
        var bbox = text.node().getBBox();
        var padding = 10;
        g.insert("rect", "text")
          .attr("x", bbox.x - padding)
          .attr("y", bbox.y - padding)
          .attr("width", bbox.width + (padding*2))
          .attr("height", bbox.height + (padding*2))
          .style("fill", "#232F34")
          .style("opacity", 1);
      })

    .on("mousemove", function(d) {
          var mousePosition = d3.mouse(this);
          var x = mousePosition[0] + width/2;
          var y = mousePosition[1] + height/2 - tooltipMargin;
      
          var text = d3.select('.tooltip text');
          var bbox = text.node().getBBox();
          if(x - bbox.width/2 < 0) {
            x = bbox.width/2;
          }
          else if(width - x - bbox.width/2 < 0) {
            x = width - bbox.width/2;
          }
      
          if(y - bbox.height/2 < 0) {
            y = bbox.height + tooltipMargin * 2;
          }
          else if(height - y - bbox.height/2 < 0) {
            y = height - bbox.height/2;
          }
      
          d3.select('.tooltip')
            .style("opacity", 1)
            .attr('transform',`translate(${x}, ${y})`);
      })

    .on("mouseout", function(d) {   
        d3.select("svg")

          .select(".tooltip").remove();
      d3.selectAll('path')
          .style("opacity", opacity);
      })

    .on("touchstart", function(d) {
        d3.select("svg")
          .style("cursor", "none");    
    })

    .each(function(d, i) { this._current = i; })
      .transition()
    .duration(function(d, i) {
        return i * 500;
      })
    .attrTween('d', function(d) {
     var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
     return function(t) {
         d.endAngle = i(t);
       return arc(d);
     }
      });

// Make Legend
var legend = d3.select("#chart").append('div')
		.attr('class', 'legend')
		.style('margin-top', '20%');

var keys = legend.selectAll('.key')
		.data(data)
		.enter().append('div')
		.attr('class', 'key')
		.style('display', 'flex')
		.style('align-items', 'center')
		.style('margin-right', '20px')
    .style('color', (d, i) => color(i));

		keys.append('div')
		.attr('class', 'symbol')
		.style('height', '10px')
		.style('width', '10px')
		.style('margin', '5px 5px')
		.style('background-color', (d, i) => color(i));

		keys.append('div')
		.attr('class', 'name')
		.text(d => `${d.name} (${d.value})`);

		keys.exit().remove();

var erp = g.selectAll('.erp')
    .data(pie(data))
    .enter().append('g')
    .attr('class','erp');

    erp.append('text')
      .style('fill', (d, i) => color(i))
      .style('font-size','10px')
      .transition().duration(1000)
      .attr('transform', function(d,i){
        var pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1.13 : -1.13);
         var percent = (d.endAngle - d.startAngle)/(2*Math.PI)*100
       if(percent<3){
       //console.log(percent)
       pos[1] += i*-5
       }
        return 'translate('+ pos +')';
      })
      .text(d => `${d.data.name} (${d.data.value})`)
      .attr('text-anchor', 'middle')
      .attr('dx', function(d){
      var ac = midAngle(d) < Math.PI ? 1:-20
              return ac
      })
      .attr('dy', ".35em")


    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    var polyline = g.selectAll("polyline")
      .data(pie(data), function(d) {
        return d.data.value;
      })
      .enter()
      .append("polyline")
      .transition().duration(1000)
      .attr("points", function(d,i) {
        var pos = outerArc.centroid(d);
            pos[0] = radius * 1 * (midAngle(d) < Math.PI ? 1 : -1);
        var o = outerArc.centroid(d)
        var percent = (d.endAngle -d.startAngle)/(2*Math.PI)*100
             if(percent<3){
                 o[1] 
                 pos[1] += i*-5
             }
        return [label.centroid(d),[o[0],pos[1]] , pos];
      })
      .style("fill", "none")
      .attr("stroke", function(d,i) { return color(i); })
      .style("stroke-width", "1px");
