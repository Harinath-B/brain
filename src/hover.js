(function () {
    var MorphBg = function (element) {
      this.element = element;
      this.wrapper = this.element.closest(".js-morph-bg-wrapper");
      this.elementId = this.element.getAttribute("id");
      this.targets = document.querySelectorAll(
        '[data-morph-bg="' + this.elementId + '"]'
      );
      this.bgTargets = [];
      this.action = this.element.getAttribute("data-morph-bg-event");
      this.targetIndex = false;
      this.deafultIndex = false;
      if (!this.action) this.action = "click";
      initMorphBg(this);
    };
  
    function initMorphBg(element) {
      getBgTargets(element);
      // see if we need to set the element visible
      setInitialState(element);
      // add listeners
      if (element.action == "click") {
        initClickEvent(element);
      } else {
        initHoverEvent(element);
      }
      // on window resize/fonts loaded - reset background element size
      window.addEventListener("update-morphbg", function () {
        morphBgResize(element);
      });
      window.addEventListener("hide-morphbg", function () {
        morphBgHide(element);
      });
    }
  
    function getBgTargets(element) {
      for (var i = 0; i < element.targets.length; i++) {
        var bgTarget =
          element.targets[i].querySelector("[data-morph-bg-target]") ||
          element.targets[i];
        element.bgTargets.push(bgTarget);
      }
    }
  
    function setInitialState(element) {
      for (var i = 0; i < element.targets.length; i++) {
        if (element.targets[i].hasAttribute("data-morph-bg-active")) {
          setPosition(element, i);
          element.deafultIndex = i;
          break;
        }
      }
    }
  
    function initClickEvent(element) {
      for (var i = 0; i < element.targets.length; i++) {
        (function (i) {
          element.targets[i].addEventListener("click", function (event) {
            setPosition(element, i);
          });
        })(i);
      }
    }
  
    function initHoverEvent(element) {
      for (var i = 0; i < element.targets.length; i++) {
        (function (i) {
          element.targets[i].addEventListener("mouseenter", function (event) {
            setPosition(element, i);
          });
          element.targets[i].addEventListener("mouseleave", function (event) {
            resetBgPosition(element, event);
          });
        })(i);
      }
  
      // if there's [data-morph-bg-preserve] element - detect mouseleave
      var preserveWrapper = element.targets[0].closest(
        "[data-morph-bg-preserve]"
      );
      if (preserveWrapper) {
        preserveWrapper.addEventListener("mouseleave", function (event) {
          resetBgPosition(element, event);
        });
      }
    }
  
    function setPosition(element, index) {
      // get size + position target
      var targetInfo = element.bgTargets[index].getBoundingClientRect(),
        targetRadius = getComputedStyle(element.bgTargets[index]).borderRadius;
  
      // get the wrapper parent info
      var wrapperInfo = element.wrapper.getBoundingClientRect();
  
      // modify element position and size
      element.element.style.transform =
        "translateX(" +
        (targetInfo.left - wrapperInfo.left) +
        "px) translateY(" +
        (targetInfo.top - wrapperInfo.top) +
        "px) translateZ(-0.1px)";
      element.element.style.height = targetInfo.height + "px";
      element.element.style.width = targetInfo.width + "px";
  
      // modify element radius
      element.element.style.borderRadius = targetRadius;
  
      // show item
      element.element.classList.add("morph-bg--visible");
      setTimeout(function () {
        if (!element.element.classList.contains("morph-bg--has-transition"))
          element.element.classList.add("morph-bg--has-transition");
      }, 10);
  
      // update target index
      element.targetIndex = index;
    }
  
    function resetBgPosition(element, event) {
      if (
        event.relatedTarget.closest(
          '[data-morph-bg="' + element.elementId + '"]'
        ) ||
        event.relatedTarget.closest("[data-morph-bg-preserve]")
      ) {
        return; // mouse is inside another target
      }
      // check if tehre was a default index
      if (element.deafultIndex !== false) {
        element.targetIndex = element.deafultIndex;
        setPosition(element, element.targetIndex);
        return;
      }
      // if none of the above -> hide bg
      element.element.classList.remove(
        "morph-bg--visible",
        "morph-bg--has-transition"
      );
      // reset target index
      element.targetIndex = false;
    }
  
    function morphBgResize(element) {
      if (element.targetIndex === false) return;
      setPosition(element, element.targetIndex);
      element.element.style.display = "";
    }
  
    function morphBgHide(element) {
      element.element.style.display = "none";
    }
  
    window.MorphBg = MorphBg;
  
    //initialize the MorphBg objects
    var morphBg = document.getElementsByClassName("js-morph-bg");
    if (morphBg.length > 0) {
      for (var i = 0; i < morphBg.length; i++) {
        (function (i) {
          new MorphBg(morphBg[i]);
        })(i);
      }
    }
  
    // on window resize - reset morph bg size
    var resizingId = false,
      customEventMorph = new CustomEvent("update-morphbg"),
      customEventHide = new CustomEvent("hide-morphbg");
  
    window.addEventListener("resize", function () {
      if (!resizingId) doneResizing(customEventHide);
      clearTimeout(resizingId);
      resizingId = setTimeout(function () {
        doneResizing(customEventMorph);
        resizingId = false;
      }, 100);
    });
  
    // wait for font to be loaded
    if (document.fonts) {
      document.fonts.onloadingdone = function (fontFaceSetEvent) {
        doneResizing(customEventMorph);
      };
  
      document.fonts.ready.then(function () {
        setTimeout(function () {
          doneResizing(customEventMorph);
        }, 300);
      });
    }
  
    function doneResizing(customEvent) {
      window.dispatchEvent(customEvent);
    }
  })();
  
  /* ------------------------ Watermark (Please Ignore) ----------------------- */
  const createSVG = (width, height, className, childType, childAttributes) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
    const child = document.createElementNS(
      "http://www.w3.org/2000/svg",
      childType
    );
  
    for (const attr in childAttributes) {
      child.setAttribute(attr, childAttributes[attr]);
    }
  
    svg.appendChild(child);
  
    return { svg, child };
  };
  
  document.querySelectorAll(".generate-button").forEach((button) => {
    const width = button.offsetWidth;
    const height = button.offsetHeight;
  
    const style = getComputedStyle(button);
  
    const strokeGroup = document.createElement("div");
    strokeGroup.classList.add("stroke");
  
    const { svg: stroke } = createSVG(width, height, "stroke-line", "rect", {
      x: "0",
      y: "0",
      width: "100%",
      height: "100%",
      rx: parseInt(style.borderRadius, 10),
      ry: parseInt(style.borderRadius, 10),
      pathLength: "30"
    });
  
    strokeGroup.appendChild(stroke);
    button.appendChild(strokeGroup);
  
    const stars = gsap.to(button, {
      repeat: -1,
      repeatDelay: 0.5,
      paused: true,
      keyframes: [
        {
          "--generate-button-star-2-scale": ".5",
          "--generate-button-star-2-opacity": ".25",
          "--generate-button-star-3-scale": "1.25",
          "--generate-button-star-3-opacity": "1",
          duration: 0.3
        },
        {
          "--generate-button-star-1-scale": "1.5",
          "--generate-button-star-1-opacity": ".5",
          "--generate-button-star-2-scale": ".5",
          "--generate-button-star-3-scale": "1",
          "--generate-button-star-3-opacity": ".5",
          duration: 0.3
        },
        {
          "--generate-button-star-1-scale": "1",
          "--generate-button-star-1-opacity": ".25",
          "--generate-button-star-2-scale": "1.15",
          "--generate-button-star-2-opacity": "1",
          duration: 0.3
        },
        {
          "--generate-button-star-2-scale": "1",
          duration: 0.35
        }
      ]
    });
  
    button.addEventListener("pointerenter", () => {
      gsap.to(button, {
        "--generate-button-dots-opacity": "1",
        duration: 0.5,
        onStart: () => {
          setTimeout(() => stars.restart().play(), 500);
        }
      });
    });
  
    button.addEventListener("pointerleave", () => {
      gsap.to(button, {
        "--generate-button-dots-opacity": "0",
        "--generate-button-star-1-opacity": ".25",
        "--generate-button-star-1-scale": "1",
        "--generate-button-star-2-opacity": "1",
        "--generate-button-star-2-scale": "1",
        "--generate-button-star-3-opacity": ".5",
        "--generate-button-star-3-scale": "1",
        duration: 0.15,
        onComplete: () => {
          stars.pause();
        }
      });
    });
  });