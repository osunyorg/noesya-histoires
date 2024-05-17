function MenuCanvas(container, liste) {
    this.container = container;
    this.canvas = container.canvas;
    var links = new Array(7);
    for(var i= 0; i<liste.length; i++){
        links[i] = liste[i];
    }
    // Positions en pourcentage par rapport à la taille actuelle du canvas
    this.particlesInfos = [
        { x: 53, y: 18, connected: [1], link: links[0] },
        { x: 58, y: 35, connected: [2, 6], link: links[1] },
        { x: 59, y: 55, connected: [3], link: links[2] },
        { x: 52, y: 68, connected: [4, 5], link: links[3] },
        { x: 45, y: 83, connected: [5], link: links[4] },
        { x: 40, y: 58, connected: [6], link: links[5] },
        { x: 47, y: 33, connected: [0], link: links[6] }
    ];
    this.ctx = this.canvas.getContext('2d');
    this.particleArray = [];
    this.init();
}

MenuCanvas.prototype.init = function(){
    for (var i = 0; i < this.particlesInfos.length; i++) {
        this.particleArray.push(new Particle(this.container, this.particlesInfos[i]));
    }
}

MenuCanvas.prototype.draw = function(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (var i = 0; i < this.particleArray.length; i++) {
        var particle = this.particleArray[i];

        particle.update(this.particleArray, this.canvas); // mise à jour des positions
        // connections
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

function Particle(container, pos) {
    var canvas = container.canvas;
    this.size = Math.random() * 10 + 10;
    this.directionX = Math.random();
    this.directionY = Math.random();
    this.isHovered = false;
    this.x= canvas.width * (pos.x / 100);
    this.y= canvas.height * (pos.y / 100);
    this.connections =  pos.connected;
    this.link = pos.link;
    this.title = "";
    this.reste = "";
    this.url = "";

    if(pos.link){
            var t = pos.link.innerText.split(" ");
            this.title = t.shift();
            this.reste = t.join(" ");
            this.url = pos.link.href;
            this.dom = document.createElement('div'); // crée le container
            this.dom.classList.add("menu-histoires-link");
        
            var titleElement = document.createElement('div');
            titleElement.innerHTML = this.title;
            titleElement.classList.add("title-class"); // Ajoute la classe pour le titre
        
            var resteElement = document.createElement('div');
            resteElement.innerHTML = this.reste;
            resteElement.classList.add("reste-class"); // Ajoute la classe pour le reste du texte
        
            var a = document.createElement('a');
            a.setAttribute('href', this.url);
            a.appendChild(titleElement);
            a.appendChild(resteElement);
        
            this.dom.appendChild(a);
            this.dom.style = "top: " + this.y + "px; left: " + this.x + "px; ";
            container.append(this.dom);
    }
}
    
Particle.prototype.update = function(particles, canvas) {
    //this.x += this.directionX * 0.0002;
    //this.y += this.directionY * 0.0002;
    if(this.dom){
        this.dom.style = "top: "+this.y+"px; left: "+this.x+"px; ";
    }

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
    for(var i = 0; i < particles.length; i++){
        var particle = particles[i];
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
    }
}
export default MenuCanvas;