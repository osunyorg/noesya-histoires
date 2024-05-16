function MenuCanvas(canvas, liste) {
    this.canvas = canvas;

    for(var i= 0; i<liste.length; i++){
        // console.log(liste[i].innerText, liste[i].href);
        // console.log(liste[i].innerText.split(" ")[0]);
        var t = liste[i].innerText.split(" ");
        var nom = t.shift();
        var reste = t.join(" ");
        //console.log(nom,": ", reste);
      }
  
    // Positions en pourcentage par rapport à la taille actuelle du canvas
    this.positions = [
        { x: 53, y: 18, connected: [1]},
        { x: 58, y: 35, connected: [2, 6]},
        { x: 59, y: 55, connected: [3]},
        { x: 52, y: 68, connected: [4, 5]},
        { x: 45, y: 83, connected: [5]},
        { x: 40, y: 58, connected: [6]},
        { x: 47, y: 33, connected: [0]}
    ];
    this.ctx = canvas.getContext('2d');
    this.particleArray = [];
    this.init();
}

MenuCanvas.prototype.init = function(){
    this.positions.forEach(pos => {
        // init la particule
        this.particleArray.push(new Particle(this.canvas, pos));
    });
}

MenuCanvas.prototype.draw = function(){

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.particleArray.forEach(p => p.resetConnections()); //connections entre particules
    
    for (var i = 0; i < this.particleArray.length; i++) {
        var particle = this.particleArray[i];
        particle.update(this.particleArray, this.canvas);
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "#fff";
        for(var j=0; j< particle.connections.length; j++){
            this.ctx.moveTo(this.particleArray[particle.connections[j]].x, this.particleArray[particle.connections[j]].y);
            this.ctx.lineTo(particle.x, particle.y);
        }
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.fillStyle = particle.isHovered ? '#FFD700' : '#FFF';
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class Particle { //passer ne ES5
    constructor(canvas, pos) {
        this.size = Math.random() * 10 + 10;
        this.directionX = Math.random();
        this.directionY = Math.random();
        this.isHovered = false;
        this.x= canvas.width * (pos.x / 100);
        this.y= canvas.height * (pos.y / 100);
        this.connections =  pos.connected;
    }
    
    update(Particles, canvas) {
        this.x += this.directionX * 0.00002;
        this.y += this.directionY * 0.00002;
        
        //Créer limites de la constellation
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var halfDiagonalX = Math.min(canvas.width, canvas.height) / 12;
        var halfDiagonalY = Math.min(canvas.width, canvas.height) / 6;

        //reste dans les limites
        var influence = ((Math.abs(this.x - centerX) / halfDiagonalX) + (Math.abs(this.y - centerY) / halfDiagonalY)) - 1;
        if (influence > 0) {
            this.directionX -= (influence * (this.x - centerX) / halfDiagonalX );
            this.directionY -= (influence * (this.y - centerY) / halfDiagonalY );
        }
        
        //Les particules se repoussent les unes les autres
        Particles.forEach(particle => {
            if (particle !== this) {
                var dx = particle.x - this.x;
                var dy = particle.y - this.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 300) {
                    var repulsion = 1;
                    this.directionX -= (dx * repulsion)/50;
                    this.directionY -= (dy * repulsion)/50;
                }
            }
        });
    }

    // resetConnections() {
    //     this.connections = 0;
    // }
}

export default MenuCanvas;