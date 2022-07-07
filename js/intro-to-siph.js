// Many thanks to this post: https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/


const dl0_0_element = document.getElementById('dl0_0');
const dl0_1_element = document.getElementById('dl0_1');
const dl1_0_element = document.getElementById('dl1_0');
const dl1_1_element = document.getElementById('dl1_1');
const dl1_2_element = document.getElementById('dl1_2');
const dl1_3_element = document.getElementById('dl1_3');
const dl1_4_element = document.getElementById('dl1_4');
const dl1_5_element = document.getElementById('dl1_5');
const dl0_ckt_element = document.getElementById('dl0_ckt');
const dl1_ckt0_element = document.getElementById('dl1_ckt0');
const dl1_ckt1_element = document.getElementById('dl1_ckt1');
const dl1_ckt2_element = document.getElementById('dl1_ckt2');
const dl0_polyline_element = document.getElementById('dl0_polyline');
const dl1_polyline_element = document.getElementById('dl1_polyline');
const dl0_arc1_element = document.getElementById('dl0_arc1');
const dl0_arc2_element = document.getElementById('dl0_arc2');
const dl0_arc3_element = document.getElementById('dl0_arc3');
const dl1_arc1_element = document.getElementById('dl1_arc1');
const dl1_arc2_element = document.getElementById('dl1_arc2');
const dl1_arc3_element = document.getElementById('dl1_arc3');
const dl1_arc4_element = document.getElementById('dl1_arc4');
const dl1_arc5_element = document.getElementById('dl1_arc5');
const dl1_arc6_element = document.getElementById('dl1_arc6');
const dl1_arc7_element = document.getElementById('dl1_arc7');
const dl1_arc8_element = document.getElementById('dl1_arc8');
const dl1_arc9_element = document.getElementById('dl1_arc9');
const dl0_hover_element = document.getElementById('dl0_hover');
const dl1_hover_element = document.getElementById('dl1_hover');
const dc_element = document.getElementById('dc');
const dc_top_element = document.getElementById('dc_top');
const dc_bot_element = document.getElementById('dc_bot');
const dc_top_out_element = document.getElementById('dc_top_out');
const dc_bot_out_element = document.getElementById('dc_bot_out');
const dc_hover_element = document.getElementById('dc_hover');
const phase_element = document.getElementById('phase');
const eo_phase_out_element = document.getElementById('eo_phase_out');
const eo_volt_element = document.getElementById('eo_volt');
const eo_block_element = document.getElementById('eo_block');
const eo_phase_block_element = document.getElementById('eo_phase_block');
const eo_hover_element = document.getElementById('eo_hover');
const mzm_element = document.getElementById('mzm');
const mzm_block_element = document.getElementById('mzm_block');
const mzm_volt_element = document.getElementById('mzm_volt');
const mzm_out_element = document.getElementById('mzm_out');
const mzm_hover_element = document.getElementById('mzm_hover');


let selectedElement;
let initialMousePosition;
let wait = false;
let dl0_initial_height = parseFloat(dl0_0_element.getAttribute("height"));
const dl0_min_height = 10;
const dl0_max_height = 250;

const dl_plot_len_factor = 2000;

let dc_initial_length = 190;
let new_length;
const dc_max_length = 300;
const dc_min_length = 10;
dc_top_out_element.setAttribute("opacity",0.5+0.5*Math.sin(10*dc_initial_length/(dc_max_length-dc_min_length)))
dc_bot_out_element.setAttribute("opacity",0.5-0.5*Math.sin(10*dc_initial_length/(dc_max_length-dc_min_length)))

let phase_initial_rot = 0;
let new_rot;
const phase_min_rot = -70;
const phase_max_rot = 70;
const phase_width=500;

let mzm_initial_rot = 0;
let new_mzm_rot = 0;

let dl1_initial_height_0 = parseFloat(dl1_0_element.getAttribute("height"));
let dl1_initial_height_2 = parseFloat(dl1_2_element.getAttribute("height"));
let dl1_initial_height_4 = parseFloat(dl1_4_element.getAttribute("height"));

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

// who the eff implemented the path function in svgs?! This is bonkers
const arc2_description0 = [450, 375, 50, 90,-90];
// const arc5_description0 = [1050, 375, 50, 90,-90];
// const arc8_description0 = [1650, 375, 50, 90,-90];

