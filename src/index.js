import Plotly from 'plotly.js-dist';

const rand = () => Math.random();
var x = [1, 2, 3, 4, 5];
const new_data = (trace) => Object.assign(trace, {y: x.map(rand)});

// add random data to three line traces
var data = [
    {mode:'lines', line: {color: "#b55400"}},
].map(new_data);

var layout = {
    title: 'User Zoom Resets<br>When uirevision Changes',
    uirevision:'true',
    xaxis: {autorange: true},
    yaxis: {autorange: true}
};

Plotly.react(graphDiv, data, layout);

var myPlot = document.getElementById('graphDiv');

var cnt = 0;
var interval = setInterval(function() {
    data = data.map(new_data);

    // user interation will mutate layout and set autorange to false
    // so we need to reset it to true
    layout.xaxis.autorange = true;
    layout.yaxis.autorange = true;

    // a new random number should ensure that uirevision will be different
    // and so the graph will autorange after the Plotly.react
    layout.uirevision = rand();

    Plotly.react(graphDiv, data, layout);
    if(cnt === 100) clearInterval(interval);
}, 1000);
