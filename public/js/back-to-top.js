
// mkNode is the function to create html node for back-to-top button
// be careful the svg and path element have to using createElementNS
const mkNode = () => {
  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  // setup where to append the button
  const target = document.querySelector("footer");

  div1.classList.add("outer");
  div2.classList.add("back-to-top");
  svg.setAttribute('viewBox', "0 0 24 24");
  path.setAttribute("d", "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z");

  const el = [target, div1, div2, svg, path];

  for (let i = 1; i < el.length; i++) {
    el[i - 1].appendChild(el[i])
  }
}


// setCss function is for adding stytle for back-to-top button
const setCss = (color) => {

  let bottomPos;
  let rightPos;

  if (window.innerWidth >= 1280) {
    bottomPos = '5rem'
    rightPos = '6rem'
  }
  else {
    bottomPos = '30px'
    rightPos = '30px'
  };

  const backToTopStyle = {
    'display': 'block',
    'position': 'fixed',
    'background': color,
    'color': '#fff',
    'cursor': 'pointer',
    'userSelect': 'none',
    'borderRadius': '50%',
    'boxShadow': '0 2px 5px 0 rgba(0, 0, 0, .26)',
    'width': '56px',
    'height': '56px',
    'bottom': bottomPos,
    'right': rightPos,
    'zIndex': '999',
    'opacity': '1',
    'outline': '0',
    'transition': 'bottom .2s, opacity .2s'
  }

  for (const i in backToTopStyle) {
    document.querySelector('.back-to-top').style[i] = backToTopStyle[i]
  }

  const svgStyle = {
    'display': 'block',
    'fill': 'currentColor',
    'height': '24px',
    'margin': '16px auto 0',
    'width': '24px'
  }

  for (const i in svgStyle) {
    document.querySelector('.back-to-top > svg').style[i] = svgStyle[i]
  }

}


// using jQuery to fadeIn/Out back-to-top button
const showHide = () => {
  $(window).on('scroll', function () {
    // window.setTimeout(function () {
    if ($(document).scrollTop() >= 400) {
      $('.outer').fadeIn();
    }
    else {
      $('.outer').fadeOut();
    }
  });
}


const clickToTop = (speed) => {
  $('.outer').on('click', function () {
    const homeTop = $('body').position().top;
    $('html').animate({ scrollTop: homeTop }, speed)
  })
}



mkNode()

// setCss('rgb(255, 82, 82)')
setCss('#4d8f9fb1')

$('.outer').hide()

showHide()

clickToTop(100);
