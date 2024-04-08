chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "fetchQuestionAndExpression") {
    extractQuestionAndExpression();
  }
});

function extractQuestionAndExpression() {
  const questionPrompt = document.querySelector("#algoPrompt")?.textContent.trim() || "Question prompt not found.";
  let expression = "";
  let lastFontSize = 0;
  let elementsProcessed = new Set();

  const expressionComponents = document.querySelectorAll(".statement_body .AnsedObject");

  expressionComponents.forEach((component, index) => {
    // Skip if already processed as part of a fraction
    if (elementsProcessed.has(component)) return;

    const style = window.getComputedStyle(component);
    const fontSize = parseInt(style.fontSize, 10);
    const text = component.textContent.trim();

    // Check for fractions
    if (isNumeric(text)) {
      const {numerator, denominator, denominatorComponent} = findFraction(component, expressionComponents);
      if (numerator && denominator) {
        expression += `${numerator}/${denominator} `;
        elementsProcessed.add(denominatorComponent); // Mark denominator as processed
        return; // Skip further processing for this component
      }
    }

    // Process non-fraction components (normal text and potential superscripts/subscripts)
    if (fontSize !== lastFontSize) {
      if (fontSize > 12) {
        expression += text + " ";
      } else { // Treat as subscript/superscript
        expression += `^{${text}} `;
      }
    } else {
      expression += text + " ";
    }
    lastFontSize = fontSize;
  });

  if (!expression) {
    expression = "Expression not found.";
  }

  alert(`Question: ${questionPrompt}\nExpression: ${expression.trim()}`);
}

function findFraction(numeratorElement, elements) {
  const numeratorPos = getElementPosition(numeratorElement);
  let closestDenominator = {distance: Infinity, element: null};

  elements.forEach(element => {
    if (element === numeratorElement || !isNumeric(element.textContent.trim())) return;

    const elementPos = getElementPosition(element);
    if (numeratorPos.left === elementPos.left && elementPos.top > numeratorPos.top) { // Vertically aligned and below
      const distance = elementPos.top - numeratorPos.top;
      if (distance < closestDenominator.distance) {
        closestDenominator = {distance, element};
      }
    }
  });

  if (closestDenominator.element) {
    return {
      numerator: numeratorElement.textContent.trim(),
      denominator: closestDenominator.element.textContent.trim(),
      denominatorComponent: closestDenominator.element
    };
  }

  return {};
}

function getElementPosition(element) {
  const style = window.getComputedStyle(element);
  const left = parseFloat(style.left);
  const top = parseFloat(style.top);
  return {left, top};
}

function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}
