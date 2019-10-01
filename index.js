new Vue({
  el: "#app",
  data: {
    deck: [],
    dealerHand: [],
    playerHand: [],
    handInProgress: false,
    dealerHasAce: false,
    playerHasAce: false,
    playersTurn: true,
    playerWin: false,
    dealerWin: false,
    playerBust:false,
    dealerBust: false,
    showPlayerScore: false,
    values: {
      "A": 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      "J": 10,
      "Q": 10,
      "K": 10
    }
  },
  methods: {
    createDeck() {
      const deck = []

      const suits = ['♥', '♠', '♦', '♣']

      for(let i=0;i<suits.length;i++) {
        for(let y=1;y<=13;y++) {

          if(y === 1) {
            deck.push({
                suit: suits[i],
                value: "A"
              })
              continue
          }

          if(y >= 11) {
            if(y === 11) {
              deck.push({
                suit: suits[i],
                value: "J"
              })
              continue
            } else if(y === 12) {
              deck.push({
                suit: suits[i],
                value: "Q"
              })
              continue
            } else if(y === 13) {
              deck.push({
                suit: suits[i],
                value: "K"
              })
              continue
            }
          }

          deck.push({
            suit: suits[i],
            value: y
          })
        }
      }
      return deck
    },

    shuffle(arr) {
      const l = arr.length
      const getRandomIndex = () => Math.floor(Math.random() * l) 
      let temp;
      for(let i=0;i<l;i++) {
        temp = arr.splice(getRandomIndex(), 1)
        arr.push(...temp)
      } 
    },

    newHand() {
      this.deck = this.createDeck()
      this.shuffle(this.deck)
      this.shuffle(this.deck)
      this.dealerHand.push(this.deck.pop())
      this.dealerHand.push(this.deck.pop())
      this.playerHand.push(this.deck.pop())
      this.playerHand.push(this.deck.pop())

      if(this.getScore(this.playerHand, true) === 21) {
        this.playerWin = true
        this.dealerWin = false
        this.handInProgress = false
        
      } else if(this.getScore(this.dealerHand, false) === 21) {
        this.dealerWin = true
        this.playerWin = false
        this.handInProgress = false
      }
      console.log(this.deck)
    },

    dealOnClick() {
      this.dealerHand = []
      this.playerHand = []
      this.dealerWin = false
      this.playerWin = false
      this.playerHasAce = false
      this.dealerHasAce = false
      this.handInProgress = true
      this.playersTurn = true
      this.showPlayerScore = true
      this.playerBust = false
      this.dealerBust = false
      this.newHand()
    },

    getScore(hand, isPlayer) {
      let score = hand.reduce((acc, item) => {
        if(item.value === "A" && isPlayer) {
          this.playerHasAce = true
        } else if(item.value === "A" && !isPlayer) {
          this.dealerHasAce = true
        }
        return acc += this.values[item.value]
      }, 0)

      if(score + 10 <= 21) {
        if(isPlayer && this.playerHasAce) {
        score += 10
        } else if(!isPlayer && this.dealerHasAce) {
          score += 10
        }
      }
      return score
    },

    hit(hand, isPlayer) {
      hand.push(this.deck.pop())
      const score = this.getScore(hand, true)
      if(isPlayer && score > 21) {
        this.dealerWin = true
        this.playerWin = false
        this.playerBust = true
        this.handInProgress = false
      } else if(isPlayer && score === 21) {
        this.stay(true)
      }
      console.log(this.deck)
    },

    hitOnClick() {
      this.hit(this.playerHand, true)
    },

    stay(isPlayer) {
      if(isPlayer) {
        this.playersTurn = false
        this.checkDealersHand()
        return
      }
      this.calcWinner()
    },

    checkDealersHand() {
      const score = this.getScore(this.dealerHand, false)
      if(score === 21) {
        this.calcWinner()
        return
      } else if(score > 21) {
        this.playerWin = true
        this.dealerBust = true
        this.handInProgress = false
        return
      } else if(score >= 17 && score < 21) {
        this.stay(false)
        this.calcWinner()
        return
      }
      this.hit(this.dealerHand, false)
      this.checkDealersHand()
    },

    calcWinner() {
      this.handInProgress = false
      const player = this.getScore(this.playerHand, true)
      const dealer = this.getScore(this.dealerHand, false)

      if(player > dealer) {
        this.playerWin = true
        this.dealerWin = false
        return
      }
      this.dealerWin = true
      this.playerWin = false
    }

  }
})