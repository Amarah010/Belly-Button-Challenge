// Create url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch data 
d3.json(url).then(function(data) {
    console.log(data);
});

// Populate drop-down list
function init(){
    let dropdown = d3.select("#selDataset");
    d3.json(url).then((data) => {
    let sample_ids = data.names;
    console.log(sample_ids);
        for (id of sample_ids){
            dropdown.append("option").attr("value", id).text(id);
        };
    let name = sample_ids[0];
    console.log(name);
    
    // Call the functions to make the bar chart, bubble chart and demographic info
    Bar(name);
    Bubble(name);
    Demographic(name);
    }); 
};

// Create bar chart
function Bar(sample){
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        let filtered_data = sample_data.filter(id => id.id == sample);
        let bar_data = filtered_data[0];

        let trace = [{
            x: bar_data.sample_values.slice(0,10).reverse(),
            y: bar_data.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: bar_data.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        
        Plotly.newPlot("bar", trace);
    });
}

// Create bubble chart
function Bubble(sample){
    d3.json(url).then((data) => {
        let sample_data = data.samples;
        let filtered_data = sample_data.filter(id => id.id == sample);
        let bubble_data = filtered_data[0];

        let trace = [{
            x: bubble_data.otu_ids,
            y: bubble_data.sample_values,
            text: bubble_data.otu_labels,
            mode: "markers",
            marker: {
                size: data.sample_values,
                color: data.otu_ids,   
            }
        }];

        let layout = {
            xaxis: {title: "OTU ID"}
        };
        
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Create demographic info
function Demographic(sample){
    d3.json(url).then((data) => {
    let demographic_info = data.metadata;
    let filtered_data = demographic_info.filter(id => id.id == sample);
    let demo_data = filtered_data[0];
    d3.select('#sample-metadata').html('');

    Object.entries(demo_data).forEach(([key, value]) => {
        d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
    });
    
    });
};

// define the function when the dropdown changes 
function optionChanged(value){
    console.log(value);
    Bar(value);
    Bubble(value);
    Demographic(value);
};

init();