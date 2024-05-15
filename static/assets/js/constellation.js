window.onload = function() {
    const titres = document.querySelector('.menu-histoires').innerText;
    const pagesURL = document.querySelectorAll('.menu-histoires');
    console.log(titres);
    console.log(pagesURL); // Pour voir les éléments récupérés
};

var canvas = document.querySelector("#chouettecanvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;




// Positions en pourcentage par rapport à la taille actuelle du canvas
const positions = [
    { x: 53, y: 18 },
   { x: 58, y: 35 },
    { x: 47, y: 33 },
    { x: 59, y: 55 },
    { x: 52, y: 68 },
    { x: 45, y: 83 },
    { x: 40, y: 58 },
    { x: 0, y: 0 } 
];

//Créer limites de la constellation
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const halfDiagonalX = Math.min(canvas.width, canvas.height) / 12;
const halfDiagonalY = Math.min(canvas.width, canvas.height) / 6;

let ParticleArray = [];

class Particle {
    constructor() {
        this.size = Math.random() * 10 + 10;
        this.directionX = Math.random();
        this.directionY = Math.random();
        this.connections = 0;
        this.isHovered = false;
    }

    update(Particles) {
        this.x += this.directionX * 0.0002;
        this.y += this.directionY * 0.0002;

        //reste dans les limites
        let influence = ((Math.abs(this.x - centerX) / halfDiagonalX) + (Math.abs(this.y - centerY) / halfDiagonalY)) - 1;
        if (influence > 0) {
            this.directionX -= (influence * (this.x - centerX) / halfDiagonalX );
            this.directionY -= (influence * (this.y - centerY) / halfDiagonalY );
        }
        
        //Les particules se repoussent les unes les autres
        Particles.forEach(particle => {
            if (particle !== this) {
                const dx = particle.x - this.x;
                const dy = particle.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 300) {
                    const repulsion = 1;
                    this.directionX -= (dx * repulsion)/50;
                    this.directionY -= (dy * repulsion)/50;
                }
            }
        });
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.isHovered ? '#FFD700' : '#FFF';
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

    }

    resetConnections() {
        this.connections = 0;
    }
}

const initParticles = () => {
    ParticleArray = [];
        positions.forEach(pos => {
        const absoluteX = canvas.width * (pos.x / 100);
        const absoluteY = canvas.height * (pos.y / 100);
        ParticleArray.push(new Particle(absoluteX, absoluteY));
    });
};

initParticles();

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
ParticleArray.forEach(p => p.resetConnections()); //connections entre particules
    for (let i = 0; i < ParticleArray.length; i++) {
        ParticleArray[i].update(ParticleArray);
        for (let j = i + 1; j < ParticleArray.length; j++) {
            if (ParticleArray[i].connections < 3 && ParticleArray[j].connections < 3) { //Pas plus de 2-3 connections inter-particules
                let dx = ParticleArray[j].x - ParticleArray[i].x;
                let dy = ParticleArray[j].y - ParticleArray[i].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 400) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = "#fff";
                    ctx.moveTo(ParticleArray[j].x, ParticleArray[j].y);
                    ctx.lineTo(ParticleArray[i].x, ParticleArray[i].y);
                    ctx.stroke();
                    ParticleArray[i].connections++;
                    ParticleArray[j].connections++;
                }
            }
        }
        ParticleArray[i].draw();
    }

    requestAnimationFrame(animate);
}

animate();
window.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    ParticleArray.forEach(particle => {
        const distance = Math.sqrt((particle.x - mouseX) ** 2 + (particle.y - mouseY) ** 2);
        particle.isHovered = distance < particle.size*5;
    });
});

window.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    ParticleArray.forEach(particle => {
        const distance = Math.sqrt((particle.x - mouseX) ** 2 + (particle.y - mouseY) ** 2);
        if (distance < particle.size*5) {
            document.querySelector('.sprite').classList.add('active');
            document.querySelector('#chouettecanvas').classList.add('fade');
        }
    });
});

window.addEventListener("resize", () => {
    // Sauvegarder les anciennes dimensions pour le calcul des ratios
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    // Mise à jour des dimensions du canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calculer les nouveaux paramètres de positionnement
    const newCenterX = canvas.width / 2;
    const newCenterY = canvas.height / 2;
    const scaleWidth = canvas.width / oldWidth;
    const scaleHeight = canvas.height / oldHeight;

    ParticleArray.forEach((particle, index) => {
        particle.x = canvas.width * (positions[index].x / 100);
        particle.y = canvas.height * (positions[index].y / 100);
    });
});