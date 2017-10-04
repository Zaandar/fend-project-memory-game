let firstOpenCard;
/*
 * Create a list that holds all of your cards
 */
class Card {
  constructor(icon) {
    this.icon = icon;
    // this.matched = false;
    // this.flipped = false;
  }
}

let deck = [new Card("fa fa-diamond"),
  new Card("fa fa-diamond"),
  new Card("fa fa-paper-plane-o"),
  new Card("fa fa-paper-plane-o"),
  new Card("fa fa-anchor"),
  new Card("fa fa-anchor"),
  new Card("fa fa-bolt"),
  new Card("fa fa-bolt"),
  new Card("fa fa-cube"),
  new Card("fa fa-cube"),
  new Card("fa fa-leaf"),
  new Card("fa fa-leaf"),
  new Card("fa fa-bicycle"),
  new Card("fa fa-bicycle"),
  new Card("fa fa-bomb"),
  new Card("fa fa-bomb")
];

shuffle(deck);

deal(deck);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
$('.card').click(function() {

  let card = $(this);

  openCard(card);

  if (!save(card)) {
    if (match(card)) {
      console.log("They match!");
    } else {
      console.log("NO match!");
      setTimeout(function() {
        closeCards(card);
      }, 1500);
    }
  }
});

function save(card) {
  let saved = false;

  if (!firstOpenCard) {
    firstOpenCard = card;
    saved = true;
  }

  return saved;
}

function match(card) {
  if (firstOpenCard.firstChild == card.firstChild) {
    return true;
  }
}

function openCard(card) {
  card.attr("class", "card open show");
}

function closeCards(card) {
  card.attr("class", "card");
  firstOpenCard.attr("class", "card");
  firstOpenCard = null;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// deal the cards
function deal(deck) {
  for (let x = 0; x < deck.length; x++) {
    let newCard = "<i class='" + deck[x].icon + "'>";
    let dealtCard = $('<li class="card">' + newCard + '</i></li>');
    $('.deck').append(dealtCard);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
