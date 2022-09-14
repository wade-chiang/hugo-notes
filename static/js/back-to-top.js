
// mkNode is the function to create html node for back-to-top button
// be careful the svg and path element have to using createElementNS
const mkNode = () => {
  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const target = document.querySelector(".div2");

  div1.classList.add("outer");
  div2.classList.add("back-to-top");
  svg.setAttribute('viewBox', "0 0 24 24");
  path.setAttribute("d", "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z");

  const el = [target,div1, div2, svg, path];

  for (let i = 1; i < el.length; i++) {
    el[i-1].appendChild(el[i])
  }
}

// addCss function is for adding stytle for back-to-top button
const addCss = () => {
  document.querySelector(".back-to-top").style.cssText = `
  background: rgb(255, 82, 82);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .26);
  border-radius: 50%;
  bottom: 20px;
  right: 20px;
  color: #fff;
  cursor: pointer;
  display: block;
  height: 56px;
  width: 56px;
  position: fixed;
  user-select: none;
  z-index: 999;

  opacity: 1;
  outline: 0;
  transition: bottom .2s, opacity .2s;
`

  document.querySelector(".back-to-top > svg").style.cssText = `
  display: block;
  fill: currentColor;
  height: 24px;
  margin: 16px auto 0;
  width: 24px;
`
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
    // }, 100);
  });
}


mkNode()

addCss()

$('.outer').hide()

showHide()
