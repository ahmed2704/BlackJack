/*-------------------------------- Constants --------------------------------*/
const suits = ["h", "c", "d", "s"];
const ranks = [
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "J",
  "Q",
  "K",
  "A",
];
const MSG_LOOKUP = {
  null: "Good Luck!",
  T: "It's a Push",
  P: "Player Wins!",
  D: "Dealer Wins",
  PBJ: "Player Has Blackjack 🤑🤑💰💰",
  DBJ: "Dealer Has Blackjack 😞😞😢😢",
};
const mainDeck = buildMainDeck();
/*---------------------------- Variables (state) ----------------------------*/

let deck;
let pHand, dHand;
let dTotal, pTotal;
let bankRoll, bet;
let outcome;
/*------------------------ Cached Element References ------------------------*/
const msgEl = document.getElementById("msg");
const dealerHandEl = document.getElementById("dealer-hand");
const dealerTotalEl = document.getElementById("dealer-total");
const playerHandEl = document.getElementById("player-hand");
const playerTotalEl = document.getElementById("player-total");
const betEl = document.getElementById("bet");
const bankRollEl = document.getElementById("bankroll");
const handActiveControlsEl = document.getElementById("hand-active-controls");
const handOverControlsEl = document.getElementById("hand-over-controls");
const dealBtn = document.getElementById("deal-btn");
const betBtns = document.querySelectorAll("#bet-controls > button");

/*----------------------------- Event Listeners -----------------------------*/
dealBtn.addEventListener("click", handleDeal);
document.getElementById("hit-btn").addEventListener("click", handleHit);
document.getElementById("stand-btn").addEventListener("click", handleStand);
document.getElementById("bet-controls").addEventListener("click", handleBet);

/*-------------------------------- Functions --------------------------------*/

init();

function handleStand() {
  dealerPlay(); // Dealer takes their turn
  
  // Determine the outcome based on hand totals
  if (pTotal > 21) {
    // Player busts
    outcome = dTotal > 21 ? "T" : "D"; // If dealer busts too, it's a tie, otherwise dealer wins
  } else if (dTotal > 21) {
    // Dealer busts
    outcome = "P"; // Player wins
  } else if (pTotal === 21 || dTotal === 21) {
    // One or both have Blackjack
    outcome = pTotal === 21 && dTotal === 21 ? "T" : (pTotal === 21 ? "PBJ" : "DBJ");
  } else if (pTotal === dTotal) {
    // Tie
    outcome = "T";
  } else {
    // Determine winner based on totals
    outcome = pTotal > dTotal ? "P" : "D";
  }

  settleBet(); // Adjust the bet based on the outcome
  render(); // Update the display
}

function dealerPlay(cb) {
  // while dealer has a total less than 17
  while (dTotal < 17) {
    dHand.push(deck.pop()); // add a card to the dealer hand
    dTotal = getHandTotal(dHand); //update the dealer's hand total
  }
}

function handleHit() {
  pHand.push(deck.pop());//Add a card to the player's hand
  pTotal = getHandTotal(pHand);//update the player's hand total
  if (pTotal > 21) {
    outcome = "D";//player busts, dealer wins
    settleBet();//adjust bank roll
  }
  render();// updates the display
}

function handleBet(evt) {
  const btn = evt.target;//get the clicked button
  if (btn.tagName !== "BUTTON") return;// Only proceed if a button was clicked
  const betAmt = parseInt(btn.innerText.replace("$", ""));// Extract the bet amount
  bet += betAmt;// Add bet amount to the current bet
  bankRoll -= betAmt;// Deduct bet amount from bank roll
  render();
}

function handleDeal() {
  outcome = null;// no outcome at start of new deal
  deck = getNewShuffleDeck();// gets a shuffled deck of cards
  dHand = [];//clears previous cards that were delt 
  pHand = [];
  //deals 2 cards to both dealer and player
  dHand.push(deck.pop(), deck.pop());
  pHand.push(deck.pop(), deck.pop());
  //calculates dealer and player hand total
  dTotal = getHandTotal(dHand);
  pTotal = getHandTotal(pHand);
  //check for blackjack scenarios
  if (dTotal === 21 && pTotal === 21) {
    outcome = "T";
  } else if (pTotal === 21 && dTotal !== 21) {
    outcome = "PBJ";
  }
  if (outcome) settleBet();
  render();
}

function settleBet() {
  if (outcome === "PBJ") {
    //if player wins with BJ bet is 2X
    bankRoll += bet + bet * 2;
  } else if (outcome === "P") {
    bankRoll += bet + bet * 1.5;
    //tie = return bet to bankroll
  } else if (outcome === "T") bankRoll += bet;
  bet = 0;//resets the bet amount 
}

function getHandTotal(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach(function (card) {
    total += card.value; //add card value to total
    // count aces for possible adjustment 
    if (card.value === 11) aces++;
  });
  // adjust total for aces if value exceds 21
  while (total > 21 && aces) {
    total -= 10;//convert ace from 11 to 1
    aces--;
  }
  return total; //return the final hand total
}

function init() {
  outcome = null;
  dHand = [];
  pHand = [];
  pTotal = dTotal = 0;
  bankRoll = 5000;
  bet = 0;
  render();
}

function render() {
  renderHands();
  betEl.innerHTML = bet; //updates displayed bank roll
  bankRollEl.innerHTML = bankRoll;
  renderControls();
  renderBetBtns();
  msgEl.innerHTML = MSG_LOOKUP[outcome];// displays the outcome nessage
}
// enable or disable bet buttons based on the bank roll
function renderBetBtns() {
  betBtns.forEach(function (btn) {
    const btnAmt = parseInt(btn.innerText.replace("$", ""));
    btn.disabled = btnAmt > bankRoll;
  });
}

function renderControls() {
  //shows the bet amount buttons if no hand is in play
  handOverControlsEl.style.display = handInPlay() ? "none" : "flex";
  //shows hit/stand controls if theres a hand in play and bet is less then or equal to 5
  handActiveControlsEl.style.visibility =
    bet >= 5 && handInPlay() ? "visible" : "hidden";
  //shows deal button if no hand is in play anf bet is >=5
  dealBtn.style.visibility = bet >= 5 && !handInPlay() ? "visible" : "hidden";
}

function renderHands() {
  playerTotalEl.innerHTML = pTotal; //shows pTotal
  //shows dealers total if hand is over, otherwise hide it 
  dealerTotalEl.innerHTML = outcome ? dTotal : "??";
  playerHandEl.innerHTML = pHand
        //create HTMLfor each card in players hand
    .map((card) => `<div class="card ${card.face}"></div>`)
    .join("");//Join HTML strings for player's hand
  dealerHandEl.innerHTML = dHand
    .map(
      (card, idx) =>
        `<div class="card ${
          idx === 1 && !outcome ? "back-red" : card.face
        }"></div>`
    )//show second card as a beck-red if hand is not over
    .join("");// join HTML strings for dealers hand
}

function handInPlay() {
  return pHand.length && !outcome; 
  // Check if the player's hand is not empty and there is no outcome yet
}

function getNewShuffleDeck() {
  const tempDeck = [...mainDeck];// copy of the main deck
  const newShuffleDeck = []; //new deck to be shuffled
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);// get a random index
    newShuffleDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    //remove card from tempDeck and add to newdeck
  }
  return newShuffleDeck;
}

function buildMainDeck() {
  const deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        face: `${suit}${rank}`,//create card face string
        //sets card value (ace is 11, face cards are 10)
        value: Number(rank) || (rank === "A" ? 11 : 10),
      });
    });
  });
  return deck;
}

