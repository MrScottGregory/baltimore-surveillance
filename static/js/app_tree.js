
// ---------------------------------------------------------
// READ IN DATA AND BUILD SERIES OBJECTS FOR PLOTTING
// ---------------------------------------------------------

// establish list to hold series objects
let seriesData = []

// establish variable to hold neighborhood names (in desc order of total crimes)
const neighborhoods = ['DOWNTOWN', 'FRANKFORD', 'BELAIR-EDISON', 'BROOKLYN', 'CANTON']

// establish variable to hold our five crime types
const crimes = ['Homicide', 'Shooting', 'Personal', 'Property', 'Larceny']

// read in JSON data and in promise create function to build series objects
d3.json("/tree")
  .then(function(crimeData) {
  
    //establish variable for pie slice colors
    const colors = ['red', 'black', 'purple', 'gold', 'gray']

    // iterate through crimes list 
    crimes.map((item, i) => {
      // establish variable to hold object
      let obj = {}
      // when the Description value in data equals the crime in the crime list...
      const crimeD = crimeData.filter(d => d.Description === item)
      // set dataPie as equal to that Description value...
      obj.dataPie = item;
      // and set dataV as a list of totals of that crime type for each neighborhood...
      obj.dataV = neighborhoods.map(j => {
        let neigh = crimeD.filter(d => d.Neighborhood === j)
        return(neigh[0].NumCrimes)
      })
      // and finally set marker color to the color that matches the index of the crime.
      obj.marker = { backgroundColor: colors[i]}

      // add the object to our series list
      seriesData.push(obj)
    });
 
// ---------------------------------------------------------
// USING ZING CHART TEMPLATE, SET CONFIGURATION PARAMETERS
// ---------------------------------------------------------

let chartConfig = {
  type: 'bubble-pie',
  globals: {
    "fontFamily": "Verdana"
  },
  "height": "100%",
  "width": "100%",
  title: {
    text: "Baltimore's Most Criminal Neighborhoods",
    fontColor: 'black',
    "font-size": 24
  },
  subtitle: {
    text: 'Top 5 By Crime Type (2018)',
    fontColor: 'gray',
    "font-size": 17
  },
  legend: {
    "header":{
      "text":"Crime Type",
      "text-align": 'center',
      "padding-top":8,
    },
    align: 'center',
    item: {
      text: '%data-pie'
    },
    verticalAlign: 'bottom'
  },
  plot: {
    // here the first value is a placeholder, as we're using x axis categorically (see x labels below)
    // the 2nd and 3rd values are total crimes, which I surmised during separate ETL
    // total crimes appears twice, because it functions as Y variable and size of bubble
    values: [[1, 197, 1635], [2, 1, 1084], [3, 19, 1042], [4, 57, 947], [5, 5, 843]],
    tooltip: {
      text: '%data-pv% %data-pie'
    },
    "data-bubble": ["197", "1", "19", "57", "5" ],
    valueBox: {
      text: 'Total Crimes: %node-size-value<br>Total Cameras: %data-bubble',
      fontColor: 'black',
      fontWeight: 'normal',
      placement: 'top'
    },
    "min-size": 25,
    "max-size": 55
  },
  "scale-x": {
    "labels": neighborhoods,
    "label":{
      "text":"Neighborhoods"
    },
    "offset-start": 120,
    "offset-end": 100
  },
  "scale-y": {
    "label":{
      "text":"Number of CCTV Cameras"
    },
    "max-value": 197,
    "min-value": 1,
    "offset-start": 50,
    "offset-end": 50,
  },
  // where you'd normally write the series objects, call list of objects built above (seriesData)
  series: seriesData
};
 
// render chart
zingchart.render({
  id: 'myChart',
  data: chartConfig
});

});