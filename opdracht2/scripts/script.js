// ACNH API URL
const baseURL = "https://acnhapi.com/v1a/";
const endPoint = "villagers";
const URL = baseURL + endPoint;



// DOM SELECT
const listCard = document.querySelector('ul'); // De ul waarin de bingokaart gaat
const houseVillager = document.querySelector('section section'); // De ol waarin de villager in het huis gaat
const button = document.querySelector('button'); // Het huisje als de button



// ARRAYS
let house = []; // Array voor villager in het huisje
let bingoCard = []; // Array voor de bingokaart



// RANDOMIZER
// Bron voor dit stukje code: https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html 
function shuffle(values) {
  let index = values.length, 
  randomIndex;
  
  // Als er nog elementen zijn om te randomizen
  while (index != 0) {
    randomIndex = Math.floor(Math.random() * index); // Kies een van de overgebeleven elementen
    index--;

    [values[index], values[randomIndex]] = [values[randomIndex], values[index]]; // En zet het op de plek van het huidige element
  }
  
  return values;
}



// BINGOKAART
// Bron voor dit stukje code: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
// Haal villagers op en randomize ze met de shuffle function in de bingo kaart
function getVillagerCard() {
	getData(URL).then( villagers => {
		randomizedVillagers = shuffle(villagers);
		const allVillagers = randomizedVillagers.slice(0, 390); // Hoeveelheid beschikbare villagers, begint bij 
		
		bingoCard = allVillagers.slice(0, 25); // Lengte van bingokaart
		
		showVillagersCard(); // Toon villagers na randomize
	})
} 

// Bron voor dit stukje code: https://codepen.io/shooft/pen/OJovVev 
// Doe villagers in de bingo kaart
function showVillagersCard() {
	bingoCard.forEach( villager => {
		const villagerCard = 
					`
							<li>
								<input type="checkbox" name="Bingo!">
								<label for="${villager.name["name-USen"]}">
								<img src="${villager.icon_uri}" alt="${villager.name["name-USen"]}"> 
								</label>
							</li>
					`;
		listCard.insertAdjacentHTML('beforeend', villagerCard); // Plaatst het in de UL
	})
}

// Zorgt ervoor dat bij refreshen het bord al klaarstaat
getVillagerCard();



// HUIS
// Haal villagers op en randomize ze met de shuffle function in het huis
function getVillagerHouse() {
	getData(URL).then( villagers => {
		randomizedVillagers = shuffle(villagers);
		const allVillagers = randomizedVillagers.slice(0, 390); // Hoeveelheid beschikbare villagers
		
		house = allVillagers.slice(0, 1); // Lengte van bingokaart
		
		showVillagersHouse(); // Toon villagers na randomize
	})
} 

// Doe een villager in het huis
function showVillagersHouse() {
  house.forEach(villager => {
    const villagerInHouse = 
		`
      <img src="${villager.icon_uri}" alt="${villager.name["name-USen"]}"> 
    `;

		houseVillager.innerHTML = villagerInHouse; // Replaced de section

		// Vergelijkt of de villager in het huisje ook in de bingo kaart zit
    bingoCard.forEach(cardVillager => { 
      if (cardVillager.icon_uri === villager.icon_uri) {
        console.log(`Villager zit in de Bingo Kaart: ${cardVillager.name["name-USen"]}`);
				const success = new Audio("./sounds/acnh-catch.mp3");
				success.play(); // Speelt het geluidje af als dit zo is
      }
    });
  });
}



// FUNCTIES ON CLICK
// Genereert een willekeurige villager in het huis 
button.addEventListener("click", () => {
    getVillagerHouse();
});



// FETCH DATA
async function getData(URL) {
	return (
		fetch(URL)
		.then ( response => response.json() )
		.then ( jsonData => jsonData )
	);
}



// SPEECH API -> testen met Chrome, Firefox support het niet
// Bron voor dit stukje code: https://dev.to/joelbonetr/speech-recognition-with-javascript-59g1 
// Controleert of de browser speech recognition ondersteund
if ('webkitSpeechRecognition' in window) {
  var recognition = new window.webkitSpeechRecognition();

  recognition.lang = 'nl-NL'; // Herkende taal = Nederlands
  recognition.continuous = true; // // Blijft constant luisteren, bingo kan op elk moment gebeuren

  // Begint met luisteren
  recognition.start();

  recognition.onresult = event => {
    const result = event.results[event.results.length - 1][0].transcript;
    console.log(result); // Schrijft in de console wat de gebruiker zegt

    if (result.toLowerCase() === 'bingo') { // Checkt of de gebruiker "bingo" zegt
			const everything = document.querySelector("body") // Selecteert alles in HTML
			
			// Nieuwe body voor als de gebruiker wint
			const win = 
		` 
      <h1>Je hebt gewonnen!</h1> 
			<img src="./images/isabelle-happy.gif" alt="Isabelle die aan het klappen is.">
			<a href="/opdracht2/">Klik hier om opnieuw te spelen</a>
    `; 

		everything.innerHTML = win; // Replaced de section
			}
    }

} else { // Melding als de browser de speech recognition niet ondersteund
  console.error('Speech recognition wordt niet ondersteund binnen deze browser.'); 
	// Door .error in plaats van .log te gebruiken is de melding rood in de console
}