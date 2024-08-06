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
const msgEl = document.getElementById("msg");
const dealerHandEl = document.getElementById("dealer-hand")
const dealerTotalEl = document.getElementById("dealer-total")
const playerHandEl = document.getElementById("player-hand")
const playerTotalEl = document.getElementById("player-total")
const betEl = document.getElementById("bet");
const bankRollEl = document.getElementById("bankroll");
const handActiveControlsEl = document.getElementById("hand-active-controls");
const handOverControlsEl = document.getElementById("hand-over-controls");
const dealBtn = document.getElementById("deal-btn");
const betBtns = document.querySelectorAll("#bet-controls > button");
const hitBtn = document.getElementById('hit-btn');

/*----------------------------- Event Listeners -----------------------------*/
dealBtn.addEventListener('click', handleDeal);
hitBtn.addEventListener('click', handleHit);
document.getElementById('bet-container').addEventListener('click', handleBet);

/*-------------------------------- Functions --------------------------------*/



init();

function handleHit() {
  pHand.push(deck.pop());
  pTotal = getHandTotal(pHand);
  if (pTotal > 21)  {
    outcome = 'D';
    settleBet();
  } 
  render();
}

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
  pHand = getHandTotal(pHand);
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
  if (outcome === 'PBJ'){
    bankRoll += bet + (bet * 1.5);
  } else if (outcome === 'P') {
    bankRoll += bet + bet * 2;
  }
  bet = 0
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
  betEl.innerHTML = bet;
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
  handOverControlsEl.style.visibility = handInPlay() ? 'hidden' : 'visible';
  handActiveControlsEl.style.visibility = bet >= 5 && !handInPlay() ? 'visible' : 'hidden';
  dealBtn.style.visibility = bet >= 5 && !handInPlay() ? 'visible' : 'hidden';
}

function renderHands() {
  playerTotalEl.innerHTML = pTotal;
  dealerTotalEl.innerHTML = outcome ? dTotal : "??";
  playerHandEl.innerHTML = pHand.map(card => `<div class="card ${card.face}"></div>`).join("");
  dealerHandEl.innerHTML = dHand.map((card, idx) => `<div class="card ${idx === 1 && !outcome ? 'back' : card.face}"></div>`).join('');
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
        face:`${suit}-${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      })
    })
  })
  return deck;
}



  // when confirmButton clicked take placeBet amount and put it into amounBtetEl and subtracts placeBet amount from bankEl
  // if player wins betEl gets * 1.5 and placed back into bankEl
  // if player loses 