dl0_arc1_element.setAttribute("d", describeArc(350, 175, 50, 0,90)) // initialize these arcs
dl0_arc2_element.setAttribute("d", describeArc(...arc2_description0)) // initialize these arcs
dl0_arc3_element.setAttribute("d", describeArc(550, 175, 50, -90,0)) // initialize these arcs

dl1_arc1_element.setAttribute("d", describeArc(350, 175, 50, 0,90)) // initialize these arcs
dl1_arc2_element.setAttribute("d", describeArc(...arc2_description0)) // initialize these arcs
dl1_arc3_element.setAttribute("d", describeArc(550, 175, 50, -90,0)) // initialize these arcs

dl1_arc4_element.setAttribute("d", describeArc(350, 175, 50, 0,90)) // initialize these arcs
dl1_arc5_element.setAttribute("d", describeArc(...arc2_description0)) // initialize these arcs
dl1_arc6_element.setAttribute("d", describeArc(550, 175, 50, -90,0)) // initialize these arcs

dl1_arc7_element.setAttribute("d", describeArc(350, 175, 50, 0,90)) // initialize these arcs
dl1_arc8_element.setAttribute("d", describeArc(...arc2_description0)) // initialize these arcs
dl1_arc9_element.setAttribute("d", describeArc(550, 175, 50, -90,0)) // initialize these arcs


//https://stackoverflow.com/questions/42960954/generate-svg-sine-wave-with-one-segment
function updateDL0Plot(len) {
  const width = 800;
  const pointSpacing = 1;
  const f = len/dl_plot_len_factor;
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
    y = amplitude * Math.sin(f*i + len/50.0) + origin.y - amplitude;
    points.push([x,y]);
  }
  points.push(endPoint);
  dl0_polyline_element.setAttribute("points",points.join(" "));
}
updateDL0Plot(dl0_initial_height)

function updateDL1Plot(len0,len1,len2) {
  const width = 800;
  const pointSpacing = 1;
  const f0 = len0/dl_plot_len_factor/2;
  const f1 = len1/dl_plot_len_factor/2;
  const f2 = len2/dl_plot_len_factor/2;
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
    y = amplitude * Math.sin(f0*i + len0/50.0) * Math.sin(f1*i + len1/50.0) * Math.sin(f2*i + len2/50.0);
    // y = amplitude * Math.sin(f0*i + len0/50.0);
    y = y + origin.y - amplitude;
    points.push([x,y]);
  }
  points.push(endPoint);
  dl1_polyline_element.setAttribute("points",points.join(" "));
}
updateDL1Plot(dl1_initial_height_0,dl1_initial_height_2,dl1_initial_height_4)

function getMousePosition(svg, evt) {
  var CTM = svg.getScreenCTM();
  if (evt.touches) { evt = evt.touches[0]; }
  return {
    x: (evt.clientX - CTM.e) / CTM.a,
    y: (evt.clientY - CTM.f) / CTM.d
  };
}

function start_phase_drag(evt) {
  initialMousePosition = getMousePosition(phase_element, evt);
  selectedElement = phase_element;
  eo_hover_element.setAttribute('display','none')
  phase_element.addEventListener('mousemove', phase_drag);
  phase_element.addEventListener('touchmove', phase_drag);
}

function end_phase_drag(evt) {
  selectedElement = null;
  initialMousePosition = null;
  phase_initial_rot = new_rot;
  phase_element.removeEventListener('mousemove', phase_drag);
  phase_element.removeEventListener('touchmove', phase_drag);
}

function set_phase_out(wvl) {
  let points = [];
  const width = 100;
  const pointSpacing = 1;
  const f0 = 1/10;
  const amplitude = 50;
  const originX=600;
  const originY=200;
  const origin = {x: originX, y: originY};
  let x,y;
  var dphi = -Math.PI*((phase_width / (wvl)))
  for (let i=0; i < width/pointSpacing; i++) {
    x = i*pointSpacing + origin.x;
    y = amplitude * Math.sin(f0*i - dphi)
    y = y + origin.y - amplitude;
    points.push([x,y]);
  }
  eo_phase_out_element.setAttribute("points",points.join(" "));
}
set_phase_out(25)

