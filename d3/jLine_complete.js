//load data CSV
d3.csv("data/line_data.csv").then(d => line(d));

// Set margins
var margin = {top: 30, right: 10, bottom: 60, left: 60},
    width = parseInt(d3.select("#graph").style("width")) - margin.left - margin.right,
    height = parseInt(d3.select("#graph").style("height")) - margin.top - margin.bottom;

// Parse month variable
var parseMonth = d3.timeParse("%b");
var formatMonth = d3.timeFormat("%b");
var formatDatas = d3.timeFormat("%B");

// Set ranges
var x = d3.scaleTime()
    .domain([parseMonth("Jan"),parseMonth("Dec")])
    .range([0, width]);
var y = d3.scaleLinear()
    .range([height, 0]);

// Define line
var valueLine = d3.line()
    .x(function(d) { return x(d.Month); })
    .y(function(d) { return y(+d.Datas); })

// Create SVG Canvas
var svg = d3.select("#graph")
    .append("svg")
    .style("width", width + margin.left + margin.right + "px")
    .style("height", height + margin.top + margin.bottom + "px")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "svg");

//function line
function line(csv){
  // Format data
  csv.forEach(function(d) {
      d.Month = parseMonth(d.Month);
      d.Datas = +d.Datas;
  });

  //set value to console log
  var totalData = d3.sum(csv.map(function(d){return d.Datas}));
  var AvrData = d3.mean(csv.map(function(d){return d.Datas}));

  var console = {};
  var total = document.getElementById("total");
  var avr = document.getElementById("avr");

  console.log = function(text) {
      var element = document.createElement("strong");
      var txt = document.createTextNode(text);

      element.appendChild(txt);
      total.appendChild(element);
  }

  console.log1 = function(text) {
      var element = document.createElement("strong");
      var txt = document.createTextNode(text);

      element.appendChild(txt);
      avr.appendChild(element);
  }

  // Scale range of data
  x.domain(d3.extent(csv, function(d) { return d.Month; }));
  y.domain([0, d3.max(csv, function(d) { return d.Datas; })]);
  
  // Set up x axis
  var xaxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .style("color","#000")
      .call(d3.axisBottom(x)
        .ticks(d3.timeMonth)
        .tickSize(0, 0)
        .tickFormat(d3.timeFormat("%b"))
        .tickSizeInner(0)
        .tickPadding(10));

  // Set up y axis
  var yaxis = svg.append("g")
      .attr("class", "y axis")
      .style("color","#000")
      .call(d3.axisLeft(y)
        .ticks(10)
        .tickSizeInner(0)
        .tickPadding(5)
        .tickSize(5, 5));

  // Start Style Chart
  // Define div for tooltip
  var div = d3.select("#graph")
      .append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

  // function grid Y Axis
  function grid_y() {   
      return d3.axisLeft(y)
      .ticks(15)
  }

  // Function Trasnsition Stoke
  function transition(path) {
      path.transition()
      .duration(2000)
      .attrTween("stroke-dasharray", tweenDash);
  }

  // Function Transition Dash
  function tweenDash() {
      var l = this.getTotalLength(),
          i = d3.interpolateString("0," + l, l + "," + l);
      return function (t) { return i(t); };
  }

  // add the Y gridlines
  svg.append("g")     
      .attr("class", "grid")
      .call(grid_y()
        .tickSize(-width)
        .tickFormat("")
        )

  // add tittle chart
  svg.append("text")
      .attr("dx", (width / 2))             
      .attr("dy", 0 - (margin.top / 3))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("font-weight","bold")
      .text("Grafik Bulanan");

  // add Label X
  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("dx", width - 250)
      .attr("dy", height + 45)
      .style("font-size","13px")
      .style("font-weight","bold")
      .text("Bulan");

  // add Label Y
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("dx", - 75)
      .attr("dy", - 40)
      .attr("transform", "rotate(-90)")
      .style("font-size","13px")
      .style("font-weight","bold")
      .text("Rupiah [x1.000.000]");
  // End Style Chart
  
  // Draw line chart
  var path = svg.append("path")
      .data([csv])
      .attr("class", "line")
      .attr("d", valueLine)
      .call(transition);
  
  // Add Tooltip Style
  svg.selectAll("dot")
      .data(csv)
      .enter()
      .append("circle")
      .attr("class","dots")
      .attr("cx", function(d) { return x(d.Month); })
      .attr("cy", function(d) { return y(d.Datas); })
      .attr("r", 5)
      .on("mouseover", function(d) {
           div.transition()
           .duration(200)
           .style("opacity", 1);
           div.html("<b>"+ formatDatas(d.Month) +"</b>"+ "<br/>" + d.Datas)
           .style("left", (d3.event.pageX - 270) + "px")
           .style("top", (d3.event.pageY - 200) + "px")
           d3.select(this)
           .style("fill","#d32f2f");
      })
      .on("mouseout", function(d) {
           div.transition()
           .duration(500)
           .style("opacity", 0);

           d3.select(this)
           .style("fill","#2196f3");
       });

  // Console Log Data to HTML Tag
  hasiltotal = totalData.toFixed(0.2);
  hasilavr = AvrData.toFixed(2);
  console.log(hasiltotal)
  console.log1(hasilavr)}
