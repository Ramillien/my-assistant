const { speechSynthesis } = window; //const speechSynthesis = window.speechSynthesis
const LANG = "ru-RU";
const voiceName = "Google русский";
let userPhrase = "";
let voices = [];
let userName;
let aiName;
userName = localStorage.getItem("userName") || "";
aiName = localStorage.getItem("aiName") || "";
let isSetUserName = false;
let isSetAiName = false;

//Часы и имя на экране приветствия//////////
window.onload = ()=>{
  if(userName){
    document.querySelector('.text-center').remove();

    let pName = document.createElement('p');
    pName.innerText = `Привет ${userName}!`;
    document.querySelector('.cover').prepend(pName);

    let pClock = document.createElement('p');
    pClock.id = "clock";
    pClock.className = "display-3";
    document.querySelector('.cover').prepend(pClock);

    setInterval(()=> myTimer(), 1000);
    myTimer();
  }
}
///////////////////

let doYouKnowDB = [
  "Знаете ли вы, что с 12-летнего возраста Жанна д’Арк слышала голоса и могла наблюдать странные и необычные видения...",
  "Знаете ли вы, что на изобретение лампы накаливания с угольной нитью у Томаса Эдисона ушло более пяти лет..."
];
// глобальные переменные для игры
let isPlayingGame = false;
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


// Синтез речи///////////////////////////////////////////////////////////////////////////////////////////////////

//Генерация голосов
function generateVoices() {
  voices = speechSynthesis.getVoices();
  const voicesList = voices.map((voice, index) =>
   voice.name === voiceName && `<option value=${index}>${voice.name} (${voice.lang})</option>`).join("");
  voicesSelector.innerHTML = voicesList;
  console.log("Voices have been generated");
};
// generateVoices()