function phase_drag(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  if (!wait) {
    if (selectedElement) {      
      var coord = getMousePosition(selectedElement, evt);
      var dx = coord.x - initialMousePosition.x;
      new_rot = phase_initial_rot + dx/3;
      if (new_rot < phase_min_rot) {
        new_rot = phase_min_rot;
      }
      if (new_rot > phase_max_rot) {
        new_rot = phase_max_rot;
      }

      var opacity = 0.3+0.2*(2*new_rot)/(phase_max_rot-phase_min_rot);
      eo_block_element.setAttribute("opacity",opacity)
      eo_volt_element.setAttribute("transform","translate(350 460) rotate("+new_rot+")");

      var wvl = 25 - 5*(2*new_rot)/(phase_max_rot-phase_min_rot);
      var wvls = Math.ceil(phase_width/wvl);
      var phase_pts = "M 100,150 Q "+(100+wvl/2)+",250 "+(100+wvl)+",150 t "
      for (var i=0; i<wvls; i++) {
        phase_pts += wvl+",0 "
      }
      eo_phase_block_element.setAttribute("d",phase_pts)

      set_phase_out(wvl)

      wait = true;
      setTimeout(function () {
        wait = false;
      }, 15) //in ms
    }
  }
}


function start_mzm_drag(evt) {
  initialMousePosition = getMousePosition(mzm_element, evt);
  selectedElement = mzm_element;
  mzm_hover_element.setAttribute('display','none');
  mzm_element.addEventListener('mousemove', mzm_drag);
  mzm_element.addEventListener('touchmove', mzm_drag);
}

function end_mzm_drag(evt) {
  selectedElement = null;
  initialMousePosition = null;
  mzm_initial_rot = new_mzm_rot;
  mzm_element.removeEventListener('mousemove', mzm_drag);
  mzm_element.removeEventListener('touchmove', mzm_drag);
}

function mzm_drag(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  if (!wait) {
    if (selectedElement) {      
      var coord = getMousePosition(selectedElement, evt);
      var dx = coord.x - initialMousePosition.x;
      new_mzm_rot = mzm_initial_rot + dx/3;
      if (new_mzm_rot < phase_min_rot) {
        new_mzm_rot = phase_min_rot;
      }
      if (new_mzm_rot > phase_max_rot) {
        new_mzm_rot = phase_max_rot;
      }
      
      var opacity = 0.3+0.2*(2*new_mzm_rot)/(phase_max_rot-phase_min_rot);
      mzm_block_element.setAttribute("opacity",opacity)
      mzm_volt_element.setAttribute("transform","translate(550 360) rotate("+new_mzm_rot+")");

      var wvl = 25 - 5*(2*new_mzm_rot)/(phase_max_rot-phase_min_rot);
      var wvls = Math.ceil(phase_width/wvl);
      var phase_pts = "M 100,150 Q "+(100+wvl/2)+",250 "+(100+wvl)+",150 t "
      for (var i=0; i<wvls; i++) {
        phase_pts += wvl+",0 "
      }
      mzm_block_element.setAttribute("d",phase_pts)

      mzm_out_element.setAttribute("opacity",0.5+0.5*Math.sin((15*new_mzm_rot)/(phase_max_rot-phase_min_rot)) );

      wait = true;
      setTimeout(function () {
        wait = false;
      }, 15) //in ms
    }
  }
}

function start_dc_drag(evt) {
  initialMousePosition = getMousePosition(dc_element, evt);
  selectedElement = dc_element;
  dc_hover_element.setAttribute('display','none')
  dc_element.addEventListener('mousemove', dc_drag);
  dc_element.addEventListener('touchmove', dc_drag);
}

function dc_drag(evt) {
  evt.preventDefault();
  evt.stopPropagation();
  if (!wait) {
    if (selectedElement) {      
      var coord = getMousePosition(selectedElement, evt);
      var dx = coord.x - initialMousePosition.x;
      new_length = dc_initial_length + dx; 
      if (new_length < dc_min_length) {
        new_length = dc_min_length;
      }
      if (new_length > dc_max_length) {
        new_length = dc_max_length;
      }

      var top_pts = "100,70 150,70 200,150 210,150 "+String(210+new_length)+",150 "+String(210+new_length+50)+",70, 600,70"
      var bot_pts = "100,250 150,250 200,170 210,170 "+String(210+new_length)+",170 "+String(210+new_length+50)+",250 600,250"
      dc_top_element.setAttribute("points", top_pts); 
      dc_bot_element.setAttribute("points", bot_pts); 

      dc_top_out_element.setAttribute("opacity",0.5+0.5*Math.sin(10*new_length/(dc_max_length-dc_min_length)))
      dc_bot_out_element.setAttribute("opacity",0.5-0.5*Math.sin(10*new_length/(dc_max_length-dc_min_length)))


      wait = true;
      setTimeout(function () {
        wait = false;
      }, 15) //in ms
    }
  }
}

