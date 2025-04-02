const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");
menuOpenButton.addEventListener("click",()=>{
    document.body.classList.toggle("show-mobile-menu");
});
menuCloseButton.addEventListener("click",()=>
    menuOpenButton.click());



const wrapper = document.querySelector(".wrapper"),
      searchInput = wrapper.querySelector("input"),
      synonymsContainer = wrapper.querySelector(".synonyms"),
      synonymsList = wrapper.querySelector(".synonyms .list"),
      infoText = wrapper.querySelector(".info-text"),
      volumeIcon = wrapper.querySelector(".word i");

let audio = null;

function data(result, word) {
    if (result.title) {
        infoText.innerHTML= "Word not found.";
        infoText.style.color= "red";
        return;
    }
    console.log(result);
    wrapper.classList.add("active");

    let meanings = result[0].meanings[0],
        definitions = meanings.definitions[0],
        phoneticsList = result[0].phonetics,
        phoneticText = phoneticsList.length > 0 ? `/${phoneticsList[0].text}/` : "";

    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = meanings.partOfSpeech + " " + phoneticText;
    document.querySelector(".meaning span").innerText = definitions.definition || "No definition available.";
    document.querySelector(".example span").innerText = definitions.example || "No example available.";

   
    audio = null; 
    for (let i = 0; i < phoneticsList.length; i++) {
        if (phoneticsList[i].audio && phoneticsList[i].audio.startsWith("https")) {
            audio = new Audio(phoneticsList[i].audio);
            break;
        }
    }
    let synonymList = [];
    result[0].meanings.forEach(meaning => {
        if (meaning.synonyms && meaning.synonyms.length > 0 ) {
            synonymList = synonymList.concat(meaning.synonyms);
        }
    });
    synonymList = [...new Set(synonymList)].slice(0, 5);
    if (synonymList.length > 0) {
        synonymsContainer.style.display = "block";
        synonymsList.innerHTML = "";
        synonymList.forEach((synonym, index) => {
            let tag = `<span onclick="fetchApi('${synonym}')" style="cursor:pointer; color:red;">${synonym}</span>`;
            synonymsList.insertAdjacentHTML("beforeend", tag + (index < synonymList.length - 1 ? ", " : ""));
        });
    }
      else {
        synonymsContainer.style.display = "none";
    }
}

function fetchApi(word) {
    infoText.style.color = "red";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(res => res.json())
        .then(result => data(result, word))
        .catch(() => {
            infoText.innerHTML = "An error occurred. Please try again.";
        });
        let searchWord = word || searchInput.value.trim();
        if (!searchWord) return;

        storeSearchHistory(searchWord);
}

searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

volumeIcon.addEventListener("click", () => {
    if (audio) {
        audio.play();
    } else {
        alert("No valid pronunciation available.");
    }
});


const toggleBtn = document.querySelector(".toggle-btn");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.innerText = "☀️";
}


toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
         body.style.background = "linear-gradient(to right,rgb(125, 81, 112),rgb(70, 14, 71))";
        document.querySelector(".history-container").style.background="black";
       
        toggleBtn.innerText = "☀️";
    } else {
        localStorage.setItem("theme", "light");
         body.style.background = "linear-gradient(to right, #b3bcfa, #3a3df7)";
        document.querySelector(".history-container").style.background="white";
       
        toggleBtn.innerText = "🌙 ";
    }
});


const searchHistoryContainer = document.getElementById("searchHistory");
const clearHistoryBtn = document.getElementById("clearHistory");

function storeSearchHistory(word) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    history = history.filter(item => item !== word);
    history.unshift(word);
    history = history.slice(0, 5);

    localStorage.setItem("searchHistory", JSON.stringify(history));
    displaySearchHistory();
}
function displaySearchHistory() {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistoryContainer.innerHTML = "";

    if (history.length > 0) {
        history.forEach(word => {
            let historyItem = document.createElement("span");
            historyItem.innerText = word;
            historyItem.onclick = () => fetchApi(word);
            searchHistoryContainer.appendChild(historyItem);
        });
    }
}
clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem("searchHistory");
    displaySearchHistory();
});
displaySearchHistory();


function addSearchTerm(word) {
    if (!searchHistory.includes(word)) {
        searchHistory.push(word);
        updateSearchHistory();
    }
}
