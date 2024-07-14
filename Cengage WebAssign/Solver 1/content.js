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

    formattedQuestions += `Question ${index + 1}:\n${questionText.trim()}\n\n`;
  });

  return formattedQuestions;
}

// Extract questions and copy them to the clipboard
const questions = extractQuestions();
navigator.clipboard.writeText(questions).then(() => {
  alert('Questions copied to clipboard!');
}).catch(err => {
  console.error('Failed to copy questions: ', err);
});
