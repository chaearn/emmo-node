function carouselBubbles(bubbles = []) {
    return {
      type: 'flex',
      altText: 'Choose your card',
      contents: {
        type: 'carousel',
        contents: bubbles
      }
    };
  }
  
  module.exports = { carouselBubbles };