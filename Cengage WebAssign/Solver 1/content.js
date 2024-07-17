// Function to extract and format questions
function extractQuestions() {
  const questions = document.querySelectorAll('.wa1par'); // Adjust the selector based on actual HTML structure
  let formattedQuestions = '';

  questions.forEach((question, index) => {
    let questionText = question.innerHTML;

    // Replace fractions
    questionText = questionText.replace(/<table class="watexfraction">.*?<td class="watexnumerator">(.*?)<\/td>.*?<td class="watexdenominator">(.*?)<\/td>.*?<\/table>/g, (match, numerator, denominator) => {
      return `${numerator.trim()} / ${denominator.trim()}`;
    });

    // Replace superscript for squared numbers and other superscripts
    questionText = questionText.replace(/<span[^>]*font-size:\s*1\.12em[^>]*>(.*?)<\/span>/g, (match, content) => {
      return `${content.trim()}^2`;
    });

    questionText = questionText.replace(/<sup>(.*?)<\/sup>/g, (match, content) => {
      return `^${content.trim()}`;
    });

    // Replace square roots
    questionText = questionText.replace(/<table class="watexsqrt">.*?<td class="watexsqrtradical">.*?<\/td>.*?<td class="watexsqrtradicand">(.*?)<\/td>.*?<\/table>/g, (match, radicand) => {
      return `√(${radicand.trim()})`;
    });

    // Replace other specific HTML elements as needed (e.g., emphasized text)
    questionText = questionText.replace(/<em>(.*?)<\/em>/g, (match, content) => {
      return content.trim();
    });
    
    questionText = questionText.replace(/<span[^>]*>(.*?)<\/span>/g, (match, content) => {
      return content.trim();
    });

    // Replace specific fonts
    questionText = questionText.replace(/<font[^>]*>(.*?)<\/font>/g, (match, content) => {
      return content.trim();
    });

    // Remove any remaining HTML tags
    questionText = questionText.replace(/<\/?[^>]+(>|$)/g, "");

    // Replace HTML entities like &nbsp; with a space
    questionText = questionText.replace(/&nbsp;/g, " ");

    // Check for diagrams within the question
    const diagram = question.closest('.studentQuestionBox').querySelector('figure');
    if (diagram) {
      const description = diagram.querySelector('figcaption .desc')?.innerText || 'No description available';
      questionText += `\n\nDiagram: ${description.trim()}`;
    }

    formattedQuestions += `Question ${index + 1}:\n${questionText.trim()}\n\n`;
  });

  return formattedQuestions;
}

// Function to open new window with questions
function openQuestionsInNewWindow() {
  const questions = extractQuestions();
  const newWindow = window.open('', '_blank');
  newWindow.document.write(`<pre>${questions}</pre>`);
  newWindow.document.close();
}

// Call the function to open new window
openQuestionsInNewWindow();
