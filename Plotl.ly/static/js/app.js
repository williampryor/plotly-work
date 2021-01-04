//read in the sample.js file with d3 and add it to the dropdown
d3.json('samples.json').then((data)=> {
    var id = data.names;
    console.log(data.metadata);
    var select = d3.selectAll('#selDataset');
    Object.entries(id).forEach(([i,j])=> {
        select.append('option').text(j);
    })
})

function buildPlot(belly) {
    d3.json('samples.json').then((data) => {
        //make an array to store the chart values for the bar chart
        var samples = data.samples;
        var numSamples = samples.map(row => row.id).indexOf(belly);
        //make the bar chart

        var otuValues = samples.map(row=>row.sample_values);
        var otuValues = otuValues[numSamples].slice(0,10);

        var otuIds = samples.map(row=>row.otu_ids);
        var otuIds = otuIds[numSamples].slice(0,10);

        var otuLabels = samples.map(row => row.otu_labels);
        var otuLabels = otuLabels[numSamples].slice(0,10);

        var trace1 = {
            x: otuValues,
            y: otuIds.map(e => `UTO ${e}`),
            text: otuLabels,
            type: 'bar',
            orientation: 'h'
        };
        var barChart = [trace1];
        Plotly.newPlot('bar', barChart);

        //bubble chart

        var otuValue = samples.map(row=>row.sample_values);
        var otuValue = otuValue[numSamples];
        var otuId= samples.map(row=>row.otu_ids);
        var otuId= otuId[numSamples];
        var otuLabel= samples.map(row=>row.otu_labels); 
        var otuLabel=otuLabel[numSamples];
        var minIds=d3.min(otuId);
        var maxIds=d3.max(otuId);
        var mapNr = d3.scaleLinear().domain([minIds, maxIds]).range([0, 1]);
        var bubbleColors = otuId.map( val => d3.interpolateRgbBasis(["purple", "red", "orange"])(mapNr(val)));
        var trace2 ={
            x: otuId,
            y: otuValue,
            text: otuLabel,
            mode: 'markers',
            marker: {
                color: bubbleColors,
                size: otuValue.map(x=>x*10),
                sizemode: 'area'
            }
        };
        var bubbleChart = [trace2];
       
        Plotly.newPlot('bubble', bubbleChart);   
        //gauge chart 
        var meta = data.metadata;
        var gaugeData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: meta[numSamples].wfreq,
                title: { text: "Washing frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: { axis: { range: [null, 9] },
                bar:{color: 'orange'},
                   steps: [
                    { range: [0, 2], color: "rgba(14, 127, 0, .5)" },
                    { range: [2, 3], color: "rgba(110, 154, 22, .5)" },
                    { range: [3, 4], color: "rgba(170, 202, 42, .5)" },
                    { range: [4, 5], color: "rgba(202, 209, 95, .5)" },
                    { range: [5, 6], color: "rgba(210, 206, 145, .5)" },
                    { range: [6, 8], color: "rgba(232, 226, 202, .5)" },
                    { range: [8, 9], color: "rgba(255, 255, 255, 0)" }
                  ]}
            }
        ];

        var gaugeLayout = { width: 600, height: 500};
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
        
        //show the info in the 

        var sampleMeta = d3.select('#sample-metadata');
        sampleMeta.html('');
        Object.entries(meta[numSamples]).forEach(([k,j])=>{
            sampleMeta.append('p').text(`${k.toUpperCase()}:\n${j}`);
        })
    })
};

function optionChanged(newPlot) {
    buildPlot(newPlot);
}
