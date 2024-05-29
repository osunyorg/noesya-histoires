var sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', function() 
{
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;
});

var chapitres = document.querySelectorAll('.block');
console.log(chapitres);

var scrollY = window.scrollY;
window.addEventListener('scroll', function()
{
    scrollY = window.scrollY;
    var section = Math.round(scrollY / sizes.height)-1;
    var currentChapitre = (chapitres[section]);
    var previousChapitre = (chapitres[section-1]);
    var nextChapitre = (chapitres[section+1]);
    if(currentChapitre){
        currentChapitre.classList.add('apparition');
    }
    if(previousChapitre){
        previousChapitre.classList.remove('apparition');
    }
    if(nextChapitre){
    nextChapitre.classList.remove('apparition');
    }
});