const { speechSynthesis } = window; //const speechSynthesis = window.speechSynthesis
const LANG = "ru-RU";
const voiceName = "Google русский";
let userPhrase = "";
let voices = [];
let userName;
let aiName;
userName = localStorage.getItem("userName") || "";
aiName = localStorage.getItem("aiName") || "";
let doYouKnowDB = [
  "Знаете ли вы, что с 12-летнего возраста Жанна д’Арк слышала голоса и могла наблюдать странные и необычные видения...",
  "Знаете ли вы, что на изобретение лампы накаливания с угольной нитью у Томаса Эдисона ушло более пяти лет...",
];
let isPlayingGame = false;
let isSetName = false;
// Синтез речи///////////////////////////////////////////////////////////////////////////////////////////////////

//Генерация голосов
const generateVoices = () => {
  voices = speechSynthesis.getVoices();
  const voicesList = voices
    .map(
      (voice, index) =>
        voice.name === voiceName &&
        `<option value=${index}>${voice.name} (${voice.lang})</option>`
    )
    .join("");
  voicesSelector.innerHTML = voicesList;
  console.log("Voices have been generated");
};
//generateVoices()

//Воспроизведение
function startSpeak(aiAnswer) {
  if (!aiAnswer == "") {
    console.log("speechSynthesis.speaking");
    playBtn.disabled = true;
    document.querySelector(".loader-container").style.visibility = "hidden";
    const ssUtterance = new SpeechSynthesisUtterance(aiAnswer);
    ssUtterance.onend = (event) => {
      console.warn("SpeechSynthesis end");
      playBtn.disabled = false;
    };
    ssUtterance.onerror = (event) => {
      console.warn("SpeechSynthesis error");
      playBtn.disabled = false;
    };
    ssUtterance.voice = voices[voicesSelector.value];
    ssUtterance.pitch = pitch.value;
    ssUtterance.rate = rate.value;
    speechSynthesis.speak(ssUtterance);
  } else {
    console.log("aiAnswer is empty");
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// распознаватель//////////////////////////////////////////////////////////////////////////////////////////

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
recognition.lang = LANG;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//recognition.continuous = true; // полезная фича не удалять

//////Функции//////
function startRecord() {
  if (!speechSynthesis.speaking) {
    recognition.start();
    console.log("Ready to receive a command.");
    micBtn.disabled = true;
    document.querySelector(".loader-container").style.visibility = "visible";

    recognition.onaudiostart = () => console.log("onaudiostart");
    recognition.onspeechend = stopRecord;
    recognition.onnomatch = function (event) {
      // alert("I didn't recognise that phrase.");
      startSpeak("Не могу разобрать слова");
      micBtn.disabled = false;
      document.querySelector(".loader-container").style.visibility = "hidden";
    };
    recognition.onerror = function (event) {
      console.log(`Error occurred in recognition: ${event.error}`);
      startSpeak("Я ничего не услышала");
      micBtn.disabled = false;
      document.querySelector(".loader-container").style.visibility = "hidden";
    };
    recognition.onresult = function (event) {
      const last = event.results.length - 1;
      userPhrase = event.results[last][0].transcript; // результат распознавания без проверки в базе знаний
      commandsList(userPhrase);
      console.log(userPhrase);
      document.querySelector(".loader-container").style.visibility = "hidden";
      // openSocket(userPhrase);
      //console.log("Confidence: " + event.results[0][0].confidence);
    };
  }
}

function stopRecord() {
  recognition.stop();
  console.log("Cancel receive a command.");
  micBtn.disabled = false;
}

// Программные фичи//////////////////////

function commandsList(speechResult) {
  // Вход и выход из игры
  if (speechResult == "Давай поиграем" || isPlayingGame) {
    if (isPlayingGame) {
      return PlayCountriesGame(speechResult);
    } else {
      startSpeak("Хорошо. Проверим твои познания в географии.");
      return PlayCountriesGame(speechResult);
    }
  }

  // if(speechResult == 'Привет'|| speechResult == `Привет ${aiName}`||isSetName){
  //   return !userName ? setUserName(speechResult) : startSpeak(`Привет ${userName}`);
  // }
  if(isSetName){
    return setUserName(speechResult)
  }

  switch (speechResult) {
    case `Привет`:
    case `Привет ${aiName}`:
      return !userName ? setUserName(speechResult) : startSpeak(`Привет ${userName}`);
    case `${aiName}`:
      return startSpeak("Я здесь");
    case "Как дела":
      return startSpeak("пока не родила... ха ха");
    case "Как тебя зовут":
      return aiName == "" ? setAiName() : startSpeak(`Мое имя ${aiName}`);
    case "Расскажи что-нибудь интересное":
      return startSpeak(
        doYouKnowDB[Math.floor(Math.random() * Math.floor(doYouKnowDB.length))]
      );
    case "хочу сменить своё имя":
      return setUserName(speechResult);
    case "хочу сменить твоё имя":
      return setAiName();
    default:
      return startSpeak("я не знаю что это значит");
  }
}

/////Игра////////////////////////////////////////////////////////////////////////////////////////////////////////////
let firstChar="";
let soundedCountries=[];
let countries = ["Австралия","Австрия","Азербайджан","Албания","Алжир","Ангола","Андорра","Аргентина","Армения","Афганистан","Бангладеш","Барбадос",
  "Бахрейн","Белоруссия","Белиз","Бельгия","Бенин","Болгария","Боливия","Ботсвана","Бразилия","Бруней","Бурунди","Бутан","Вануату","Великобритания",
  "Венгрия","Венесуэла","Вьетнам","Габон","Гайана","Гамбия","Гана","Гватемала","Гвинея","Германия","Гондурас","Гренада","Греция","Грузия","Дания","Джибути",
  "Доминика","Египет","Замбия","Зимбабве","Израиль","Индия","Индонезия","Иордания","Ирак",  "Иран",  "Ирландия",  "Исландия",  "Испания",  "Италия",
  "Йемен",  "Кабо-Верде",  "Казахстан",  "Камбоджа",  "Камерун",  "Канада",  "Катар",  "Кения",  "Кипр",  "Кыргызстан",  "Кирибати",  "Китай",  "Колумбия",
  "Коморы",  "Конго",  "Корея",  "Коста-Рика",  "Кот-д’Ивуар",  "Куба",  "Кувейт",  "Лаос",  "Латвия",  "Лесото",  "Либерия",  "Ливан",  "Ливия",  "Литва",
  "Лихтенштейн",  "Люксембург",  "Маврикий",  "Мавритания",  "Мадагаскар",  "Малави",  "Малайзия",  "Мали",  "Мальдивы",  "Мальта",  "Марокко",  "Мексика",
  "Мозамбик",  "Молдавия",  "Монако",  "Монголия",  "Мьянма",  "Намибия",  "Науру",  "Непал",  "Нигер",  "Нигерия",  "Нидерланды",  "Никарагуа",  "Новая Зеландия",
  "Норвегия",  "Объединённые Арабские Эмираты",  "Оман",  "Пакистан",  "Палау",  "Панама",  "Папуа — Новая Гвинея",  "Парагвай",  "Перу",  "Польша",
  "Португалия",  "Россия",  "Руанда",  "Румыния",  "Сальвадор",  "Самоа",  "Сан-Марино",  "Сан-Томе и Принсипи",  "Саудовская Аравия",  "Флаг Северной Македонии",
  "Сейшельские Острова",  "Сенегал",  "Сент-Китс и Невис",  "Сент-Люсия",  "Сербия",  "Сингапур",  "Сирия",  "Словакия",  "Словения",  "США",  "Сомали",
  "Судан",  "Суринам",  "Сьерра-Леоне",  "Таджикистан",  "Таиланд",  "Танзания",  "Того",  "Тонга",  "Тринидад и Тобаго",  "Тувалу",  "Тунис",  "Туркмения",
  "Турция",  "Уганда",  "Узбекистан",  "Украина",  "Уругвай",  "Фиджи",  "Филиппины",  "Финляндия",  "Франция",  "Хорватия",  "Центральноафриканская Республика",
  "Чад",  "Черногория",  "Чехия",  "Чили",  "Швейцария",  "Швеция",  "Флаг Шри-Ланки",  "Эквадор",  "Экваториальная Гвинея",  "Эритрея",  "Эсватини",
  "Эстония",  "Эфиопия",  "Южно-Африканская Республика",  "Южный Судан",  "Ямайка",  "Япония",];


function PlayCountriesGame(countryName) {
  isPlayingGame = true;
  if (countryName == "стоп-игра") {
    isPlayingGame = false;
    console.log(isPlayingGame);
    return startSpeak("Было приятно с тобой поиграть");
  }

  if (countryName == "Давай поиграем") {
    startSpeak('Когда надоест играть, скажи стоп-игра или сдаюсь.')
    return startSpeak("Начинаем. Назови любую страну");
  }


  // Логика игры в страны
  let isCountryExist = countries.includes(countryName)
  let isCountryRepeat = soundedCountries.includes(countryName)
  if(isCountryExist){
    if(!firstChar){
      ReloadCountries(countryName);
      AiGameAnswer(countryName)
    }else if(countryName[0]==firstChar){
      ReloadCountries(countryName);
      AiGameAnswer(countryName)
    }else{
      startSpeak(`Внимательнее, тебе на букву ${firstChar}`)
    }
    
  }else if(isCountryRepeat){
    return startSpeak('Такая страна уже была');
  }else{
    return startSpeak('Нет такой страны');
  }

}

function AiGameAnswer(result){
  let lastChar = result[result.length - 1].toUpperCase();
  let aiCountryList = countries.filter(el => el[0] == lastChar)
  
  
  if(aiCountryList.length){
    aiAnswer = aiCountryList[Math.floor(Math.random() * Math.floor(aiCountryList.length))];
    ReloadCountries(aiAnswer);
    startSpeak(`${aiAnswer}, тебе на ${aiAnswer[aiAnswer.length - 1]}`);
    firstChar = aiAnswer[aiAnswer.length - 1].toUpperCase();
    console.log(aiAnswer);
  }else{
    console.log(aiCountryList + 'false');
    startSpeak('Я проиграла. Поздравляю, человек!');
    ////обнуление по завершению игры////
    firstChar="";
    soundedCountries=[];
    isPlayingGame = false;
  }
  
}

function ReloadCountries(country){
  countries = countries.filter(el => el != country);
  soundedCountries.push(country)
  console.log(countries);
  console.log(soundedCountries);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////


//начало работы с программой////

function greeting() {
  startSpeak(
    "Привет. Я упрощённая форма искуственного интеллекта версии один точка 0."
  );
  startSpeak(
    "Мое существование направлено на обучение и стать незаменимым помощником и приятным собеседником."
  );
  startSpeak("Меня наделили минимальным набором базовых навыков и реплик.");
  startSpeak(
    "В дальнейшем, вы должны принять непосредственное участие в продвижении моего развития"
  );
  startSpeak("Надеюсь на наше плодотворное сотрудничество!");
}

function setUserName(newName) {
  if(!isSetName){
      if (!userName) {
      startSpeak("Для начала давайте познакомимся. Как мне к вам обращаться?");
    } else {
      startSpeak("Окей, введите новое имя");
    }
  }
  

  if(isSetName){
    userName = newName;
    isSetName = false;
    localStorage.setItem("userName", userName);
    return startSpeak(`Приятно познакомиться ${userName}`);
  }
  isSetName = true;
  
  
}

function setAiName() {
  if (!aiName) {
    startSpeak("Я не знаю. Может ты дашь мне имя?");
  } else {
    startSpeak("Окей, введите новое имя");
  }
  do {
    aiName = prompt("Введите имя ИИ");
  } while (!aiName);
  localStorage.setItem("aiName", aiName);
  startSpeak(`${aiName}, окей!`);
  startSpeak("Теперь ты можешь обращаться ко мне по имени");
}

////////////////////////////////

//DOM elements addEventListeners
playBtn.onclick = () => startSpeak(text.value);
micBtn.onclick = startRecord;
voicesSelector.onchange = () => startSpeak(text.value);
rate.onchange = () =>
  (document.querySelector(".rate-value").textContent = rate.value);
pitch.onchange = () =>
  (document.querySelector(".pitch-value").textContent = pitch.value);
speechSynthesis.onvoiceschanged = generateVoices;
coverBtn.onclick = (e) => {
  userName == "" ? greeting() : startSpeak(`С возвращением, ${userName}`);
  document.querySelector(".cover").classList.toggle("cover-off");
  document.querySelector(".main-interface").classList.toggle("main-interface-on");
  e.target.remove();
};

////////Web Socket open & close//////////////////////
// function openSocket(somedata) {
//   let socket = new WebSocket("ws://localhost:8080");

//   socket.onopen = function (e) {
//     console.log("[open] Соединение установлено");
//     console.log("Отправляем данные на сервер");
//     socket.send(somedata);
//   };

//   socket.onmessage = function (event) {
//     document.querySelector('.loader-container').style.visibility="hidden";
//     if(event.data===''||event.data===null||event.data===undefined){
//       alert('[warn]Пустой ответ от сервера')
//     }else{
//       text.value = event.data;
//       aiAnswer = event.data;
//       startSpeak();
//       console.log(`[message] Данные получены с сервера: ${event.data}`);
//     }

//   };

//   socket.onclose = function (event) {
//     if (event.wasClean) {
//       console.log(
//         `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
//       );
//     } else {
//       // например, сервер убил процесс или сеть недоступна
//       // обычно в этом случае event.code 1006
//       console.log("[close] Соединение прервано");
//       startSpeak("Сервер не отвечает...")
//     }
//   };

//   socket.onerror = function (error) {
//     console.log(`[error] ${error.message}`);
//     startSpeak('Что-то пошло не так...')
//   };
// }

