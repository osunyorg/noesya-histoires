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
            this.ctx.moveTo(this.particleArray[particle.connections[j]].x / 100 * this.canvas.width, this.particleArray[particle.connections[j]].y  / 100 * this.canvas.height);
            this.ctx.lineTo(particle.x  / 100 * this.canvas.width, particle.y  / 100 * this.canvas.height);
        }
        
        this.ctx.stroke();
    }
}

function Particle(container, pos) {
    this.posX = pos.x;
    this.posY = pos.y;
    this.direction = Math.random()*Math.PI*2; // random entre 0 et 2 PI
    this.x = this.posX;
    this.y = this.posY;
    this.connections =  pos.connected;

    if(pos.link){
        var t = pos.link.innerText.split(" ");
        this.dom = document.createElement('div'); // crée le container
        this.dom.classList.add("menu-histoires-link");
    
        var titleElement = document.createElement('div');
        titleElement.innerHTML = t.shift();
        titleElement.classList.add("title-class"); // Ajoute la classe pour le titre
    
        var resteElement = document.createElement('div');
        resteElement.innerHTML = t.join(" ");
        resteElement.classList.add("reste-class");
        
        var circleElement = document.createElement('div');
        circleElement.classList.add("circle"); 
        var a = document.createElement('a');
        a.classList.add('menu-link'); 
        var url = pos.link;
        a.setAttribute('href', url);
        a.appendChild(titleElement);
        a.appendChild(resteElement);
        a.appendChild(circleElement);
        this.dom.appendChild(a);
        this.dom.style = "top: " + this.y + "px; left: " + this.x + "px; ";
        container.append(this.dom);


    }
}
    
Particle.prototype.update = function(particles, canvas) {
    var r = 0.01; // Rayon de deplaceemnt en % du canvas
    var dTc = Math.floor(Math.sqrt(Math.abs(Math.pow(this.x - this.posX, 2) + Math.pow(this.y - this.posY, 2)))); //Additionner les carrés pour distance euclidienne ?
    if(dTc >= r){
        this.direction += (Math.random() - 0.5) * (Math.PI/3); // TODO ameliorer les nouvelles direcitons je trouve pas ca ouf ( qqc comme tangeante à l'intersection du cercle)
    }
    this.x += Math.cos(this.direction)*0.005; // multiplication par la vitesse
    this.y += Math.sin(this.direction)*0.005;
    if(this.dom){
        this.dom.style = "top: "+(this.y)+"%; left: "+(this.x)+"%;"; // TODO Calcul width height pour l'offset
    }
}
export default MenuCanvas;