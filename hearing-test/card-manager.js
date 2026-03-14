// Card Manager Class
class CardManager {
  constructor() {
    this.currentCard = 0;
    this.totalCards = 9;
    this.cards = document.querySelectorAll('[sk-target^="card-"]');
    this.initializeCards();
    this.setupEventListeners();
  }

  initializeCards() {
    const container = document.querySelector('.card-container');
    if (container) {
      gsap.set(container, {
        height: '100vh',
        overflow: 'hidden',
        position: 'relative'
      });
    }

    this.cards.forEach((card, index) => {
      gsap.set(card, {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: index === 0 ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem',
        boxSizing: 'border-box',
        opacity: index === 0 ? 1 : 0
      });

      const gsapElements = card.querySelectorAll('.is-gsap');
      gsap.set(gsapElements, {
        opacity: index === 0 ? 1 : 0,
        xPercent: index === 0 ? 0 : 100
      });

      const content = card.querySelector('.card-content');
      if (content) {
        gsap.set(content, {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          gap: '2rem'
        });
      }
    });
  }

  showCard(cardNumber) {
    if (cardNumber < 0 || cardNumber > this.totalCards) return;

    const currentCard = this.cards[this.currentCard];
    const nextCard = this.cards[cardNumber];
    const direction = cardNumber > this.currentCard ? 1 : -1;

    const currentGsapElements = currentCard.querySelectorAll('.is-gsap');
    const nextGsapElements = nextCard.querySelectorAll('.is-gsap');

    gsap.set(nextCard, {
      display: 'flex',
      opacity: 1
    });

    gsap.set(nextGsapElements, {
      xPercent: 100 * direction,
      opacity: 0
    });

    const tl = gsap.timeline({
      onComplete: () => {
        this.currentCard = cardNumber;
        gsap.set(currentCard, {
          display: 'none',
          opacity: 0
        });
        this.checkConditionsAndEnableNext(cardNumber);
      }
    });

    tl.to(currentGsapElements, {
      xPercent: -100 * direction,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    }).to(nextGsapElements, {
      xPercent: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, '<');
  }

  areAllQuestionsAnswered(formElement) {
    const questionGroups = formElement.querySelectorAll('fieldset');
    return Array.from(questionGroups).every(group => {
      const radios = group.querySelectorAll('input[type="radio"]');
      return Array.from(radios).some(radio => radio.checked);
    });
  }

  checkConditionsAndEnableNext(cardNumber) {
    const currentCard = this.cards[cardNumber];
    const nextButton = currentCard.querySelector('[sk-action="next:click"]');
    if (!nextButton) return;

    switch (cardNumber) {
      case 1:
        const preTestQuestions = document.getElementById('pre-test-questions');
        if (preTestQuestions && this.areAllQuestionsAnswered(preTestQuestions)) {
          nextButton.classList.remove('inactive');
        } else {
          nextButton.classList.add('inactive');
        }
        break;

      case 2:
      case 3:
      case 4:
        const checkbox = currentCard.querySelector('.rb_ht');
        if (checkbox?.checked) {
          nextButton.classList.remove('inactive');
        } else {
          nextButton.classList.add('inactive');
        }
        break;

      case 5:
      case 6:
        nextButton.classList.remove('inactive');
        break;

      case 7:
        setTimeout(() => {
          this.showCard(this.currentCard + 1);
        }, 2500);
        break;

      case 8:
        const form = document.querySelector('.card-8 form');
        if (form) {
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.showCard(this.currentCard + 1);
          });
        }
        break;
    }
  }

  setupEventListeners() {
    const getStartedButton = document.getElementById('get-started');
    if (getStartedButton) {
      getStartedButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.showCard(1);
      });
    }

    document.addEventListener('click', (e) => {
      const nextButton = e.target.closest('[sk-action="next:click"]');
      if (nextButton && !nextButton.classList.contains('inactive')) {
        if (this.currentCard < this.totalCards - 1) {
          this.showCard(this.currentCard + 1);
        }
      }
    });

    document.addEventListener('click', (e) => {
      const prevButton = e.target.closest('[sk-action="previous:click"]');
      if (prevButton && this.currentCard > 0) {
        this.showCard(this.currentCard - 1);
      }
    });

    const preTestQuestions = document.getElementById('pre-test-questions');
    if (preTestQuestions) {
      preTestQuestions.addEventListener('change', () => {
        this.checkConditionsAndEnableNext(1);
      });
    }

    const checkboxes = {
      'im-in-a-quiet-place': 2,
      'headphones-on': 3,
      'sound-comfortable': 4
    };

    Object.entries(checkboxes).forEach(([id, cardNumber]) => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.addEventListener('change', () => {
          this.checkConditionsAndEnableNext(cardNumber);
        });
      }
    });

    // Handle clicks on .radio-button-wrap_ht
    /*document.querySelectorAll('.radio-button-wrap_ht').forEach(button => {
      button.addEventListener('click', (e) => {
        const card = e.target.closest('[sk-target^="card-"]'); // Identify the card
        if (card) {
          const checkbox = card.querySelector('.rb_ht');
          if (checkbox) {
            checkbox.checked = true; // Activate checkbox
            checkbox.dispatchEvent(new Event('change')); // Trigger change event
          }
        }
      });
    });*/
    
document.querySelectorAll('.radio-button-wrap_ht, .rb_ht').forEach(element => {
  element.addEventListener('click', (e) => {
    const card = e.target.closest('[sk-target^="card-"]');
    if (card) {
      const checkbox = card.querySelector('.rb_ht');
      if (checkbox) {
        // Toggle the checked state
        checkbox.checked = !checkbox.checked;
        // Dispatching a 'change' event in case it is needed by another listener
        checkbox.dispatchEvent(new Event('change'));
      }
    }
  });
});
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cardManager = new CardManager();
});