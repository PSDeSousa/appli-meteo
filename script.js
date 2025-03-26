//Général
let donnees = [];//tableau miroir du JSON
const url = "https://api.open-meteo.com/v1/forecast?latitude=45.4339&longitude=4.39&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,precipitation&current=temperature_2m,is_day,weather_code,wind_direction_10m,wind_speed_10m&timezone=Europe%2FBerlin";
const wTab = [
    {id : "0", temps : "Ciel dégagé"},
{id : "1", temps : "Principalement clair"},
{id : "2", temps : "Partiellement nuageux"},
{id : "3", temps : "Couvert"},
{id : "45", temps : "Brouillard"},
{id : "48", temps : "Dépôts de brouillard givrant"},
{id : "51", temps : "Bruine légère"},
{id : "53", temps : "Bruine modérée"},
{id : "55", temps : "Bruine dense"},
{id : "56", temps : "Bruine verglaçante légère"},
{id : "57", temps : "Bruine verglaçante dense"},
{id : "61", temps : "Pluie faible"},
{id : "63", temps : "Pluie modérée"},
{id : "65", temps : "Pluie forte"},
{id : "66", temps : "Pluie verglaçante légère"},
{id : "67", temps : "Pluie verglaçante forte"},
{id : "71", temps : "Chute de neige faible"},
{id : "73", temps : "Chute de neige modérée"},
{id : "75", temps : "Chute de neige intense"},
{id : "77", temps : "Grains de neige"},
{id : "80", temps : "Averses de pluie faibles"},
{id : "81", temps : "Averses de pluie modérées"},
{id : "82", temps : "Averses de pluie violentes"},
{id : "85", temps : "Averses de neige faibles"},
{id : "86", temps : "Averses de neige fortes"},
{id : "95", temps : "Orage"},
{id : "96", temps : "Orage avec grêle légère"},
{id : "99", temps : "Orage avec forte grêle"}
];


//Current

let cDate = document.getElementById('cDate');
let cNightDay = document.getElementById('cNightDay');
let cWeather = document.getElementById('cWeather');
let cTemperature = document.getElementById('cTemperature');
let cWindDirection = document.getElementById('cWindDirection');
let cWindSpeed = document.getElementById('cWindSpeed');
let cWindArrow = document.getElementById('cWindArrow');
//image en background
let hero = document.querySelector('.hero');
//Heures
let hCard = document.getElementById('hCard');
let hBack = document.getElementById('backHour');
let hForward = document.getElementById('forwardHour');
//variables d'affichage du carousel heures
let d = 0;
let f = 0;
//Jours
let dCard = document.getElementById('dCard');
let dBack = document.getElementById('backDay');
let dForward = document.getElementById('forwardDay');
//variables d'affichage du carousel jours
let dD = 0;
let fD = 0;
//Mobile : identifier les carousel jour et heur
let perHour = document.querySelector(".hours");
let perDay = document.querySelector(".days");
let buttonHour = document.getElementById('buttonHour');
let buttonDay = document.getElementById('buttonDay');
let nbAffichDay = 5;
let nbAffichHour = 7;
if (window.matchMedia('(max-width: 1090px)').matches) {
    nbAffichDay = 2;
    nbAffichHour = 4;
  }else{
    nbAffichDay = 5;
    nbAffichHour = 7;
  }

window.addEventListener('resize', function(){
    tailleEcran();
})


function tailleEcran(){
    if (window.matchMedia('(max-width: 1090px)').matches) {
        nbAffichDay = 2;
        nbAffichHour = 4;
      }else{
        nbAffichDay = 5;
        nbAffichHour = 7;
      }
      hCard.innerHTML = "";
      afficherCarousselHour();
      dCard.innerHTML = "";
      afficherCarousselDay();
}


