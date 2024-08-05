/*-------------------------------- Constants --------------------------------*/
const suits = ["h", "c", "d", "s"];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const MSG_LOOKUP = {
  null: 'Good Luck!',
  'T': "It's a Push",
  'P': 'Player Wins!',
  'D': 'Dealer Wins',
  'PBJ': 'Player Has Blackjack :smiley:',
  'DBJ': 'Dealer Has Blackjack :pensive:',
};
// const mainDeck = buildMainDeck();
/*---------------------------- Variables (state) ----------------------------*/
let deck;
let pHand, dHand;
let dTotal, pTotal; 
let bankRoll , bet;
let outcome;
/*------------------------ Cached Element References ------------------------*/
const confirmButton = document.querySelector("#confirm-bet");
const inputBetEl = document.querySelector("#bet");
const hitButton = document.querySelector("#hit");
const standButton = document.querySelector("#stand");
const amountBetEl = document.querySelector("#amount-bet");
const bankEl = document.querySelector(".bank-amount");
const msgEl = document.querySelector("#msg");
/*----------------------------- Event Listeners -----------------------------*/
inputBetEl.addEventListener("keypress", betPlaced)
confirmButton.addEventListener("click", handleBet);
// hitButton.addEventListener("click");
// standButton.addEventListener("click");
/*-------------------------------- Functions --------------------------------*/



init();

function init() {
  bank = 5000;
  render();
  buildDeck();
  shuffleDeck();
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
}

async function betPlaced(evt){
  console.log(evt.target.value)
  amountBet = await evt.target.value 
}
console.log(amountBet)
function handleBet(){
  const btn = amountBet;
  const amounBtetEl = amountBet;
  
  // when confirmButton clicked take placeBet amount and put it into amounBtetEl and subtracts placeBet amount from bankEl
  // if player wins amountBetEl gets * 1.5 and placed back into bankEl
  // if player loses 
}