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
  PBJ: "Player Has Blackjack :smiley:",
  DBJ: "Dealer Has Blackjack :pensive:",
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
  dealerPlay();
  if (pTotal > 21) {
    outcome = (dTotal > 21) ? 'T' : 'D'; // Player busts, check if dealer also busts
  } else if (dTotal > 21) {
    outcome = 'P'; // Dealer busts, player wins
  } else if (pTotal === 21) {
    outcome = (dTotal === 21) ? 'T' : 'PBJ'; // Player hits 21, check if dealer also hits 21
  } else if (dTotal === 21) {
    outcome = 'DBJ'; // Dealer hits 21, dealer wins
  } else if (pTotal === dTotal) {
    outcome = 'T'; // Tie
  } else if (pTotal > dTotal) {
    outcome = 'P'; // Player has a higher total without busting
  } else {
    outcome = 'D'; // Dealer has a higher total or player's total is not greater
  }
  settleBet();
  render();
}

function dealerPlay(cb) {
  // while dealer has a total less than 17
  while (dTotal < 17) {
    dHand.push(deck.pop()); // add a card to the dealer hand
    dTotal = getHandTotal(dHand); // calculate the total of the dealer hand
  }
}

function handleHit() {
  pHand.push(deck.pop());
  pTotal = getHandTotal(pHand);
  if (pTotal > 21) {
    outcome = "D";
    settleBet();
  }
  render();
}

function handleBet(evt) {
  const btn = evt.target;
  if (btn.tagName !== "BUTTON") return;
  const betAmt = parseInt(btn.innerText.replace("$", ""));
  bet += betAmt;
  bankRoll -= betAmt;
  render();
}

function handleDeal() {
  outcome = null;
  deck = getNewShuffleDeck();
  dHand = [];
  pHand = [];
  dHand.push(deck.pop(), deck.pop());
  pHand.push(deck.pop(), deck.pop());
  dTotal = getHandTotal(dHand);
  pTotal = getHandTotal(pHand);
  if (dTotal === 21 && pTotal === 21) {
    outcome = "T";
  } else if (dTotal === 21) {
    outcome = "DBJ";
  } else if (pTotal === 21) {
    outcome = "PBJ";
  }
  if (outcome) settleBet();
  render();
}

function settleBet() {
  if (outcome === "PBJ") {
    bankRoll += bet + bet * 2;
  } else if (outcome === "P") {
    bankRoll += bet + bet * 1.5;
  } else if(outcome === "T")
    bankRoll += bet
  bet = 0;
}

function getHandTotal(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach(function (card) {
    total += card.value;
    if (card.value === 11) aces++;
  });
  while (total > 21 && aces) {
    total -= 10;
    aces--;
  }
  return total;
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
  betEl.innerHTML = bet;
  bankRollEl.innerHTML = bankRoll;
  renderControls();
  renderBetBtns();
  msgEl.innerHTML = MSG_LOOKUP[outcome];
}

function renderBetBtns() {
  betBtns.forEach(function (btn) {
    const btnAmt = parseInt(btn.innerText.replace("$", ""));
    btn.disabled = btnAmt > bankRoll;
  });
}

function renderControls() {
  handOverControlsEl.style.display = handInPlay() ? "none" : "flex";
  handActiveControlsEl.style.visibility =
    bet >= 5 && handInPlay() ? "visible" : "hidden";
  dealBtn.style.visibility = bet >= 5 && !handInPlay() ? "visible" : "hidden";
}

function renderHands() {
  playerTotalEl.innerHTML = pTotal;
  dealerTotalEl.innerHTML = outcome ? dTotal : "??";
  playerHandEl.innerHTML = pHand
    .map((card) => `<div class="card ${card.face}"></div>`)
    .join("");
  dealerHandEl.innerHTML = dHand
    .map(
      (card, idx) =>
        `<div class="card ${
          idx === 1 && !outcome ? "back-red" : card.face
        }"></div>`
    )
    .join("");
}

function handInPlay() {
  return pHand.length && !outcome;
}

function getNewShuffleDeck() {
  const tempDeck = [...mainDeck];
  const newShuffleDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newShuffleDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffleDeck;
}

function buildMainDeck() {
  const deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === "A" ? 11 : 10),
      });
    });
  });
  return deck;
}

// when confirmButton clicked take placeBet amount and put it into amounBtetEl and subtracts placeBet amount from bankEl
// if player wins betEl gets * 1.5 and placed back into bankEl
// if player loses
