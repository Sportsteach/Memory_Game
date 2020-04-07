class MixOrMatch {
  constructor(cards) {
      this.cardsArray = cards;
      this.ticker = document.getElementById('flips');
      this.highScore = JSON.parse(localStorage.getItem("score")) || null;
      this.lowScore = document.getElementById('lowestScore');
      document.getElementById('lowScore').classList.add('visible');
      document.getElementById('lowestScore').innerHTML = this.highScore;
}

startGame() {
    this.cardToCheck = null;
    this.totalClicks = 0;
    this.matchedCards = [];
    this.busy = true;
    setTimeout(() => {
      this.shuffleCards(this.cardsArray);
      this.busy = false;
  }, 500)
  
  this.hideCards();
  this.ticker.innerText = this.totalClicks;
  }

  hideCards(){
    this.cardsArray.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }

  flipCard(card){
    if(this.canFlipCard(card)) {
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add('visible');
      
      if(this.cardToCheck)
        this.checkForCardMatch(card);
      else 
        this.cardToCheck = card;
    }
  }

  checkForCardMatch(card){
    if(this.getCardType(card) === this.getCardType(this.cardToCheck))
        this.cardMatch(card, this.cardToCheck);
    else
        this.cardMisMatch(card, this.cardToCheck);
        this.cardToCheck = null;
  }

  cardMatch(card1, card2){
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    if(this.matchedCards.length === this.cardsArray.length)
      this.gameOver();
  }

  cardMisMatch(card1, card2){
    this.busy = true;
    setTimeout(()=>{
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    },1000);
}
  getCardType(card){
    return card.getElementsByClassName('card-value')[0].src;
  }
  
  gameOver() {
    let currentScore = this.totalClicks;
    this.highScore = this.highScore ? this.highScore : currentScore;

    if (this.highScore >= currentScore) {
      document.getElementById('game-over-text').classList.add('visible');
      document.getElementById('your-score').innerHTML = currentScore;
      document.getElementById('best-score2').innerHTML = currentScore;
      document.getElementById('lowScore').classList.add('visible');
      document.getElementById('lowestScore').innerHTML = currentScore;
      localStorage.setItem('score', JSON.stringify(currentScore))
    } else {
      document.getElementById('game-over-text').classList.add('visible');
      document.getElementById('your-score').innerHTML = currentScore;
      document.getElementById('best-score2').innerHTML = this.highScore;
    }
  }


  shuffleCards(cardsArray){
      for(let i = cardsArray.length - 1; i > 0; i--){
        let randIndex = Math.floor(Math.random() * (i+1));
        cardsArray[randIndex].style.order = i;
        cardsArray[i].style.order = randIndex;
      }
  }

  canFlipCard(card){
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }
}
function ready() {
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new MixOrMatch(cards);

  overlays.forEach(overlay => {
      overlay.addEventListener('click', () => {
          overlay.classList.remove('visible');
          game.startGame();
      });
  });

  cards.forEach(card => {
      card.addEventListener('click', () => {
          game.flipCard(card);
      });
  });
}

ready();
