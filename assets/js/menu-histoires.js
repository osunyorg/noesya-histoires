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
  
  if (menu) { 
    var ul = menu.querySelector('.menu-histoires-liste'); // TODO
    var liste = ul.querySelectorAll('li a');
    
    var menucanvas = menu.querySelector("#chouettecanvas");
    if (menucanvas) {
      resizeCanvasToDisplaySize(menucanvas);
      // TODO: check que il y a bien liste
      console.log("cohehef")
      menu.constellation = new MenuCanvas(menucanvas, liste);
    }

    var glcanvas = menu.querySelector(".glcanvas");
    if (glcanvas) {
      resizeCanvasToDisplaySize(glcanvas);
      menu.glCanvas = new GlCanvas(glcanvas);
    }
    else {
      return;
    }
    startTime = Date.now();
    draw();
  }
}

function draw() {
  elapsed = Date.now() - startTime;
  if(menu.glCanvas.isReady){
    resizeCanvasToDisplaySize(menu.glCanvas.canvas);
    menu.glCanvas.draw(elapsed);
  } 
  if(menu.constellation){
    resizeCanvasToDisplaySize(menu.constellation.canvas);
    menu.constellation.draw();
  }
  requestAnimationFrame(draw);
}

function resizeCanvasToDisplaySize(canvas) {
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
  var needResize = canvas.width  !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

window.addEventListener('click', function(event) { // TODO : detecter direectement le clique sur la particule :)
    var rect = menu.constellation.canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    menu.constellation.particleArray.forEach(particle => {
        var distance = Math.sqrt((particle.x - mouseX) ** 2 + (particle.y - mouseY) ** 2);
        if (distance < particle.size*5) {
            document.querySelector('.sprite').classList.add('active');
            document.querySelector('#chouettecanvas').classList.add('fade');
        }
    });
});

window.addEventListener('mousemove', function(event) {  // gerer en CSS 
    var rect =  menu.constellation.canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    menu.constellation.particleArray.forEach(particle => {
        var distance = Math.sqrt((particle.x - mouseX) ** 2 + (particle.y - mouseY) ** 2);
        particle.isHovered = distance < particle.size*5;
    });
});

// window.addEventListener("resize", () => {
//     // Sauvegarder les anciennes dimensions pour le calcul des ratios
//     var oldWidth = canvas.width;
//     var oldHeight = canvas.height;

//     // Mise à jour des dimensions du canvas
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     // Calculer les nouveaux paramètres de positionnement
//     var newCenterX = canvas.width / 2;
//     var newCenterY = canvas.height / 2;
//     var scaleWidth = canvas.width / oldWidth;
//     var scaleHeight = canvas.height / oldHeight;

//     ParticleArray.forEach((particle, index) => {
//         particle.x = canvas.width * (positions[index].x / 100);
//         particle.y = canvas.height * (positions[index].y / 100);
//     });
// });