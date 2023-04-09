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

	listCard.addEventListener('click', checkWin);
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
    const villagerInHouse = `
      <img src="${villager.icon_uri}" alt="${villager.name["name-USen"]}"> 
    `;

		// Vergelijkt of de villager in het huisje ook in de bingo kaart zit
    houseVillager.innerHTML = villagerInHouse;
    bingoCard.forEach(cardVillager => { 
      if (cardVillager.icon_uri === villager.icon_uri) {
        console.log(`Villager zit in de Bingo Kaart: ${cardVillager.name["name-USen"]}`);
				const success = new Audio("./sounds/acnh-catch.mp3");
				success.play(); // Speelt het geluidje af als dit zo is
      }
    });
  });
}



// CONTROLEERT OF ER EEN BINGO IS
function checkWin() {
  const checked = document.querySelectorAll('input[type="checkbox"]:checked'); // Selecteert de li elementen die gechecked
  let checkedArray = Array.from(checked); // Maakt een array van de gechecked li elementen
  
  let checkedIndex = checkedArray.map((card) => bingoCard.findIndex((villager) => villager.icon_uri === card.nextElementSibling.firstElementChild.src));
  checkedIndex.sort((a, b) => a - b); // Zorgt voor een index van de li elementen voor de array
  
  let win = false; // Bingo win conditions ingedeeld door middel van de index nummers
  let winConditions = [
    [0, 1, 2, 3, 4], // Vanaf hier horizontale win conditions
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24], 
    [0, 5, 10, 15, 20], // Vanaf hier verticale win conditions
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], // Vanaf hier diagonale win conditions
    [4, 8, 12, 16, 20]
  ];
  
	// Kijkt of de win conditions worden behaald
  for (let condition of winConditions) {
    let count = 0; // Tellen begint bij 0
    for (let index of checkedIndex) {
      if (condition.includes(index)) {
        count++; // Als een villager wordt aangevinkt wordt deze meegeteld
      }
    }
    if (count === 5) { // Als 5 villagers zijn aangevinkt, dan gewonnen
      win = true;
      break; // Breekt de loop van de win = tru
    }
  }
  
  if (win) { // Als gewonnen dan muziekje en image
    alert('Bingo!');
  }
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