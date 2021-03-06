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
let gameStarted = false;
let moveCount = 0;
let twoCardsOpen = false;
let starCount = 3;
let timeKeeper;
const millis = 1000;
const millisInASecond = 1000 * 60;
const millisInAMinute = 1000 * 60 * 60;
const millisInAnHour = 1000 * 60 * 60 * 24;
let playersTime = "00:00:00"

/*
 * Card class
 */
class Card {
    constructor(icon) {
        this.icon = icon;
    }
}

// initialize game
$('.game-timer').html("Time Elapsed: 0:0:0");
let deck = createDeck();
shuffle(deck);
deal(deck);

// bind card clicks to handler
$('.card').bind("click", onEventClickCard);

/*
 * Event handler for clicks on cards
 */
function onEventClickCard(event) {
    let card = $(this);

    // keep track of how long the player takes to
    // match all cards
    if (!gameStarted) {
        startTimer();
    }

    // only two cards can be viewed at any one time
    if (!twoCardsOpen) {
        // flip the card over
        openCard(card);

        // save the first card selected
        if (!save(card)) {
            // two cards are open
            twoCardsOpen = true;

            // if a card has already been saved, see if they match
            if (match(card)) {
                // if they match, lock them open
                matchCount++;
                lockMatchedCards(card);
            } else {
                // if the cards don't match, wait a bit and then flip them closed
                setTimeout(function() {
                    closeCards(card);
                }, 850);
            }

            // all cards have been matched
            if (matchCount == 8) {
                // stop the game timer
                let seconds = stopTimer();

                // message when all matched
                $('.message').html("<p>Congratulations!!! You earned " + starCount + " star(s). Your time was " + playersTime + ".</p>");

                // display congrats modal
                $('.modal-dialog').css('display', 'block');
            }
        }
    }
};

/*
 * 'R' shortcut for reset
 */
$(document).keydown(function(event) {

    if ((event.which == 114) || (event.which == 82)) {
        onEventRestart(event);
    }
});

/*
 * Event handler for clicks on restart button
 */
function onEventRestart(event) {

    let starList = $('.stars').find('li');
    starList.remove();

    $('.game-timer').html("Time Elapsed: 0:0:0");

    // reset everything
    stopTimer();
    moveCount = 0;
    matchCount = 0;
    starCount = 3;

    // if the congrats dialog is open, close it
    $('.modal-dialog').css('display', 'none');
    // unbind the event listener
    $('.card').unbind("click", onEventClickCard);
    // clear all the cards
    $('.card').remove();
    // set up new game
    deck = createDeck();
    shuffle(deck);
    deal(deck);
    // re-bind the event listener to the new deck
    $('.card').bind("click", onEventClickCard);
}

/*
 * Handle the reset button
 */
$('.restart').bind("click", onEventRestart);

/*
 * Handle the yes button
 */
$('.yes-option').bind("click", onEventRestart);

/*
 * Handle the no button
 */
$('.no-option').click(function() {
    $('.modal-dialog').css('display', 'none');
});

/*
 * Close the congratulations dialog
 */
$('.close').click(function() {
    $('.modal-dialog').css('display', 'none');
});

/*
 * Start the game timer
 */
function startTimer() {
    let timerStart = Date.now();
    gameStarted = true;
    timeKeeper = setInterval(function() {
        timer(timerStart)
    }, 1000);
}

/*
 * Stop the game timer and return seconds elapsed
 */
function stopTimer() {
    gameStarted = false;
    clearInterval(timeKeeper);
}

function timer(timerStart) {
    let timeNow = Date.now(); // milliseconds
    let timeElapsedMillis = timeNow - timerStart;

    // mod so that we get no more than 59 secs, 59 min, 24 hr
    let seconds = Math.floor((timeElapsedMillis % millisInASecond) / millis);
    let minutes = Math.floor((timeElapsedMillis % millisInAMinute) / millisInASecond);
    let hours = Math.floor((timeElapsedMillis % millisInAnHour) / millisInAMinute);

    playersTime = hours + ":" + minutes + ":" + seconds;

    $('.game-timer').html("Time Elapsed: " + playersTime);
}

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

    // increment the move count and display the new count
    moveCount++;
    $('.moves').html(moveCount);

    // every eight moves, player loses a star
    if (moveCount % 8 == 0) {
        let starList = $('.stars').find('li');
        let firstStar = starList.first();

        if (starList.length > 1) {
            firstStar.remove();
        }

        starCount--;
    }

    if (!((card1.context.offsetLeft === card2.context.offsetLeft) &&
            (card1.context.offsetTop === card2.context.offsetTop))) {
        if (card1[0].className === card2[0].className) {
            return true;
        }
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
    twoCardsOpen = false;
    deselectCards();
}

/*
 *  cards matched, lock them open
 */
function lockMatchedCards(card) {
    card.attr("class", "card match");
    firstOpenCard.attr("class", "card match");
    twoCardsOpen = false;
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

    $('.moves').html(moveCount);

    for (let x = 0; x < starCount; x++) {
        $('.stars').append('<li><i class="fa fa-star"></i></li>');
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
