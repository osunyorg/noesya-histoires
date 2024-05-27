"use strict";
import MenuCanvas from "./constellation";
import GlCanvas from "./sky";

var startTime, elapsed;
var menu;

window.onload = function(e) {
  menu = document.querySelector(".menu-histoires");
  var options = {
    visual: true,
    sound: false
  };
  
  if(options.visual){
    if (menu) { 
      var ul = menu.querySelector('.menu-histoires-liste'); // TODO
      var liste = ul.querySelectorAll('li a');
      
      var menucontainer = menu.querySelector(".menu-container");
      var menucanvas = menucontainer.querySelector("#chouettecanvas");
      if (menucanvas) {
        resizeCanvasToDisplaySize(menucanvas);
        menucontainer.canvas = menucanvas;
        // TODO: check que il y a bien liste
        menu.constellation = new MenuCanvas(menucontainer, liste);
      }
  
      var glcanvas = menu.querySelector(".glcanvas");
      if (glcanvas) {
        resizeCanvasToDisplaySize(glcanvas);
        menu.glCanvas = new GlCanvas(glcanvas);
      }
      startTime = Date.now();
      draw();
    }
  }


   var circles = document.querySelectorAll('.menu-histoires-link');
    for (var i = 0; i < circles.length; i++) {
   circles[i].addEventListener('click', function(event) { 
  event.preventDefault();
  var linkElement = this.querySelector('.menu-link');
  console.log(linkElement);
      var url = linkElement.href;
    document.querySelector('.sprite').classList.add('active');
    document.querySelector('#chouettecanvas').classList.add('fade');
    for (var i = 0; i<circles.length; i++){
      circles[i].classList.add('fade');
    }
    document.addEventListener("animationend", function(event){
      window.location.href = url;
          });
        });
      }
 
}



function draw() {
  elapsed = Date.now() - startTime;
  if(menu.glCanvas){
    if(menu.glCanvas.isReady){
      menu.glCanvas.draw(elapsed);
    }
  } 
  if(menu.constellation){
    menu.constellation.draw();
  }
  requestAnimationFrame(draw);
}

function resizeCanvasToDisplaySize(canvas) {
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
  canvas.width  = displayWidth;
  canvas.height = displayHeight;
}

// window.addEventListener('mousemove', function(event) {  // gerer en CSS 
//     var rect =  menu.constellation.canvas.getBoundingClientRect();
//     var mouseX = event.clientX - rect.left;
//     var mouseY = event.clientY - rect.top;

//     menu.constellation.particleArray.forEach(particle => {
//         var distance = Math.sqrt((particle.x - mouseX) ** 2 + (particle.y - mouseY) ** 2);
//         particle.isHovered = distance < particle.size*5;
//     });
// });

window.addEventListener("resize", () => {
  resizeCanvasToDisplaySize(menu.glCanvas.canvas);
  resizeCanvasToDisplaySize(menu.constellation.canvas);
});