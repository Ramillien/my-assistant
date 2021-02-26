// Синтез речи///////////////////////////////////////////////////////////////////////////////////////////////////

const { speechSynthesis } = window; //const speechSynthesis = window.speechSynthesis
const LANG = "ru-RU";
const voiceName ="Google русский" 
// let aiAnswer = "Привет. Я упрощённая форма искуственного интелекта версии один точка 0. Мое существование нацелено на обучение и стать незаменимым помощником и приятным собеседником. Меня наделили минимальным набором базовых навыков и реплик.";
let userPhrase = "";
let voices = [];

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
  if (aiAnswer !== "") {
    console.log("speechSynthesis.speaking");
    playBtn.disabled = true;
    document.querySelector('.loader-container').style.visibility="hidden";
    //let aiAnswer = greeting[(Math.floor(Math.random() * greeting.length))];
    const ssUtterance = new SpeechSynthesisUtterance(aiAnswer);
    ssUtterance.onend = (event) => {
      console.warn("SpeechSynthesis end");
      playBtn.disabled = false;
    };
    ssUtterance.onerror = (event) => {
      console.warn("SpeechSynthesis error");
      playBtn.disabled = true;
    };
    ssUtterance.voice = voices[voicesSelector.value];
    ssUtterance.pitch = pitch.value;
    ssUtterance.rate = rate.value;
    speechSynthesis.speak(ssUtterance);
  } else {
    console.log("aiAnswer is empty");
  }
}



//События
playBtn.onclick =  function(){
  // console.log(text.value);
  // aiAnswer=text.value
  startSpeak(text.value);
  
} 
voicesSelector.onchange = ()=>startSpeak(text.value);
rate.onchange = () =>
  (document.querySelector(".rate-value").textContent = rate.value);
pitch.onchange = () =>
  (document.querySelector(".pitch-value").textContent = pitch.value);
speechSynthesis.onvoiceschanged = generateVoices;
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

// const commands = {
//   привет: "Привет",
//   какдела: "пока не родила",
//   желтый: "yellow",
//   зеленый: "green",
//   голубой: "blue",
//   синий: "darkblue",
//   фиолетовый: "violet",
// };

// const commandsList = Object.keys(commands);
// console.log(commandsList);

// const commands = {}
// obj['key1'] = new Array();
// obj['key2'] = new Array();

//recognition.continuous = true; // полезная фича не удалять

//////Функции//////
function startRecord() {
  if(!speechSynthesis.speaking){
    recognition.start();
    console.log("Ready to receive a command.");
    micBtn.disabled = true;
    document.querySelector('.loader-container').style.visibility="visible";
  }
}
function stopRecord() {
  recognition.stop();
  console.log("Cancel receive a command.");
  micBtn.disabled = false;
}
// function knowledgeDBsearch(speechResult) {
//   if (speechResult in commands) {
//     return (aiAnswer = commands[speechResult].value);
//   }
//   return null;
// }

////События////////
micBtn.onclick = startRecord;
// microStopBtn.onclick = stopRecord;
recognition.onaudiostart = () => console.log("onaudiostart");
  

recognition.onspeechend = stopRecord;
recognition.onnomatch = function (event) {
  alert("I didn't recognise that phrase.");
  micBtn.disabled = false;
  document.querySelector('.loader-container').style.visibility="hidden";
};
recognition.onerror = function (event) {
  console.log(`Error occurred in recognition: ${event.error}`);
  startSpeak('Я ничего не услышала')
  micBtn.disabled = false;
  document.querySelector('.loader-container').style.visibility="hidden";
};
recognition.onresult = function (event) {
  const last = event.results.length - 1;
  userPhrase = event.results[last][0].transcript; // результат распознавания без проверки в базе знаний
  startSpeak(knowledgeDBsearch(userPhrase))
  console.log(userPhrase);
  // openSocket(userPhrase);
  //console.log("Confidence: " + event.results[0][0].confidence);
};










// Программные фичи//////////////////////
function knowledgeDBsearch(speechResult) {
  switch (speechResult.toLowerCase()){
    case'привет': 
      return 'Привет'
    case'как дела': 
      return 'пока не родила... ха ха'
    case'как тебя зовут': 
      return 'у меня нет имени'
    case'расскажи что-нибудь интересное': 
      return dailyTipsDB[Math.floor(Math.random() * Math.floor(dailyTipsDB.length))]
    default :
    return 'я не знаю что это значит'
  }
}

//начало работы с программой////
coverBtn.onclick = e =>{
  document.querySelector(".cover").classList.toggle("cover-off");
  document.querySelector(".main-interface").classList.toggle("main-interface-on");
  startSpeak("Привет. Я упрощённая форма искуственного интеллекта версии один точка 0.");
  startSpeak("Мое существование направлено на обучение и стать незаменимым помощником и приятным собеседником.")
  startSpeak("Меня наделили минимальным набором базовых навыков и реплик.")
  startSpeak("В дальнейшем, вы должны принять непосредственное участие в продвижении моего развития")
  e.target.remove()
}
////////////////////////////////
let dailyTipsDB = ['Знаете ли вы, что с 12-летнего возраста Жанна д’Арк слышала голоса и могла наблюдать странные и необычные видения...','Знаете ли вы, что на изобретение лампы накаливания с угольной нитью у Томаса Эдисона ушло более пяти лет...']

// let dayTips = setInterval(DailyTips,10000)
// activDayTips.onchange = ()=>{
//   if(activDayTips.checked){
//     dayTips
//     console.log('on');
//   }else{
//     clearInterval(dayTips)
//     console.log('off');
//   }
// }


// function DailyTips(){
//   aiAnswer = dailyTipsDB[Math.floor(Math.random() * Math.floor(dailyTipsDB.length))]
//   startSpeak()
  
// }





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




 


    
     
  

