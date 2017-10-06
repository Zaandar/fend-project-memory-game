/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 *
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


// holds the first card selected for each attempt
let firstOpenCard;
let matchCount = 0;

/*
 * Card class
 */
class Card {
    constructor(icon) {
        this.icon = icon;
    }
}

// TODO, if you click twice on the same card, it shows up as a match

let deck = createDeck();

shuffle(deck);

deal(deck);

// bind card clicks to handler
$('.card').bind("click", onEventClick);


/*
 * Event handler for clicks on cards
 */
function onEventClick(event) {
    let card = $(this);

    // flip the card over
    openCard(card);

    // save the first card selected
    if (!save(card)) {
        // if a card has already been saved, see if they match
        if (match(card)) {
            // if they match, lock them open
            matchCount++
            lockMatchedCards(card);
        } else {
            // if the cards don't match, wait a bit and then flip them closed
            setTimeout(function() {
                closeCards(card);
            }, 750);
        }

        if (matchCount == 8) {
            $('.modal-dialog').css('display', 'block');
        }
    }
};

/*
 * Handle the reset button
 */
$('.restart').click(function() {
    $('.card').unbind("click", onEventClick);
    $('.card').remove();
    deck = createDeck();

    shuffle(deck);
    deal(deck);
    $('.card').bind("click", onEventClick);
});

/*
 * Close the congratulations dialog
 */
$('.close').click(function() {
    $('.modal-dialog').css('display', 'none');
});

/*
 * Create a deck of cards, 2 of each
 */
function createDeck() {
    return selectedDeck = [
        new Card("fa fa-diamond"),
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
}

/*
 * save the first selected card
 */
function save(card) {

    let saved = false;

    // only save the first selected card, no need to save the second one
    if (!firstOpenCard) {
        firstOpenCard = card;
        saved = true;
    }

    return saved;
}

/*
 *  check to see if the cards match
 */
function match(card) {
    let card1 = firstOpenCard.find('i');
    let card2 = card.find('i');

    if (card1[0].className === card2[0].className) {
        return true;
    }
}

/*
 * display a clicked card
 */
function openCard(card) {
    card.attr("class", "card open show");
}

/*
 * close the opened cards
 */
function closeCards(card) {
    card.attr("class", "card");
    firstOpenCard.attr("class", "card");

    deselectCards();
}

/*
 *  cards matched, lock them open
 */
function lockMatchedCards(card) {
    card.attr("class", "card match");
    firstOpenCard.attr("class", "card match");

    deselectCards();
}

/*
 *  clear selected cards
 */
function deselectCards() {
    card = undefined;
    firstOpenCard = undefined;
}

/*
 *  deal the cards
 */
function deal(deck) {
    for (let x = 0; x < deck.length; x++) {
        let newCard = "<i class='" + deck[x].icon + "'>";
        let dealtCard = $('<li class="card">' + newCard + '</i></li>');
        $('.deck').append(dealtCard);
    }
}

/*
 *  Shuffle function from http://stackoverflow.com/a/2450976
 */
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
