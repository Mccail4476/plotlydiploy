function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleVariable = [];
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = sampleVariable.filter( sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var results = filterSample[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = results.otu_ids;
    var labels = results.otu_labels;
    var values = results.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

//     var sortedCities = cityGrowths.sort((a,b) => a.Increase_from_2016 - b.Increase_from_2016).reverse();  
// var topFiveCities = sortedCities.slice(0,5); 
// var topFiveCityNames = topFiveCities.map(city => city.City);
// var topFiveCityGrowths = topFiveCities.map(city => parseInt(city.Increase_from_2016));

    var sorted10ids = results.sort((a,b) => a.otu_ids - b.otu_ids).reverse();
    var top10ids = sorted10ids.slice(0,10);
    var top10bacteria = top10ids.map(top => top.otu_ids);

    var yticks = top10bacteria

    // 8. Create the trace for the bar chart. 


    // var trace = {
    //   x: topFiveCityNames,
    //   y: topFiveCityGrowths,
    //   type: "bar"
    // };
    // var data = [trace];
    // var layout = {
    //   title: "Most Rapidly Growing Cities",
    //   xaxis: {title: "City" },
    //   yaxis: {title: "Population Growth, 2016-2017"}
    // };
    // Plotly.newPlot("bar-plot", data, layout);

    var trace = {
      x: values,
      y: yticks,
      type: "bar"
    };
    var barData = [trace
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
     xaxis: {title: "values"},
     yaxis: {title: "otu_ids"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout);
  });
}
