const bars = document.querySelectorAll(".bar");
const barsLength = bars.length;
const lastToFill = barsLength - 2;
const lastToReturn = 1;
const timeout = 200;

let animationCounter = 0;
let animationStarted = false;
let leftView = false;

window.addEventListener("scroll", (event) => {
  const isInView = isElementInViewport(bars[0]);

  (isInView && !animationStarted) ? startAnimation(): '';

});

function startAnimation() {
  if (bars && barsLength > 0) {
    animationStarted = true;
    addClass();
  }
}

function addClass(returnLastItem) {
  if (animationCounter < 3) {
    animationCounter++;

    for (let i = 0; i <= lastToFill; i++) {
      if (!bars[i].classList.contains("alter-bar")) {
        bars[i].classList.add("alter-bar");
      }

      if (i === lastToFill && returnLastItem) {
        return true;
      }
    }

    removeClass();

  }
}

function removeClass() {
  const removeClassTimeout = setTimeout(function () {
    for (let i = lastToFill; i >= lastToReturn; i--) {
      if (bars[i] && bars[i].classList.contains("alter-bar")) {
        bars[i].classList.remove("alter-bar");
      }
    }
    nextIteration();
    clearTimeout(removeClassTimeout);
  }, timeout);
}

function nextIteration() {
  const timesToRepeat = 3;
  const nextIterationTimeout = setTimeout(() => {
    const value = addClass(true);

    if (value) {
      for (let j = 0; j < timesToRepeat; j++) {
        if (j === timesToRepeat - 1) {
          const iterationEndTimeout = setTimeout(() => {
            removeClass();
            clearTimeout(iterationEndTimeout);
            clearTimeout(nextIterationTimeout);
          }, timeout * (j + 1));

          break;
        }

        if (j % 2 === 0) {
          const evenIterationTimeout = setTimeout(() => {
            bars[lastToFill].classList.remove("alter-bar");
            bars[lastToFill - 1].classList.remove("alter-bar");
            clearTimeout(evenIterationTimeout);
          }, timeout * (j + 1));
        } else {
          const oddIterationTimeout = setTimeout(() => {
            bars[lastToFill].classList.add("alter-bar");
            bars[lastToFill - 1].classList.add("alter-bar");
            clearTimeout(oddIterationTimeout);
          }, timeout * (j + 1));
        }
      }
    }

    clearTimeout(nextIterationTimeout);
  }, timeout);
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ************ PURPLE LINE ANIMATION ***********************
gsap.registerPlugin(DrawSVGPlugin);

gsap.defaults({ ease: "none" });

const main = gsap.timeline().from(".theLine", { drawSVG: 0, duration: 2 });