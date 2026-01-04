//Event listener reads the svg into memory and loads it into the html as apart of the svg container

import { graph } from "./graph.js";
document.addEventListener("DOMContentLoaded", () => {
  fetch("Untitled.svg")
    .then((response) => response.text())
    .then(async (svgContent) => {
      console.log("svg content");
      //   console.log(svgContent);
      console.log("end content");
      const parser = new DOMParser();
      const fileContent = parser.parseFromString(svgContent, "image/svg+xml");
      await loadNodes(fileContent);
      const svg = fileContent.querySelector("svg");
      console.log(svg);

      //create line group for the line overlay to be displayed
      const linesGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      linesGroup.id = "lines";
      //insert the line group at the top of the svg container
      //we use appendChild because we want the lines to be overlayed above the nodes
      //which means that they need to be a group placed/ drawn after the node group which is #visible_ellipses
      svg.appendChild(linesGroup, svg.querySelector("#visible_ellipses"));
      document.getElementById("svg-container").appendChild(svg);
    });
});

async function loadNodes(fileContent) {
  let index = 1;
  let node;

  let mapGraph = new graph();

  //while loop iterates through all svg node components and adds the nodes to memory as a part of a graph
  while ((node = fileContent.getElementById(`node-${index}`))) {
    mapGraph.createNode(
      node.getAttribute("cx"),
      node.getAttribute("cy"),
      node.id
    );
    console.log({
      id: node.id,
      cx: node.getAttribute("cx"),
      cy: node.getAttribute("cy"),
      r: node.getAttribute("r"),
    });
    index++;
  }

  //load edge data
  const edges = await fetch("./edges.json").then((response) => response.json());
  const TEMPORARY_VALUE = 1;
  for (let edge of edges.edges) {
    mapGraph.addEdge(TEMPORARY_VALUE, edge.from, edge.to);
  }
  console.log(mapGraph);
  return graph;
}