fetch(url)
  .then(function(reponse) {
    return reponse.json();
  })
  .then(function(data) {
    donnees = data;

    afficherCurrent();
    afficherCarousselHour();
    afficherCarousselDay();

  })
  .catch(function(error) {
    console.error("Erreur lors du chargement du fichier JSON :", error);
  });

  //Affichage Temps actuel

  function afficherCurrent() {
    let current = donnees.current;
    // Création d’un objet Date
    let frDate = new Date(current.time);
    // Extraction des composants
    let cDay = String(frDate.getDate()).padStart(2, '0');
    let cMonth = String(frDate.getMonth() + 1).padStart(2, '0'); // Janvier = 0
    let cYear = frDate.getFullYear();
    let cHours = String(frDate.getHours()).padStart(2, '0');
    let cMinutes = String(frDate.getMinutes()).padStart(2, '0');

    let contenuDate = "<p class='b-text'>" + cDay + "/" + cMonth + "/" + cYear + "</p>";
    contenuDate += "<p>" + cHours + "h" + cMinutes + "</p>";
    cDate.innerHTML = contenuDate;
    cTemperature.innerText = Math.round(current.temperature_2m) + donnees.current_units.temperature_2m;
    cWindSpeed.innerText = Math.round(current.wind_speed_10m) + donnees.current_units.wind_speed_10m;
    cWindArrow.style.transform = "rotate(" + current.wind_direction_10m + "deg)";
    console.log("direction du vent : " + current.wind_direction_10m + "°");
    //si jour : image jour, sinon image nuit
    if(current.is_day){
        cNightDay.innerHTML = "<img src='assets/images/icone/day.png' alt='day'>";
    }else{
        cNightDay.innerHTML = "<img src='assets/images/icone/night.png' alt='night'>";
    }
    //temps qu'il fait
    let wCode = current.weather_code.toString();
    let wMessage = ""
    let i = 0;
    wTab.forEach(function(w){
        if (w.id === wCode){
            wMessage = w.temps;
        }
        i++
    })
    let contenu = "<p>" + wMessage + "</p>";
    contenu += "<img src='assets/images/illustration/" + wCode.charAt(0) + ".png' alt='weather'>";
    cWeather.innerHTML = contenu;
    //chgt background
    if(current.is_day){
        hero.style.backgroundImage = "url('assets/images/background/b-" + wCode + ".jpg')";
    }else{
        hero.style.backgroundImage = "url('assets/images/background/night.jpg')";
    }
  }

  //Fonction affichage des cards heures

  function afficherHour(deb, fin) {
    for (i = deb ; i <= fin; i++){
        let wHourTime = donnees.hourly.time[i];
        let wHourTemperature = Math.round(donnees.hourly.temperature_2m[i]);
        let wHourPrecipitation = Math.round(donnees.hourly.precipitation[i]);
        let wUnitTemperature = donnees.hourly_units.temperature_2m;
        let wUnitPrecipitation = donnees.hourly_units.precipitation;

        // Création d’un objet Date
        let hDate = new Date(wHourTime);
        // Extraction des composants
        let hHours = String(hDate.getHours()).padStart(2, '0');
        let hMinutes = String(hDate.getMinutes()).padStart(2, '0');

        let div = document.createElement('div');
        div.classList.add("card-hour");

        let contenu = "<div class='grid-row'>";
        contenu += "<img src='assets/images/icone/thermometer.png' alt='temperature'>";
        contenu += "<p class='xs-text'>" + wHourTemperature + " " + wUnitTemperature + "</p>";
        contenu += "</div>";
        contenu += "<div class='grid-row'>";
        contenu += "<img src='assets/images/icone/umbrella.png' alt='précipitations'>";
        contenu += "<p class='xs-text'>" + wHourPrecipitation + " " + wUnitPrecipitation + "</p>";
        contenu += "</div>";
        contenu += "<p class='s-text'>" + hHours + "h" + hMinutes + "</p>";
        contenu += "</div>";


        //rempli une nouvelle div avec le contenu
        div.innerHTML = contenu;
        hCard.appendChild(div);
    }
}


