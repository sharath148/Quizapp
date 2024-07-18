let quizData = [
    // Array containing quiz questions, options, and the correct answer
    {
      question: "What is the capital of Japan?",
      options: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
      correct: "Tokyo",
    },
    {
      question: "Which planet is known as the 'Red Planet'?",
      options: ["Mars", "Venus", "Jupiter", "Mercury"],
      correct: "Mars",
    },
    {
      question: "Which is the capital city of Karnataka?",
      options: ["Mangalore", "Hubli", "Bangalore", "Belgum"],
      correct: "Bangalore",
    },
    {
      question: "What is the largest mammal on Earth?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      correct: "Blue Whale",
    },
    {
      question: "Which famous artist painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correct: "Leonardo da Vinci",
    },
    {
      question: "Which playwright wrote the tragedy 'Romeo and Juliet'?",
      options: ["William Shakespeare", "George Bernard Shaw", "Oscar Wilde", "Charles Dickens"],
      correct: "William Shakespeare",
    },
    {
      question: "Who is known as the father of modern physics?",
      options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Niels Bohr"],
      correct: "Albert Einstein",
    },
    {
      question: "Who was the first President of India?",
      options: ["Pandit Jawaharlal Nehru", "Sardar Vallabhai Patel", "Dr Rajendra Prasad", "Dr Sarvapalli Radakrishnan"],
      correct: "Dr Rajendra Prasad",
    },
    {
      question: "Who is the current captain of Indian Cricket team?",
      options: ["Virat Kohli", "Rohit Sharma", "MS Dhoni", "Rishab Pant"],
      correct: "Rohit Sharma",
    },
  ];
  
  // Selects quiz container element from the DOM
  const quizContainer = document.querySelector(".quiz-container");
  // Selects question element within quiz container from the DOM
  const question = document.querySelector(".quiz-container .question");
  // Selects options element within quiz container from the DOM
  const options = document.querySelector(".quiz-container .options");
  // Selects next button element within quiz container from the DOM
  const nextBtn = document.querySelector(".quiz-container .next-btn");
  // Selects quiz result element from the DOM
  const quizResult = document.querySelector(".quiz-result");
  // Selects start button container element from the DOM
  const startBtnContainer = document.querySelector(".start-btn-container");
  // Selects start button element within start button container from the DOM
  const startBtn = document.querySelector(".start-btn-container .start-btn");
  
  let questionNumber = 0; // Initializes the current question number to 0
  let score = 0; // Initializes the user's score to 0
  const MAX_QUESTIONS = 5; // Sets the maximum number of questions to display
  let timerInterval; // Declares a variable to hold the timer interval
  
  // Function to shuffle an array
  const shuffleArray = (array) => {
    return array.slice().sort(() => Math.random() - 0.5);
  };
  
  // Shuffles the quiz data to randomize question order
  quizData = shuffleArray(quizData);
  
  // Function to reset the local storage
  const resetLocalStorage = () => {
    for (i = 0; i < MAX_QUESTIONS; i++) {
      localStorage.removeItem(`userAnswer_${i}`); // Removes each user's answer from local storage
    }
  };
  
  // Resets the local storage
  resetLocalStorage();
  
  // Function to check the user's answer
  const checkAnswer = (e) => {
    let userAnswer = e.target.textContent; // Gets the text content of the clicked option
    if (userAnswer === quizData[questionNumber].correct) {
      score++; // Increments score if the answer is correct
      e.target.classList.add("correct"); // Adds correct class to the selected option
    } else {
      e.target.classList.add("incorrect"); // Adds incorrect class to the selected option
    }
  
    // Stores the user's answer in local storage
    localStorage.setItem(`userAnswer_${questionNumber}`, userAnswer);
  
    // Disables all option buttons
    let allOptions = document.querySelectorAll(".quiz-container .option");
    allOptions.forEach((o) => {
      o.classList.add("disabled");
    });
  };
  
  // Function to create and display a new question
  const createQuestion = () => {
    clearInterval(timerInterval); // Clears the existing timer interval
  
    let secondsLeft = 9; // Initializes the timer to 9 seconds
    const timerDisplay = document.querySelector(".quiz-container .timer");
    timerDisplay.classList.remove("danger"); // Removes the danger class from the timer
  
    timerDisplay.textContent = `Time Left: 10 seconds`; // Sets initial timer display
  
    // Sets a new interval for the timer
    timerInterval = setInterval(() => {
      timerDisplay.textContent = `Time Left: ${secondsLeft.toString().padStart(2, "0")} seconds`;
      secondsLeft--;
  
      if (secondsLeft < 3) {
        timerDisplay.classList.add("danger"); // Adds the danger class if less than 3 seconds left
      }
  
      if (secondsLeft < 0) {
        clearInterval(timerInterval); // Clears the interval when the timer reaches 0
        displayNextQuestion(); // Displays the next question
      }
    }, 1000);
  
    options.innerHTML = ""; // Clears the options container
    question.innerHTML = `<span class='question-number'>${questionNumber + 1}/${MAX_QUESTIONS}</span>${quizData[questionNumber].question}`; // Sets the question text
  
    // Shuffles the options for the current question
    const shuffledOptions = shuffleArray(quizData[questionNumber].options);
  
    // Creates buttons for each option and appends them to the options container
    shuffledOptions.forEach((o) => {
      const option = document.createElement("button");
      option.classList.add("option");
      option.innerHTML = o;
      option.addEventListener("click", (e) => {
        checkAnswer(e);
      });
      options.appendChild(option);
    });
  };
  
  // Function to retake the quiz
  const retakeQuiz = () => {
    questionNumber = 0; // Resets the question number to 0
    score = 0; // Resets the score to 0
    quizData = shuffleArray(quizData); // Shuffles the quiz data again
    resetLocalStorage(); // Resets the local storage
  
    createQuestion(); // Creates a new question
    quizResult.style.display = "none"; // Hides the quiz result
    quizContainer.style.display = "block"; // Displays the quiz container
  };
  
  // Function to display the quiz result
  const displayQuizResult = () => {
    quizResult.style.display = "flex"; // Displays the quiz result
    quizContainer.style.display = "none"; // Hides the quiz container
    quizResult.innerHTML = ""; // Clears the quiz result container
  
    const resultHeading = document.createElement("h2");
    resultHeading.innerHTML = `You have scored ${score} out of ${MAX_QUESTIONS}.`;
    quizResult.appendChild(resultHeading); // Adds the result heading to the result container
  
    // Iterates through each question and displays the user's answer and the correct answer
    for (let i = 0; i < MAX_QUESTIONS; i++) {
      const resultItem = document.createElement("div");
      resultItem.classList.add("question-container");
  
      const userAnswer = localStorage.getItem(`userAnswer_${i}`);
      const correctAnswer = quizData[i].correct;
  
      let answeredCorrectly = userAnswer === correctAnswer;
  
      if (!answeredCorrectly) {
        resultItem.classList.add("incorrect"); // Adds the incorrect class if the answer is wrong
      }
  
      // Sets the content for each result item
      resultItem.innerHTML = `<div class="question">Question ${i + 1}: ${quizData[i].question}</div>
      <div class="user-answer">Your answer: ${userAnswer || "Not Answered"}</div>
      <div class="correct-answer">Correct answer: ${correctAnswer}</div>`;
  
      quizResult.appendChild(resultItem); // Adds the result item to the result container
    }
  
    // Creates the retake button and adds it to the result container
    const retakeBtn = document.createElement("button");
    retakeBtn.classList.add("retake-btn");
    retakeBtn.innerHTML = "Retake Quiz";
    retakeBtn.addEventListener("click", retakeQuiz);
    quizResult.appendChild(retakeBtn);
  };
  
  // Function to display the next question
  const displayNextQuestion = () => {
    if (questionNumber >= MAX_QUESTIONS - 1) {
      displayQuizResult(); // Displays the result if the last question is reached
      return;
    }
  
    questionNumber++; // Increments the question number
    createQuestion(); // Creates a new question
  };
  
  // Adds an event listener to the next button to display the next question
  nextBtn.addEventListener("click", displayNextQuestion);
  
  // Adds an event listener to the start button to start the quiz
  startBtn.addEventListener("click", () => {
    startBtnContainer.style.display = "none"; // Hides the start button container
    quizContainer.style.display = "block"; // Displays the quiz container
    createQuestion(); // Creates the first question
  });
  