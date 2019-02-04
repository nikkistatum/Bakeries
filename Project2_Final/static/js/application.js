
function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then(function(data) {

    var x_values = data.Date;
    var y_values = data.Transaction;

    var trace1 = {
      x: x_values,
      y: y_values,
        type: 'bar'
    };

    var data = [trace1];

    var layout = {
      xaxis: { title: "Date"}
    };

    Plotly.newPlot('line', data, layout);

  });   

  d3.json(`/mostpopular`).then(function(chart_data) {
  
      var xs = chart_data.Item;
      var ys = chart_data.Sales;
  
  
      var trace2 = {
        x: xs,
        y: ys,
          type: 'bar' 
      };
  
      var chart_data = [trace2];
  
      var layout = {
        xaxis: { title: "Item"}
      };
      
  
      Plotly.newPlot('bar', chart_data, layout);
  
    }); 
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    // buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  // buildMetadata(newSample);
}

// Initialize the dashboard
init();