// function affichage par défaut des cards heures

  function afficherCarousselHour(){
    
    let date = new Date();
    d = date.getUTCHours()+1;
    f = d + nbAffichHour;
    afficherHour(d, f) ;

  }

//Boutons carousel heures
hBack.addEventListener("click", function(){
    
    if (d > 0){
        d = d - 1;
        f = f - 1;
        hCard.innerHTML = "";
        afficherHour(d, f);
    }
})

hForward.addEventListener("click", function(){
    
    if (f < donnees.hourly.time.length){
        d = d + 1;
        f = f + 1;
        hCard.innerHTML = "";
        afficherHour(d, f);
    }
})


  //Fonction affichage des cards jours

  function afficherDay(deb, fin) {
    for (i = deb ; i <= fin; i++){
        let wDayTime = donnees.daily.time[i];
        let wDayTemperatureMax = Math.round(donnees.daily.temperature_2m_max[i]);
        let wDayTemperatureMin = Math.round(donnees.daily.temperature_2m_min[i]);
        let wDayCode = donnees.daily.weather_code[i].toString();
        let wUnitTemperature = donnees.daily_units.temperature_2m_max;
        // Création d’un objet Date
        let frDate = new Date(wDayTime);
        // Extraction des composants
        let dDay = String(frDate.getDate()).padStart(2, '0');
        let dMonth = String(frDate.getMonth() + 1).padStart(2, '0'); // Janvier = 0
        let dYear = frDate.getFullYear();

        let div = document.createElement('div');
        div.classList.add("card-day");

        let contenu = "<div class='card-day'>";
        contenu += "<p class='m-text'>" + dDay + "/" + dMonth + "<span class='m-d-no'>/" + dYear + "</span></p>";
        contenu += "<img src='assets/images/icone/i-" + wDayCode.charAt(0) + ".png' alt='weather'>";
        contenu += "<p>" + wDayTemperatureMax + " " + wUnitTemperature + "</p>";
        contenu += "<p class='xs-text'>" + wDayTemperatureMin + " " + wUnitTemperature + "</p>";
        contenu += "</div>";

        //rempli une nouvelle div avec le contenu
        div.innerHTML = contenu;
        dCard.appendChild(div);
    }
  }

// function affichage par défaut des cards heures

  function afficherCarousselDay(){
    
    dD = 0;
    fD = dD + nbAffichDay;
    afficherDay(dD, fD) ;

  }
//Boutons carousel heures
dBack.addEventListener("click", function(){
    if (dD > 0){
        dD = dD - 1;
        fD = fD - 1;
        dCard.innerHTML = "";
        afficherDay(dD, fD);
    }
})

dForward.addEventListener("click", function(){
    if (fD < donnees.daily.time.length-1){
        dD = dD + 1;
        fD = fD + 1;
        dCard.innerHTML = "";
        afficherDay(dD, fD);
    }
})

//fonction afficher carousel heure ou jour
function show(mode){
    let per1 = "";
    let per2 = "";
    if(mode === perDay){
        per1 = perDay;
        per2 = perHour;
        b1 = buttonDay;
        b2 = buttonHour;
    }else{
        per2 = perDay;
        per1 = perHour;
        b2 = buttonDay;
        b1 = buttonHour;
    } 
    if(per1.classList.contains("m-d-no")){
        per1.classList.remove("m-d-no")
        };
    if(per2.classList.contains("m-d-none")){
        }else{
            per2.classList.add("m-d-no")
        };
    if(b1.classList.contains("primary-button")){
        }else{
            b1.classList.remove("secondary-button");
            b1.classList.add("primary-button")
        };
    if(b2.classList.contains("primary-button")){
            b2.classList.remove("primary-button");
            b2.classList.add("secondary-button")
        }else{
        };
    }
   

