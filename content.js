chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "fetchQuestionAndExpression") {
      extractQuestionAndExpression();
    }
  }
);

function extractQuestionAndExpression() {
  // Extracting the main question prompt
  const questionPrompt = document.querySelector("#algoPrompt")?.textContent.trim() || "Question prompt not found.";

  let expression = "";
  let tempSubSup = ""; // Temporary string for consecutive superscripts/subscripts
  let lastFontSize = 0; // Track the last font size to detect changes

  const expressionComponents = document.querySelectorAll(".statement_body .AnsedObject");
  
  expressionComponents.forEach((component, index) => {
    const style = window.getComputedStyle(component);
    const fontSize = parseInt(style.fontSize, 10);
    const text = component.textContent.trim();

    // Check if it's super/subscript (SScript) by checking font size
    if (fontSize !== lastFontSize && tempSubSup) {
      // Finish SScript seq
      expression += `^{${tempSubSup}} `;
      tempSubSup = ""; // Reset for the next sequence
    }

    if (fontSize > 12) {
      if (tempSubSup) { // End SScript Sequence
        expression += `^{${tempSubSup}}`; // Append SScript
        tempSubSup = ""; // Reset
      }
      expression += `${text} `;
    } else { // Smaller font size indicates a super/subscript
      tempSubSup += text;
    }

    // Prepare for next iteration
    lastFontSize = fontSize;

    // If last component and there's an SScript, append that shit
    if (index === expressionComponents.length - 1 && tempSubSup) {
      expression += `^{${tempSubSup}} `;
    }
  });

  if (!expression) {
    expression = "Expression not found.";
  }

  // Display for debugging and testing all this code before integrating the API
  alert(`Question: ${questionPrompt}\nExpression: ${expression.trim()}`);
}
