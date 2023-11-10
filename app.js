const originalText = document.querySelector(".translator__text-input_original");
const translatedText = document.querySelector(".translator__text-input_translated");
const selectTag = document.querySelectorAll(".translator__countries-select");
const exchangeBtn = document.querySelector(".translator__exchange-btn");
const translateBtn = document.querySelector(".translator__translate-btn");
const buttons = document.querySelectorAll(".translator__button");

const countries = {
  "uk-UA": "Ukrainian",
  "en-US": "English",
  "pl-PL": "Polish",
  "de-DE": "German",
};

selectTag.forEach((tag, id) => {
  for (const countryCode in countries) {
    let selected = "";
    if (id === 0 && countryCode === "uk-UA") {
      selected = "selected";
    } else if (id === 1 && countryCode === "en-US") {
      selected = "selected";
    }
    let option = `<option value="${countryCode}" ${selected}>${countries[countryCode]}</option>`;
    tag.insertAdjacentHTML("beforeend", option); // adding options tag inside select tag
  }
});

exchangeBtn.addEventListener("click", () => {
  // exchange textarea and select values
  const tempText = originalText.value;
  const tempLang = selectTag[0].value;
  originalText.value = translatedText.value;
  selectTag[0].value = selectTag[1].value;
  translatedText.value = tempText;
  selectTag[1].value = tempLang;
});

const handleTranslator = () => {
  let text = originalText.value;
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;
  if (!text) return;
  translatedText.setAttribute("placeholder", "Translating ...");

  const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

  // fetching api response and returning it with parsinf into js obj
  // and in another then method receiving that obj
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      translatedText.value = data.responseData.translatedText;
      translatedText.setAttribute("placeholder", "Translation");
    });
};

// "Translate Text" button
translateBtn.addEventListener("click", handleTranslator);

buttons.forEach((btn) => {
  btn.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      if (btn.classList.contains("original")) {
        // writeText() property writes text to the system clipboard
        navigator.clipboard.writeText(originalText.value);
      } else {
        navigator.clipboard.writeText(translatedText.value);
      }
    } else {
      let utterance;
      if (btn.classList.contains("original")) {
        // SpeechSynthesisUtterance represents a speech request
        utterance = new SpeechSynthesisUtterance(originalText.value);
        // lang property get and set the language of the speech
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(translatedText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});

// Enter and Shift+Enter keys combination
originalText.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && window.innerWidth > 800) {
    event.preventDefault();
    handleTranslator();
  }
});