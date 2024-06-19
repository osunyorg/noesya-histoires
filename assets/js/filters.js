var optionElements = document.querySelectorAll('#story-filters input[type="checkbox"]');

optionElements.forEach(function(element) {
  element.addEventListener('click', function() {
    onUpdateOption(element.name, element.checked);
  })
})

function onUpdateOption(option, checked) {
  switch(option) {
    case "image":
      toggleImage(checked)
      break;
    case "text":

      break;
  }
}

function toggleImage(active) {

  if (active) {
    document.body.classList.add('with-images')
  } else {
    document.body.classList.remove('with-images')
  }

  // var images = document.querySelectorAll("img");
  // images.forEach(function(image) {
  //   image.style.display = active ? "flex" : "none";
  // })
}