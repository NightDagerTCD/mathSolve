chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "fetchQuestionAndExpression") {
      extractQuestionAndExpression();
    }
  }
);

// Find fractions omfg this too forever for me to figure out wtf
function findFraction(numeratorElement, elements) {
  const numeratorPos = getElementPosition(numeratorElement);
  let closestDenominator = {distance: Infinity, element: null};

  elements.forEach(element => {
    if (element === numeratorElement || !isNumeric(element.textContent.trim())) return;

    const elementPos = getElementPosition(element);
    // Check for vertical alignment and below position
    if (numeratorPos.left === elementPos.left && elementPos.top > numeratorPos.top) {
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

// Get computed position of an element
function getElementPosition(element) {
  const style = window.getComputedStyle(element);
  const left = parseFloat(style.left);
  const top = parseFloat(style.top);
  return {left, top};
}

// Check if a string is actually a number value :I
function isNumeric(str) {
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function extractQuestionAndExpression() {
  // Extracting
  const questionPrompt = document.querySelector("#algoPrompt")?.textContent.trim() || "Question prompt not found.";

  let expression = "";
  let tempSubSup = ""; // Temp string for consecutive SScripts (Super/Subscripts)
  let lastFontSize = 0; // Track font size for SScript detection
  let elementsProcessed = new Set(); // Track processed elements, including fractions

  const expressionComponents = document.querySelectorAll(".statement_body .AnsedObject");
  
  expressionComponents.forEach((component, index) => {
    if (elementsProcessed.has(component)) return; // Skip processed elems (for fractions and whatever)
    
    const style = window.getComputedStyle(component);
    const fontSize = parseInt(style.fontSize, 10);
    const text = component.textContent.trim();

    // Detect and handle fractions
    if (isNumeric(text)) {
      const {numerator, denominator, denominatorComponent} = findFraction(component, expressionComponents);
      if (numerator && denominator) {
        expression += `${numerator}/${denominator} `; // Fraction into expression
        elementsProcessed.add(denominatorComponent); // Mark denominator as processed
        elementsProcessed.add(component); // Mark numerator as processed
        return; // Skip further processing for this component for like if it's done and stuff
      }
    }

    // Handle SScripts detection by font size
    if (fontSize !== lastFontSize && tempSubSup) {
      expression += `^{${tempSubSup}} `; // Finish SScript sequence
      tempSubSup = ""; // Reset for next sequence if there is one?
    }

    // Normal text vs. SScripts
    if (fontSize > 12) {
      if (tempSubSup) { // If ending a SScript sequence
        expression += `^{${tempSubSup}}`; // Append SScript
        tempSubSup = ""; // Reset because just in case
      }
      expression += `${text} `;
    } else { // SScript detected by smaller font because why not
      tempSubSup += text;
    }

    lastFontSize = fontSize;

    // Append remaining SScript at the end
    if (index === expressionComponents.length - 1 && tempSubSup) {
      expression += `^{${tempSubSup}} `;
    }
  });

  // Final check for expression content
  if (!expression) {
    expression = "Expression not found.";
  }

  // Output for debugging/testing before API integration -- somebody remember to remove this once it's integrated
  alert(`Question: ${questionPrompt}\nExpression: ${expression.trim()}`);
}