function end_dc_drag(evt) {
  selectedElement = null;
  initialMousePosition = null;
  dc_initial_length = new_length;
  dc_element.removeEventListener('mousemove', dc_drag);
  dc_element.removeEventListener('touchmove', dc_drag);
}

function start_dl0_drag(evt) {
  initialMousePosition = getMousePosition(dl0_ckt_element, evt);
  selectedElement = dl0_ckt_element;
  dl0_initial_height = parseFloat(dl0_0_element.getAttribute("height"));
  dl0_hover_element.setAttribute('display','none');
  dl0_ckt_element.addEventListener('mousemove', dl0_drag);
  dl0_ckt_element.addEventListener('touchmove', dl0_drag);
}

function start_dl1_ckt0_drag(evt) {
  initialMousePosition = getMousePosition(dl1_ckt0_element, evt);
  selectedElement = dl1_ckt0_element;
  dl0_initial_height = parseFloat(dl1_0_element.getAttribute("height"));
  dl1_hover_element.setAttribute('display','none');
  dl1_ckt0_element.addEventListener('mousemove', dl1_ckt0_drag);
  dl1_ckt0_element.addEventListener('touchmove', dl1_ckt0_drag);
}
function start_dl1_ckt1_drag(evt) {
  initialMousePosition = getMousePosition(dl1_ckt1_element, evt);
  selectedElement = dl1_ckt1_element;
  dl0_initial_height = parseFloat(dl1_2_element.getAttribute("height"));
  dl1_hover_element.setAttribute('display','none');
  dl1_ckt1_element.addEventListener('mousemove', dl1_ckt1_drag);
  dl1_ckt1_element.addEventListener('touchmove', dl1_ckt1_drag);
}
function start_dl1_ckt2_drag(evt) {
  initialMousePosition = getMousePosition(dl1_ckt2_element, evt);
  selectedElement = dl1_ckt2_element;
  dl0_initial_height = parseFloat(dl1_4_element.getAttribute("height"));
  dl1_hover_element.setAttribute('display','none');
  dl1_ckt2_element.addEventListener('mousemove', dl1_ckt2_drag);
  dl1_ckt2_element.addEventListener('touchmove', dl1_ckt2_drag);
}

let dl0_drag = (evt) => {
  dl_drag(dl0_0_element,dl0_1_element,dl0_arc2_element,updateDL0Plot,evt)
}
let dl1_ckt0_drag = (evt) => {
  dl_drag(dl1_0_element,dl1_1_element,dl1_arc2_element,update_dl1_ckt0_plot,evt)
}
let dl1_ckt1_drag = (evt) => {
  dl_drag(dl1_2_element,dl1_3_element,dl1_arc5_element,update_dl1_ckt1_plot,evt)
}
let dl1_ckt2_drag = (evt) => {
  dl_drag(dl1_4_element,dl1_5_element,dl1_arc8_element,update_dl1_ckt2_plot,evt)
}
let update_dl1_ckt0_plot = (h) => {
  updateDL1Plot(h,parseFloat(dl1_2_element.getAttribute("height")),parseFloat(dl1_4_element.getAttribute("height")))
}
let update_dl1_ckt1_plot = (h) => {
  updateDL1Plot(parseFloat(dl1_0_element.getAttribute("height")),h,parseFloat(dl1_4_element.getAttribute("height")))
}
let update_dl1_ckt2_plot = (h) => {
  updateDL1Plot(parseFloat(dl1_0_element.getAttribute("height")),parseFloat(dl1_2_element.getAttribute("height")),h)
}

function dl_drag(dl_0_element,dl_1_element,arc_element,dl_plot_fn,evt) {
  evt.preventDefault();
  evt.stopPropagation();
  if (!wait) {
    if (selectedElement) {      
      var coord = getMousePosition(selectedElement, evt);
      var dy = coord.y - initialMousePosition.y;
      var new_height = dl0_initial_height + dy;
      if (new_height < dl0_min_height) {
        new_height = dl0_min_height;
      }
      if (new_height > dl0_max_height) {
        new_height = dl0_max_height;
      }

      dl_0_element.setAttribute("height", new_height); //setting individual element inside ckt svg
      dl_1_element.setAttribute("height", new_height); //setting individual element inside ckt svg
      let arc2_description = [...arc2_description0];
      arc2_description[1] = arc2_description[1] + (new_height - 200) // did I mention svg arcs are dumb?
      arc_element.setAttribute("d", describeArc(...arc2_description)) 
      
      dl_plot_fn(new_height);

      wait = true;
      setTimeout(function () {
        wait = false;
      }, 15) //in ms
    }
  }
}
function end_dl0_drag(evt) {
  selectedElement = null;
  initialMousePosition = null;
  dl0_ckt_element.removeEventListener('mousemove', dl0_drag);
  dl0_ckt_element.removeEventListener('touchmove', dl0_drag);
}

