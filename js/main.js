let dealerSum = 0;
let playerSum = 0;
let dAceCount = 0;
let pAceCount = 0;
let hidden;
let deck;
let canHit = true;
window.onload = function() {
  buildDeck();
  shuffleDeck();
  //startGame();
}
function buildDeck() {
deck = [];
suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
const cards = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
];

for(const card of cards){
    for(const suit of suits){
        deck.push({card: card, suit: suit});
    }
};
}


function shuffleDeck(){
  for (let i = 0; i < deck.length - 1; i++) {
    let j = Math.floor(Math.random() * deck.length)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck)
}