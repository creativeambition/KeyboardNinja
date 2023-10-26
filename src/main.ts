const SampleContainer: HTMLDivElement = document.querySelector(".sample-text")!;

const inputField: HTMLTextAreaElement = document.querySelector("textarea")!;

async function fetchText() {
  SampleContainer.innerHTML = `
    <div class="loading">
      <div class="loader"></div>
      <span>please wait...</span>
    </div>`;

  inputField.readOnly = true;

  try {
    const res = await fetch(
      "https://api.api-ninjas.com/v1/loremipsum?start_with_lorem_ipsum=false&max_length=1000",
      {
        headers: {
          "X-Api-Key": "I1XneYCQAgQ8RZlgTyQy/A==JVJRclkqDr2W1NfB",
        },
      }
    );

    const data = await res.json();
    return data.text;
  } catch (err) {
    SampleContainer.innerHTML = `
    <div class="error">
      <img src="./src/assets/error.svg" alt="" />
      <span>something went wrong; try again later</span>
    </div>`;
  }
}

async function setup() {
  const text = await fetchText();

  let startTime: number;
  let endTime: number;

  let errors = 0;
  let points = 0;

  if (text) {
    SampleContainer.innerHTML = `
      <h4>${text}</h4>
    `;

    inputField.readOnly = false;

    const sample: HTMLHeadingElement =
      document.querySelector(".sample-text h4")!;

    const sampleTextArr = Array.from(sample.innerText);
    const sampleWordsArr = sample.innerText.split(" ");

    sample.innerHTML = sampleTextArr
      .map((char) => `<span>${char}</span>`)
      .join("");

    inputField.maxLength = sampleTextArr.length;

    const chars: NodeListOf<HTMLSpanElement> =
      document.querySelectorAll("h4 span")!;

    inputField.addEventListener("input", validate);

    function typeComplete() {
      endTime = Date.now();

      let TypingSpeed = document.getElementById("typing-speed")!;

      let TimeSpent = document.getElementById("time-spent")!;
      let ErrorCount = document.getElementById("error-count")!;
      let PointsGained = document.getElementById("points")!;

      setTimeout(() => {
        document.body.classList.add("active");
      }, 500);

      inputField.readOnly = true;

      let inputWordsArr = inputField.value.split(" ");

      for (let k = 0; k < inputWordsArr.length; k++) {
        if (inputWordsArr[k] == sampleWordsArr[k]) {
          points += 1;
        }
      }

      let charsTyped = inputField.value.length;

      let elapsedTimeInSec = (endTime - startTime) / 1000;

      let typingSpeedWPM = charsTyped / 5 / (elapsedTimeInSec / 60);

      TimeSpent.innerHTML = `${Math.floor(elapsedTimeInSec)}`;

      TypingSpeed.innerHTML = `${Math.floor(typingSpeedWPM)}`;

      PointsGained.innerHTML = `${points} / ${sampleWordsArr.length}`;

      ErrorCount.innerHTML = `${errors}`;
    }

    function validate() {
      if (!startTime) {
        startTime = Date.now();
      }

      let inputTextArr = Array.from(inputField.value);

      if (inputTextArr.length == sampleTextArr.length) {
        typeComplete();
      }

      errors = 0;

      for (let i = 0; i < sampleTextArr.length; i++) {
        if (inputTextArr[i] == sampleTextArr[i]) {
          chars[i].classList.add("correct");
        } else {
          chars[i].classList.add("incorrect");
          errors++;
        }
      }

      for (let j = inputTextArr.length; j < sampleTextArr.length; j++) {
        chars[j].classList.remove("correct");
        chars[j].classList.remove("incorrect");
      }
    }
  }
}

setup();

function next() {
  location.reload();
}
