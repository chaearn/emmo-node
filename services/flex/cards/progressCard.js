

const { bubble } = require('../../base');
const { image, titleText, bodyText, ctaButton } = require('../../base');
const { box, progressBar } = require('../../blocks');

/**
 * Creates a progress card bubble.
 *
 * @param {Object} options
 * @param {string} options.imageUrl - URL of the hero image
 * @param {string} options.title - Title text
 * @param {string} options.subtitle - Subtitle text
 * @param {string} options.body - Body text
 * @param {number} [options.progressPercent=0] - Progress percentage (0-100)
 * @param {string} options.ctaLabel - CTA button label
 * @param {string} options.ctaData - CTA postback data
 * @param {string} [options.ctaColor] - Optional CTA button color
 * @returns {Object} LINE Flex bubble object
 */
function progressCard({
  imageUrl,
  title,
  subtitle,
  body,
  progressPercent = 0,
  ctaLabel,
  ctaData,
  ctaColor
}) {
  return bubble({
    hero: image(imageUrl),
    header: box({
      layout: 'vertical',
      contents: [titleText(title), bodyText(subtitle)],
      backgroundColor: 'transparent',
      paddingAll: '12px',
      spacing: 'xs'
    }),
    body: box({
      layout: 'vertical',
      contents: [
        progressBar({ percent: progressPercent }),
        bodyText(body),
        ctaButton({ label: ctaLabel, data: ctaData, color: ctaColor })
      ],
      spacing: 'md',
      paddingAll: '12px'
    })
  });
}

module.exports = { progressCard };