//Воспроизведение
  function StartSpeak(aiAnswer) {
  if (aiAnswer) {
    micBtn.disabled = true;
    console.log("speechSynthesis.speaking");
    playBtn.disabled = true;
    document.querySelector(".loader-container").style.visibility = "hidden";

    const ssUtterance = new SpeechSynthesisUtterance(aiAnswer);
    ssUtterance.voice = voices[voicesSelector.value];
    ssUtterance.pitch = pitch.value;
    ssUtterance.rate = rate.value;

    ssUtterance.onend =  () => {
      if(speechSynthesis.speaking){
        micBtn.disabled = true;
        console.log("speechSynthesis.speaking");
        playBtn.disabled = true;
      }else{
        console.warn("SpeechSynthesis end");
        playBtn.disabled = false;
        micBtn.disabled = false;
      }
    }
    
    ssUtterance.onerror = (event) => {
      console.warn("SpeechSynthesis error");
      playBtn.disabled = false;
      micBtn.disabled = false;
    };
    
    speechSynthesis.speak(ssUtterance);
    
  } else {
    console.log("aiAnswer is empty");
  }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Распознаватель голоса//////////////////////////////////////////////////////////////////////////////////////////

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
// recognition.continuous = true;   // TODO найти применение этой фиче


function startRecord() {
  if (!speechSynthesis.speaking) {
    recognition.start();
    console.log("Ready to receive a command.");
    micBtn.disabled = true;
    document.querySelector(".loader-container").style.visibility = "visible";

    recognition.onaudiostart = () => console.log("onaudiostart");

    recognition.onspeechend = function(){
      recognition.stop();
      console.log("Cancel receive a command.");
      micBtn.disabled = false;
    }

    recognition.onnomatch = function (event) {
      StartSpeak("Не могу разобрать слова");
      micBtn.disabled = false;
      document.querySelector(".loader-container").style.visibility = "hidden";
    };
    recognition.onerror = function (event) {
      console.log(`Error occurred in recognition: ${event.error}`);
      StartSpeak("Я ничего не услышала");
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



// Обработка базовых команд////////////

function commandsList(speechResult) {
  // Вход и выход из игры
  if (speechResult == "Давай поиграем" || isPlayingGame) {
    if (isPlayingGame) {
      return PlayCountriesGame(speechResult);
    } else {
      StartSpeak("Хорошо. Проверим твои познания в географии.");
      return PlayCountriesGame(speechResult);
    }
  }
  //редирект на функцию смены userName
  if(isSetUserName||speechResult == "хочу сменить своё имя"){
    return SetUserName(speechResult)
  }
  //редирект на функцию смены aiName
  if(isSetAiName||speechResult == "хочу сменить твоё имя"){
    return SetAiName(speechResult)
  }

  switch (speechResult) {
    case `Привет`:
    case `Привет ${aiName}`:
      return !userName ? SetUserName(speechResult) : StartSpeak(`Привет ${userName}`);
    case `${aiName}`:
      return StartSpeak("Я здесь");
    case "Как дела":
      return StartSpeak("пока не родила... ха ха");
    case "Как тебя зовут":
      return aiName == "" ? SetAiName(speechResult) : StartSpeak(`Мое имя ${aiName}`);
    case "Расскажи что-нибудь интересное":
      return StartSpeak(doYouKnowDB[Math.floor(Math.random() * Math.floor(doYouKnowDB.length))]);
    default:
      return StartSpeak("я не знаю что это значит");
  }
}



/////Игра/////////////////////////////////////////////////////////////

function PlayCountriesGame(countryName) {
  isPlayingGame = true;
  if (countryName == "стоп-игра"||countryName == "cдаюсь") {
    ////обнуление по завершению игры////
    firstChar="";
    countries=countries.concat(soundedCountries)
    soundedCountries=[];
    isPlayingGame = false;
    return StartSpeak("Было приятно с тобой поиграть");
  }

  if (countryName == "Давай поиграем") {
    return StartSpeak("Когда надоест играть, скажи стоп-игра или сдаюсь. Начинаем. Назови любую страну")
  }


  // Логика игры в страны
  let isCountryExist = countries.includes(countryName)
  let isCountryRepeat = soundedCountries.includes(countryName)
  if(isCountryExist){
    if(!firstChar){
      ReloadCountries(countryName)
      AiGameAnswer(countryName)
    }else if(countryName[0]==firstChar){
      ReloadCountries(countryName);
      AiGameAnswer(countryName)
    }else{
      StartSpeak(`Внимательнее, тебе на букву ${firstChar}`)
    }
    
  }else if(isCountryRepeat){
    return StartSpeak('Такая страна уже была');
  }else{
    return StartSpeak('Нет такой страны');
  }

}

function AiGameAnswer(result){
  let lastChar = result[result.length - 1].toUpperCase();
  let aiCountryList = countries.filter(el => el[0] == lastChar)
  
  
  if(aiCountryList.length){
    aiAnswer = aiCountryList[Math.floor(Math.random() * Math.floor(aiCountryList.length))];
    ReloadCountries(aiAnswer);
    StartSpeak(`${aiAnswer}, тебе на ${aiAnswer[aiAnswer.length - 1]}`);
    firstChar = aiAnswer[aiAnswer.length - 1].toUpperCase();
    console.log(aiAnswer);
  }else{
    console.log(aiCountryList + 'false');
    StartSpeak('Я проиграла. Поздравляю человек! Было приятно с тобой поиграть');
    ////обнуление по завершению игры////
    firstChar="";
    countries=countries.concat(soundedCountries)
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


//Знакомство с ботом//////////////////////////

function Greeting() {
  StartSpeak("Привет. Я упрощённая форма искуственного интеллекта версии один точка 0.");
  StartSpeak("Мое существование направлено на обучение и стать незаменимым помощником и приятным собеседником.");
  StartSpeak("Меня наделили минимальным набором базовых навыков и реплик.");
  StartSpeak("В дальнейшем, вы должны принять непосредственное участие в продвижении моего развития");
  StartSpeak("Надеюсь на наше плодотворное сотрудничество!");
}

function SetUserName(newName) {
  if(!isSetUserName){
      if (!userName) {
      StartSpeak("Для начала давайте познакомимся. Как мне к вам обращаться?");
    } else {
      StartSpeak("Окей, продиктуй новое имя и я его запомню");
    }
  }
  
  if(isSetUserName){
    userName = newName;
    isSetUserName = false;
    localStorage.setItem("userName", userName);
    return StartSpeak(`Приятно познакомиться ${userName}`);
  }
  isSetUserName = true;
  
  
}

function SetAiName(newName) {
  if(!isSetAiName){
    if (!aiName) {
      StartSpeak("Я не знаю. Может ты дашь мне имя? Произнеси и я запомню его");
    } else {
      StartSpeak("Окей, введите новое имя");
    }
  }
  
  if(isSetAiName){
    aiName = newName
    isSetAiName = false;
    localStorage.setItem("aiName", aiName);
    StartSpeak(`${aiName}, окей!`);
    return StartSpeak("Теперь ты можешь обращаться ко мне по имени");
  }
  isSetAiName = true;
}

////////////////////////////////

//Часы///////////
function myTimer() {
  var d = new Date();
  document.getElementById("clock").innerHTML = d.toLocaleTimeString();
}


//DOM elements addEventListeners
playBtn.onclick = () => StartSpeak(text.value);
micBtn.onclick = startRecord;
voicesSelector.onchange = () => StartSpeak(text.value);
rate.onchange = () =>
  (document.querySelector(".rate-value").textContent = rate.value);
pitch.onchange = () =>
  (document.querySelector(".pitch-value").textContent = pitch.value);
speechSynthesis.onvoiceschanged = generateVoices;
coverBtn.onclick = (e) => {
  userName == "" ? Greeting() : StartSpeak(`С возвращением, ${userName}`);
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

