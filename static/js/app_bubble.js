// ---------------------------------------------------------
// SET UP PARAMETERS
// ---------------------------------------------------------

var svgWidth = 1000;
var svgHeight = 510;

var margin = {
  top: 90,
  right: 100,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// create an SVG wrapper, append an SVG group to hold chart,
// and shift the latter by left and top margins
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// set initial x axis
var chosenXAxis = "Median_Income";

// ---------------------------------------------------------
// CREATE FUNCTIONS TO CALL LATER
// ---------------------------------------------------------

// create function to update x-scale upon click on axis label
function xScale(zipsData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(zipsData, d => d[chosenXAxis]) *.4,
      d3.max(zipsData, d => d[chosenXAxis]) 
    ])
    .range([0, width]);

  return xLinearScale;

}

// create function to update x axis upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// create function to update & transition circle data points
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// create function to format incomes with commas at thousand mark
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// create function to update circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  if (chosenXAxis === "Median_Income") {
    var label = "Median Income:";
  }
  else {
    var label = "Percent Non-White:";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
      if (chosenXAxis === "Median_Income") {
        var formattedIncome = formatNumber(d[chosenXAxis]);
        var formattedPop = formatNumber(d.Population);
        return (`<strong>ZIP CODE: ${d.ZipCode}</strong>\
                <br>Population: ${formattedPop}\
                <br>${label} $${formattedIncome}\
                <br>Number of Cameras: ${d.NumCameras}`);
      }
      else {
        var formattedPop = formatNumber(d.Population);
        return (`<strong>Zip Code: ${d.ZipCode}</strong>\
                <br>Population: ${formattedPop}\
                <br>${label} ${d[chosenXAxis]}%\
                <br>Number of Cameras: ${d.NumCameras}`);      
      }
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
    // onmouseout event
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

  return circlesGroup;
}

// ---------------------------------------------------------
// READ IN DATA AND BUILD INITIAL CHART
// ---------------------------------------------------------

// read json that we output to our bubble route
d3.json("/bubble")
  .then(function(zipsData) {
    
    // parse data and cast as numbers
    zipsData.forEach(function(data) {
        data.Median_Income = +data.Median_Income;
        data.Percent_Non_White = +data.Percent_Non_White;
        data.NumCameras = +data.NumCameras;
        data.Population = +data.Population;
    });
   
    // create x scale function
    var xLinearScale = xScale(zipsData, chosenXAxis);

    // create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([-20, d3.max(zipsData, d => d.NumCameras)+8])
      .range([height, 0]);    

    // create a function for circle size
    var circleScale = d3.scaleSqrt()
      .domain([d3.min(zipsData, d => d.Population), d3.max(zipsData, d => d.Population)])
      .range([10, 50]);

      console.log(d3.min(zipsData, d => d.Population))
      console.log(d3.max(zipsData, d => d.Population))
    // create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    // append axes to the chart
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // append initial circle data points
    var circlesGroup = chartGroup.selectAll("circle")
      .data(zipsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.NumCameras))
      .attr("r", d => circleScale(d.Population))
      .attr("fill", "purple")
      .attr("stroke", "white")
      .style("opacity", 0.5);

    // append line marker at zero Y axis
    chartGroup.append("line")
      .attr("class", "line")
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .style("stroke-dasharray", ("5, 5"))  
      .attr("x1", 0)    
      .attr("y1", 287.8)      
      .attr("x2", width) 
      .attr("y2", 287.8);

    // create group for 2 x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var incomeLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "Median_Income") 
      .classed("active", true)
      .text("Median Income");
    
    var nonwhiteLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "Percent_Non_White") 
      .classed("inactive", true)
      .text("Non-White Percent Of Population");

    // create y-axis label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .classed("active", true)
      .text("Number of CCTV Cameras");

    chartGroup.append("text")
      .attr("x", (width / 2))             
      .attr("y", (height - 410))
      .attr("text-anchor", "middle")  
      .style("font-family", "verdana")
      .style('fill', 'black')
      .style("font-size", "24px") 
      .style("font-weight", "bold")  
      .text("CCTV Per ZipCode By Income & Race");

    chartGroup.append("text")
      .attr("x", (width / 2))             
      .attr("y", (height - 386))
      .attr("text-anchor", "middle")  
      .style("font-family", "verdana")
      .style('fill', 'gray')
      .style("font-size", "17px") 
      .style("font-weight", "bold")  
      .text("Based On 2017 Census Data");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // ---------------------------------------------------------
    // BUILD LEGEND
    // ---------------------------------------------------------

    // add legend circles
    var valuesToShow = [10000, 25000, 50000]
    var xCircle = 60
    var xLabel = 150
    var yCircle = 100
    chartGroup.selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return yCircle - circleScale(d) })
        .attr("r", function(d){ return circleScale(d) })
        .style("fill", "none")
        .attr("stroke", "purple")

    // add legend label lines
    chartGroup.selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
        .attr('x1', function(d){ return xCircle + circleScale(d) } )
        .attr('x2', xLabel)
        .attr('y1', function(d){ return yCircle - circleScale(d) } )
        .attr('y2', function(d){ return yCircle - circleScale(d) } )
        .attr('stroke', 'gray')
        .style('stroke-dasharray', ('2,2'))

    // add legend labels
    chartGroup.selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return height - 240 - circleScale(d) } )
        .text( function(d){ return formatNumber(d) } )
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // add legend title
    chartGroup.append("text")
      .attr('x', xCircle)
      .attr("y", height - 335)
      .text("Population")
      .attr("text-anchor", "middle")

// ---------------------------------------------------------
// ADD EVENT LISTENER FOR USER AXIS SELECTIONS
// ---------------------------------------------------------

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function() {

        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // update x scale for new data
          xLinearScale = xScale(zipsData, chosenXAxis);
        
          // update x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);

          // update circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "Median_Income") {
            incomeLabel
              .classed("active", true)
              .classed("inactive", false);
            nonwhiteLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else {
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
            nonwhiteLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        }
      });
});