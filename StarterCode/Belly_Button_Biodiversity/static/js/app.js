function buildMetadata(sample) {

    const url = "/metadata/" + sample;
    let selector = d3.select("#sample-metadata");
    selector.html("");
    d3.json(url).then((metadata) => {
      
      Object.entries(metadata).forEach(([key, value]) => {
        selector.append("h6")
          .text(key + ": " + value);
      });
    });
}

function buildCharts(sample) {

  const url = "/samples/" + sample;
  d3.json(url).then((samples) => {
    let otu_ids = samples["otu_ids"];
    let otu_labels = samples["otu_labels"];
    let sample_values = samples["sample_values"];

    let plot1 = {
      labels: otu_ids.slice(0,10),
      values: sample_values.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      type: "pie"
    };

    let plot2 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        opacity: 0.5,
        color: otu_ids,
        colorscale: "Portland"
      }
    };

    let pie_data = [plot1]
    Plotly.newPlot("pie", pie_data);
    
    let bubble_data = [plot2]
    Plotly.newPlot("bubble", bubble_data);
  });
}

function init() {
  
  var selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();
