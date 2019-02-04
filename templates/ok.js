
var graphData = {{ data.chart_data | safe }}

//Now we’ll set some dimensions for our svg and graph.

var margin = {top: 30, right: 50, bottom: 30, left: 50};
var svgWidth = 600;
var svgHeight = 270;
var graphWidth = svgWidth - margin.left - margin.right;
var graphHeight = svgHeight - margin.top - margin.bottom;

//We write a function to parse the dates in our data, using the same directives we do in python’s strftime (for reference, see strftime.org)

var parseDate = d3.time.format("%Y-%m-%d").parse;

//We’ll then define the ranges for our data that will be used to scale our data into the graph, for the x axis, this will be 0 to the graphWidth. On our y axis, we are going the other way as we want our lower values to appear at the bottom of the graph, rather than the top.

var x = d3.time.scale().range([0, graphWidth]);
var y = d3.scale.linear().range([graphHeight, 0]);

//We can then define our axes, we’ll set a number of ticks but D3 will choose an appropriate value that is below the number of ticks we choose.

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

//We can define a line for our line for the high data:

var highLine = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.High); });

//We’ll follow that up with the lines for the rest of close and low values:

//We’ll define an area across the whole of the date range on the x axis and between the Low and the High values from our data on the y axis.

var area = d3.svg.area()
    .x(function(d) { return x(d.Date); })
    .y0(function(d) { return y(d.High); })
    .y1(function(d) { return y(d.High); })

//We’ll add the svg canvas to the graphDiv div we’ve defined in our HTML file:

var svg = d3.select("#graphDiv")
    .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
    .append("g")
        .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")")

//Now that we’ve written our set up, we’re ready to write a function to draw a graph:
//Ghassan
function drawGraph(data) {
  // For each row in the data, parse the date
  // and use + to make sure data is numerical
  data.forEach(function(d) {
    d.Date = parseDate(d.Date);
    d.High = +d.High;
  });
  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain([d3.min(data, function(d) {
      return Math.min(d.High) }),
      d3.max(data, function(d) {
      return Math.max(d.High) })]);
console.log(Math.max(d.High))
console.log(Math.min(d.High))
console.log(d.High)
  // Add the area path
  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area)
  // Add the highLine as a green line
  svg.append("path")
    .style("stroke", "green")
    .style("fill", "none")
    .attr("class", "line")
    .attr("d", highLine(data));
  // Add the closeLine as a blue dashed line
  // Add the lowLine as a red dashed line
  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + graphHeight + ")")
      .call(xAxis);
  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
  // Add the text for the "High" line
  svg.append("text")
    .attr("transform", "translate("+(graphWidth+3)+","+y(graphData[0].High)+")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("High");
  // Add the text for the "Low" line
  // Add the text for the "Close" line
};
var x = drawGraph(graphData);
    </script>
</body>
</html>
