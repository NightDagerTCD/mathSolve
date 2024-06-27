chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "fetchQuestionAndExpression") {
    console.log("Content script activated");
    findAndReportUniqueFractions();
  }
});

function findAndReportUniqueFractions() {
  const elements = document.querySelectorAll(".AnsedObject[style*='position: absolute']");
  let fractions = new Set();

  elements.forEach((element) => {
    const style = element.getAttribute('style');
    const left = style.match(/left: (\d+)px/);
    const top = style.match(/top: (\d+)px/);

    if (!left || !top) return; // Skip if left or top are not found

    const positionKey = `left:${left[1]}`;
    elements.forEach((compareElement) => {
      if (element === compareElement) return; // Skip the same element comparison

      const compStyle = compareElement.getAttribute('style');
      const compLeft = compStyle.match(/left: (\d+)px/);
      const compTop = compStyle.match(/top: (\d+)px/);

      if (!compLeft || !compTop || positionKey !== `left:${compLeft[1]}`) return; // Ensure alignment and presence of positioning

      const distance = Math.abs(parseInt(top[1], 10) - parseInt(compTop[1], 10));
      if (distance < 50 && (isNumericOrSymbol(element.textContent) || isNumericOrSymbol(compareElement.textContent))) { // Assume max 50px vertical distance for fractions
        fractions.add(`${element.textContent}/${compareElement.textContent}`);
      }
    });
  });

  if (fractions.size > 0) {
    alert("Detected fractions: " + Array.from(fractions).join(", "));
  } else {
    alert("No fractions were detected.");
  }
}

function isNumericOrSymbol(text) {
  // Simple check to filter out common non-numeric and non-symbol elements
  return !isNaN(text) || ['+', '-', 'x', '÷'].includes(text);
}
