const { bubble, image, box, titleText, bodyText, ctaButton } = require('../base');

/**
 * Creates a bubble with an image, title, body text, and CTA button.
 * @param {Object} options
 * @param {string} options.imageUrl - URL of the hero image
 * @param {string} options.title - Title text
 * @param {string} options.text - Body text
 * @param {Object} options.ctaAction - Full LINE action object for the CTA
 * @param {string} [options.ctaColor] - CTA button color
 */


function imageCTA({ imageUrl, title, text, ctaAction, ctaColor }) {
  return bubble({
    hero: image(imageUrl),
    body: box({
      layout: 'vertical',
      contents: [
        titleText(title),
        bodyText(text)
      ],
      spacing: 'md',
      offsetTop: '4px'
    }),
    footer: box({
      layout: 'vertical',
      contents: [
        ctaButton({ action: ctaAction, color: ctaColor })
      ],
      spacing: 'sm',
      flex: 0
    })
  });
}

module.exports = {
  imageCTA
};

/**
 * Examples of ctaAction:
 * 
 * Postback button:
 * ctaAction: {
 *   type: 'postback',
 *   label: 'Start',
 *   data: 'startLesson1',
 *   displayText: 'Start Lesson 1'
 * }
 * 
 * URI button (e.g., open LIFF app):
 * ctaAction: {
 *   type: 'uri',
 *   label: 'Open App',
 *   uri: 'https://liff.line.me/your-liff-id'
 * }
 * 
 * Message button:
 * ctaAction: {
 *   type: 'message',
 *   label: 'Say Hi',
 *   text: 'Hi there!'
 * }
 */