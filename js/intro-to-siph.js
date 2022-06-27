// Many thanks to this post: https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/


const dl0_0_element = document.getElementById('dl0_0');
const dl0_1_element = document.getElementById('dl0_1');
const dl0_ckt_element = document.getElementById('dl0_ckt');
const dl0_polyline_element = document.getElementById('dl0_polyline');
const dl0_arc1_element = document.getElementById('dl0_arc1');
const dl0_arc2_element = document.getElementById('dl0_arc2');
const dl0_arc3_element = document.getElementById('dl0_arc3');

let selectedElement;
let initialMousePosition;
let wait = false;
let dl0_initial_height = parseFloat(dl0_0_element.getAttribute("height"));
const dl0_min_height = 100;
const dl0_max_height = 250;

// from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){
    while(endAngle < startAngle) endAngle += 360;

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;       
}
dl0_arc1_element.setAttribute("d", describeArc(350, 175, 50, 0,90)) // initialize these arcs
const arc2_description0 = [450, 375, 50, 90,-90];
dl0_arc2_element.setAttribute("d", describeArc(...arc2_description0)) // initialize these arcs
dl0_arc3_element.setAttribute("d", describeArc(550, 175, 50, -90,0)) // initialize these arcs
// who the eff implemented the path function in svgs?! This is bonkers

//https://stackoverflow.com/questions/42960954/generate-svg-sine-wave-with-one-segment
function updateDL0Plot(len) {
  const width = 800;
  const pointSpacing = 1;
  const f = len/2000;
  const amplitude = 150;
  const originX=100;
  const originY=400;
  const origin = {x: originX, y: originY};

  let startPoint = [100,400];
  let endPoint = [900,400];
 
  let points = [];
  points.push(startPoint);
  let x,y;
  for (let i=0; i < width/pointSpacing; i++) {
    x = i*pointSpacing + origin.x;
    y = amplitude * Math.sin(f*i) + origin.y - amplitude;
    points.push([x,y]);
  }
  points.push(endPoint);
  dl0_polyline_element.setAttribute("points",points.join(" "));
  // Plotly.update(dl0_plot_element,dl0_plotly_plot(len),{},[0])
}
updateDL0Plot(dl0_initial_height)

function getMousePosition(svg, evt) {
  var CTM = svg.getScreenCTM();
  if (evt.touches) { evt = evt.touches[0]; }
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d
  };
}

function start_dl0_drag(evt) {
  initialMousePosition = getMousePosition(dl0_ckt_element, evt);
  selectedElement = dl0_ckt_element;
  dl0_initial_height = parseFloat(dl0_0_element.getAttribute("height"));

  dl0_ckt_element.addEventListener('mousemove', dl0_drag);
  dl0_ckt_element.addEventListener('touchmove', dl0_drag);
}

function dl0_drag(evt) {
  if (!wait) {
    if (selectedElement) {
      evt.preventDefault();
      var coord = getMousePosition(dl0_ckt_element, evt);
      dy = coord.y - initialMousePosition.y;
      new_height = dl0_initial_height + dy;
      if (new_height < dl0_min_height) {
        new_height = dl0_min_height;
      }
      if (new_height > dl0_max_height) {
        new_height = dl0_max_height;
      }

      dl0_0_element.setAttribute("height", new_height); //setting individual element inside ckt svg
      dl0_1_element.setAttribute("height", new_height); //setting individual element inside ckt svg
      let arc2_description = [...arc2_description0];
      arc2_description[1] = arc2_description[1] + (new_height - 200) // did I mention svg arcs are dumb?
      dl0_arc2_element.setAttribute("d", describeArc(...arc2_description)) 
      

      updateDL0Plot(new_height);

      wait = true;
      setTimeout(function () {
        wait = false;
      }, 10) //in ms
    }
  }

}

function end_dl0_drag(evt) {
  selectedElement = null;
  initialMousePosition = null;

  dl0_ckt_element.removeEventListener('mousemove', dl0_drag);
  dl0_ckt_element.removeEventListener('touchmove', dl0_drag);
}

dl0_ckt_element.addEventListener('touchstart', start_dl0_drag);
dl0_ckt_element.addEventListener('mousedown', start_dl0_drag);
dl0_ckt_element.addEventListener('mouseup', end_dl0_drag);
// dl0_ckt_element.addEventListener('mouseleave', end_dl0_drag);
dl0_ckt_element.addEventListener('touchend', end_dl0_drag);
// dl0_ckt_element.addEventListener('touchleave', end_dl0_drag);
dl0_ckt_element.addEventListener('touchcancel', end_dl0_drag);