function end_dl1_ckt0_drag(evt) {
  selectedElement = null;
  initialMousePosition = null;
  dl1_ckt0_element.removeEventListener('mousemove', dl1_ckt0_drag);
  dl1_ckt0_element.removeEventListener('touchmove', dl1_ckt0_drag);
}
function end_dl1_ckt1_drag(evt) {
  selectedElement = null;
  initialMousePosition = null;
  dl1_ckt1_element.removeEventListener('mousemove', dl1_ckt1_drag);
  dl1_ckt1_element.removeEventListener('touchmove', dl1_ckt1_drag);
}
function end_dl1_ckt2_drag(evt) {
  selectedElement = null;
  initialMousePosition = null;
  dl1_ckt2_element.removeEventListener('mousemove', dl1_ckt2_drag);
  dl1_ckt2_element.removeEventListener('touchmove', dl1_ckt2_drag);
}

dl0_ckt_element.addEventListener('touchstart', start_dl0_drag);
dl0_ckt_element.addEventListener('mousedown', start_dl0_drag);
dl0_ckt_element.addEventListener('mouseup', end_dl0_drag);
// // dl0_ckt_element.addEventListener('mouseleave', end_dl0_drag);
dl0_ckt_element.addEventListener('touchend', end_dl0_drag);
// // dl0_ckt_element.addEventListener('touchleave', end_dl0_drag);
dl0_ckt_element.addEventListener('touchcancel', end_dl0_drag);

dl1_ckt0_element.addEventListener('touchstart', start_dl1_ckt0_drag);
dl1_ckt0_element.addEventListener('mousedown', start_dl1_ckt0_drag);
dl1_ckt0_element.addEventListener('mouseup', end_dl1_ckt0_drag);
dl1_ckt0_element.addEventListener('touchend', end_dl1_ckt0_drag);
dl1_ckt0_element.addEventListener('touchcancel', end_dl1_ckt0_drag);

dl1_ckt1_element.addEventListener('touchstart', start_dl1_ckt1_drag);
dl1_ckt1_element.addEventListener('mousedown', start_dl1_ckt1_drag);
dl1_ckt1_element.addEventListener('mouseup', end_dl1_ckt1_drag);
dl1_ckt1_element.addEventListener('touchend', end_dl1_ckt1_drag);
dl1_ckt1_element.addEventListener('touchcancel', end_dl1_ckt1_drag);

dl1_ckt2_element.addEventListener('touchstart', start_dl1_ckt2_drag);
dl1_ckt2_element.addEventListener('mousedown', start_dl1_ckt2_drag);
dl1_ckt2_element.addEventListener('mouseup', end_dl1_ckt2_drag);
dl1_ckt2_element.addEventListener('touchend', end_dl1_ckt2_drag);
dl1_ckt2_element.addEventListener('touchcancel', end_dl1_ckt2_drag);

dc_element.addEventListener('touchstart', start_dc_drag);
dc_element.addEventListener('mousedown', start_dc_drag);
dc_element.addEventListener('mouseup', end_dc_drag);
dc_element.addEventListener('touchend', end_dc_drag);
dc_element.addEventListener('touchcancel', end_dc_drag);

phase_element.addEventListener('touchstart', start_phase_drag);
phase_element.addEventListener('mousedown', start_phase_drag);
phase_element.addEventListener('mouseup', end_phase_drag);
phase_element.addEventListener('touchend', end_phase_drag);
phase_element.addEventListener('touchcancel', end_phase_drag);

mzm_element.addEventListener('touchstart', start_mzm_drag);
mzm_element.addEventListener('mousedown', start_mzm_drag);
mzm_element.addEventListener('mouseup', end_mzm_drag);
mzm_element.addEventListener('touchend', end_mzm_drag);
mzm_element.addEventListener('touchcancel', end_mzm_drag);
