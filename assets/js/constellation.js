function MenuCanvas(canvas) {
    this.canvas = canvas;
    // Positions en pourcentage par rapport à la taille actuelle du canvas
    this.positions = [
        { x: 53, y: 18 },
        { x: 58, y: 35 },
        { x: 47, y: 33 },
        { x: 59, y: 55 },
        { x: 52, y: 68 },
        { x: 45, y: 83 },
        { x: 40, y: 58 },
        { x: 0, y: 0 } 
    ];
    this.ctx = canvas.getContext('2d');
    this.particleArray = [];
    this.init();
}

MenuCanvas.prototype.init = function(){
    this.positions.forEach(pos => {
        var absoluteX = this.canvas.width * (pos.x / 100);
        var absoluteY = this.canvas.height * (pos.y / 100);
        this.particleArray.push(new Particle(absoluteX, absoluteY));
    });
}

MenuCanvas.prototype.draw = function(){

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particleArray.forEach(p => p.resetConnections()); //connections entre particules
    
    for (var i = 0; i < this.particleArray.length; i++) {
        var particle = this.particleArray[i];
        particle.update(this.particleArray, this.canvas);

        // TODO mieux gerer les connections
        for (var j = i + 1; j < this.particleArray.length; j++) {
            if (particle.connections < 3 && this.particleArray[j].connections < 3) { //Pas plus de 2-3 connections inter-particules
                var dx = this.particleArray[j].x - particle.x;
                var dy = this.particleArray[j].y - particle.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 400) {
                    this.ctx.beginPath();
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeStyle = "#fff";
                    this.ctx.moveTo(this.particleArray[j].x, this.particleArray[j].y);
                    this.ctx.lineTo(particle.x, particle.y);
                    this.ctx.stroke();
                    particle.connections++;
                    this.particleArray[j].connections++;
                }
            }
        }

        this.ctx.beginPath();
        this.ctx.fillStyle = particle.isHovered ? '#FFD700' : '#FFF';
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

class Particle { //passer ne ES5
    constructor(absoluteX, absoluteY) {
        this.size = Math.random() * 10 + 10;
        this.directionX = Math.random();
        this.directionY = Math.random();
        this.connections = 0;
        this.isHovered = false;
        this.x= absoluteX;
        this.y= absoluteY;
    }
    
    update(Particles, canvas) {
        this.x += this.directionX * 0.0002;
        this.y += this.directionY * 0.0002;
        
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

    resetConnections() {
        this.connections = 0;
    }
}

export default MenuCanvas;