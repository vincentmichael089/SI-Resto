<template>
  <div>
    <div>
      {{data}}
    </div>
    <div id="chart"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
//import moment from 'moment'

export default {
  name: 'ChartLine',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  methods: {  
    generateChart() {
      const margin = {top: 20, right: 30, bottom: 30, left: 40}
      const height = 500
      const width = 1000
      // prepare the svg
      const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, width, height]);
      
      // range of x axis
      const x = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.timestamp))
      //.domain([Number(moment().startOf('day').unix()), Number(moment().endOf('day').unix())]).nice() //moment
      .range([margin.left, width - margin.right])

      // range of y axis
      const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.income)]).nice()
      .range([height - margin.bottom, margin.top])

      // set the axis
      const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`) // geser biar x axis naik sedikit
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

      const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`) // geser biar x axis kanan sedikit
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(this.data.y))
            
      svg.append("g")
          .call(xAxis);
      svg.append("g")
          .call(yAxis);
      
      // create line
      let line = d3.line()
      .defined(d => !isNaN(d.income))
      .x(d => x(d.timestamp))
      .y(d => y(d.income))

      svg.append("path")
          .datum(this.data)
          .attr("fill", "none")
          .attr("stroke", "green")
          .attr("stroke-width", 3)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("d", line);

      // return the svg
      return svg.node();

      // const margin = {top: 20, right: 30, bottom: 30, left: 40}
      // const height = 500
      // const width = 1000

      // const svg = d3.select("#chart").append("svg").attr("viewBox", [0, 0, width, height]); 
      // const g = svg.append("g").attr("transform", "translate("+margin.left+","+margin.top+")")
      // const x = d3.scaleTime().rangeRound([0, width]) // x pos scaler
      // const y = d3.scaleLinear().rangeRound([height, 0]) // y pos scaler

      // const line = d3.line()
      // .x(d => x(d.timestamp))
      // .y(d => y(d.income))

      // x.domain(d3.extent(this.data, d => d.timestamp)) // get range of timestamp in x (min and max value)
      // y.domain(d3.extent(this.data, d => d.income)) // get range of timestamp in y (min and max value)

      // g.append('g').attr("transform", "translate(0,"+height+")")
      // .call(d3.axisBottom(x))
      // .select(".domain")
      // .remove()

      // g.append('g')
      // .call(d3.axisLeft(y))
      // .append('text')
      // .attr('fill', '#000')
      // .attr('transform', 'rotate(-90)')
      // .attr('y', 6)
      // .attr('dy', '0.71em')
      // .attr('text-anchor', 'end')
      // .text('Pendapatan')

      // svg.append('path')
      // .datum(this.data)
      // .attr('fill', 'none')
      // .attr('stroke','steelblue')
      // .attr("stroke-width", 3)
      // .attr("stroke-linejoin", "round")
      // .attr("stroke-linecap", "round")
      // .attr("d", line);
    }
  },
  mounted() {
    this.generateChart();
  },
}
</script>

<style>

</style>