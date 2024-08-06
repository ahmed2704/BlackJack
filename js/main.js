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
const mainDeck = buildMainDeck();
/*---------------------------- Variables (state) ----------------------------*/
let deck;
let pHand, dHand;
let dTotal, pTotal; 
let bankRoll , bet;
let outcome;
/*------------------------ Cached Element References ------------------------*/
const msgEl = document.querySelector("#msg");
const dHandEl = document.querySelector(".dealer-cards-container")
const dTotalEl = document.querySelector("#dealer-total")
const pHandEl = document.querySelector(".player-cards-container")
const pTotalEl = document.querySelector("#player-total")
const bankRollEl = document.querySelector(".bank-amount");
const BetEl = document.querySelector("#amount-bet");
const hitButton = document.querySelector("#hit");
const standButton = document.querySelector("#stand");
const dealBtn = document.querySelector("#deal");
const betBtns = document.querySelectorAll("bet-container > button");
/*----------------------------- Event Listeners -----------------------------*/
dealBtn.addEventListener('click', handleDeal);
document.getElementById('bet-container').addEventListener('click', handleBet);

/*-------------------------------- Functions --------------------------------*/



init();

function handleBet(evt) {
  const btn = evt.target;
  if (btn.tagName !== 'BUTTON') return;
  const betAmt = parseInt(btn.innerText.replace('$', ''));
  console.log(betAmt)
  bet += betAmt;
  bankRoll -= betAmt;
  render();
}

function handleDeal() {
  deck = getNewShuffleDeck();
  dHand.push(deck.pop(), deck.pop());
  pHand.push(deck.pop(), deck.pop());
  dTotal = getHandTotal(dHand);
  pHand = getHandTotal(pHand)
  if (dTotal === 21 && pTotal === 21) {
    outcome = 'T'
  } else if (dTotal === 21) {
    outcome = 'DBJ';
  } else if (pTotal === 21) {
    outcome = 'PBJ';
  }
  if (outcome) settleBet();
  render
}

function settleBet() {

}

function getHandTotal(hand) {
  let total = 0;
  let aces = o;
  hand.forEach(function(card) {
    total += card.value;
    if (card.value === 11) aces++;
  })
  while (total > 21 && aces) {
    total -= 10;
    aces --;
  }
  return total;
}

function init() {
  outcome = null;
  dHand = [];
  pHand = [];
  pTotal = dTotal = 0;
  bankRoll = 500;
  bet = 0;
  render();
}

function render() {
  renderHands();
  BetEl.innerHTML = bet;
  bankRollEl.innerHTML = bankRoll;
  renderControls();
  renderBetBtns();
  msgEl.innerHTML = MSG_LOOKUP[outcome];
}

function renderBetBtns() {
  betBtns.forEach(function(btn) {
    const btnAmt = parseInt(btn.innerText.replace('$', ''))
    btn.disabled = btnAmt > bankRoll;
  })
}

function renderControls() {

}

function renderHands() {
  pTotalEl.innerHTML = pTotal;
  dTotalEl.innerHTML = outcome ? dTotal : "?";
  pHandEl.innerHTML = pHand.map(card => `<div class="card ${card.face}"></div>`).join("");
  dHandEl.innerHTML = dHand.map((card, idx) => `<div class="card ${idx === 1 && !outcome ? 'back' : card.face}"></div>`).join('');
}


function getNewShuffleDeck() {
  const tempDeck = [...mainDeck];
  const newShuffleDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newShuffleDeck.push(tempDeck.splice(rndIdx, 1)[0])
  }
  return newShuffleDeck;
}

function buildMainDeck() {
  const deck = [];
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        face:`${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      })
    })
  })
  return deck;
}



  // when confirmButton clicked take placeBet amount and put it into amounBtetEl and subtracts placeBet amount from bankEl
  // if player wins BetEl gets * 1.5 and placed back into bankEl
  // if player loses 
