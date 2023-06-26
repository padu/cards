const cardAPI = (function(){

    const deck = $(".card-deck");
    const cards = $(".flip-card");
    const welcomePage = $(".welcome-page");
    const endPage = $(".end-page");

    let noOfCards = 0;
    let currentCardNo = -1;

    // print no of cards and there image values
    console.log(cards.length);

    showWelcomePage();

    function showWelcomePage() {
        welcomePage.show();
        endPage.hide();
        deck.hide();
    }

    function showEndPage() {
        welcomePage.hide();
        endPage.show();
        deck.hide();
    }

    function showDeck() {
        welcomePage.hide();
        endPage.hide();
        deck.show();
    }

    fetchData();

    function fetchData() {
        $.getJSON('./data/alphabates.json', function(data) {
            const cards = data.cards;
            noOfCards = cards.length;
            cards.forEach(function(card) {
                const newCard = createCard(card);
                deck.append(newCard);
            });
            takeToTop();
        });
    }

    //start animation
    function startAnimation() {
        showDeck();
        takeToTop();
    }

    // create card 
    //     <div class="flip-card">
    //     <div class="flip-card-inner">
    //         <div class="flip-card-front">
    //           <div class="flip-card-front-content">
    //             <h1>cart main title</h1>
    //             <p>card sub title</p>
    //           </div>
    //         </div>
    //         <div class="flip-card-back">
    //           <img
    //               src="images/c.png"
    //               alt="Avatar"
    //               class="card-img"
    //           />
    //         </div>
    //     </div>
    //   </div>
    function createCard(card) {
        const flipCard = $("<div>").addClass("flip-card");
        const flipCardInner = $("<div>").addClass("flip-card-inner");
        const flipCardFront = $("<div>").addClass("flip-card-front");
        const flipCardFrontContent = $("<div>").addClass("flip-card-front-content");
        const flipCardBack = $("<div>").addClass("flip-card-back");
        const cardImg = $("<img>").addClass("card-img").attr("src", `./assets/${card['card-back'].image}`);
        const cardH1 = $("<h1>").text(card['card-front']['main-heading']);
        const cardP = $("<p>").text(`${card['card-front']['sub-heading']}`.toUpperCase());

        flipCardFrontContent.append(cardH1, cardP);
        flipCardFront.append(flipCardFrontContent);
        flipCardBack.append(cardImg);
        flipCardInner.append(flipCardFront, flipCardBack);
        flipCard.append(flipCardInner);
        return flipCard;
    }

    function takeToLast() {
      const lastCard = $(".flip-card").last();
      $(".flip-card:nth-last-child(1)").find(".flip-card-inner").removeClass("flip-card-inner-flip");
      lastCard.animate({left: 0, top: 0}, 500, function() {
        lastCard.prependTo(deck).animate({left: 100, top: 100}, 500);
        $(".flip-card:nth-last-child(1)").animate({left: 130, top: 130}, 100);
        $(".flip-card:nth-last-child(2)").animate({left: 120, top: 120}, 100);
        $(".flip-card:nth-last-child(3)").animate({left: 110, top: 110}, 100);
      });
    }

    function takeToTop() {
        const firstCard = $(".flip-card").first();
        $(".flip-card:nth-last-child(1)").find(".flip-card-inner").removeClass("flip-card-inner-flip");
        currentCardNo++;
        if (currentCardNo == 1) {
            flipCard();
        } else {
            firstCard.animate({left: 0, top: 0}, 1000, function() {
                firstCard.appendTo(deck).animate({left: 130, top: 100}, 500, function() {
                    if (currentCardNo == 0) { 
                        prepareStack(() => {});    
                        return 
                    };
                    flipCard();
                });
            });
        }

        function prepareStack(afterPrepareStackCallback) {
            $(".flip-card:nth-last-child(4)").animate({left: 100, top: 70}, 50);
            $(".flip-card:nth-last-child(3)").animate({left: 110, top: 80}, 50);
            $(".flip-card:nth-last-child(2)").animate({left: 120, top: 90}, 50);
            $(".flip-card:nth-last-child(1)").animate({left: 130, top: 100}, 50, function() {
                afterPrepareStackCallback();
            });
        }

        function flipCard() {
            prepareStack(function() {
                $(".flip-card:nth-last-child(1)").animate({left: 130, top: 100}, 2000, function() {
                    $(".flip-card:nth-last-child(1) .flip-card-inner").addClass("flip-card-inner-flip");
                }).animate({left: 130, top: 100}, 6000, function() {
                    if((currentCardNo >= noOfCards)) {
                        showEndPage();
                        currentCardNo = -1;
                        takeToTop();
                        return;
                    }
                    window.requestAnimationFrame(takeToTop);
                });
            });  
        }
    }
    return {
        startAnimation: startAnimation,
        takeToLast: takeToLast,
        takeToTop: takeToTop,
        noOfCards: noOfCards,
        currentCardNo: currentCardNo
    }
})();