chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "fetchQuestionAndExpression") {
    console.log("Attempting to detect fractions...");
    detectFractions();
  }
});

function detectFractions() {
  const elements = document.querySelectorAll(".AnsedObject[style*='position: absolute']");
  let fractionPairs = []; // To store fractions as {numerator, denominator} objects

  elements.forEach((element) => {
    const elemText = element.textContent.trim();
    const elemPos = getElementPosition(element);

    // Skipping non-numeric elements for numerator
    if (!isNumeric(elemText)) return;

    let closest = {element: null, distance: Infinity};

    elements.forEach((compareElem) => {
      if (compareElem === element || !isNumeric(compareElem.textContent.trim())) return; // Skip same element or non-numeric
      
      const compPos = getElementPosition(compareElem);
      if (elemPos.left === compPos.left && compPos.top > elemPos.top) { // Vertically aligned and below
        const distance = compPos.top - elemPos.top;
        if (distance < closest.distance) {
          closest = {element: compareElem, distance: distance}; // Find closest denominator below the numerator
        }
      }
    });

    if (closest.element) {
      const numerator = elemText;
      const denominator = closest.element.textContent.trim();
      fractionPairs.push({numerator, denominator}); // Store found fraction
    }
  });

  // Filter out unique fractions
  const uniqueFractions = Array.from(new Set(fractionPairs.map(fp => `${fp.numerator}/${fp.denominator}`)));

  if (uniqueFractions.length > 0) {
    alert(`Detected fractions: ${uniqueFractions.join(", ")}`);
  } else {
    alert("No fractions were detected.");
  }
}

function getElementPosition(element) {
  const style = window.getComputedStyle(element);
  const left = parseInt(style.left, 10);
  const top = parseInt(style.top, 10);
  return { left, top };
}

function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}
