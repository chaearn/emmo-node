const { COLORS } = require('../base');
const { box } = require('../base');
const { bodyText } = require('../base');

function quoteBox(
  quoteText,
  quoteColor = COLORS.white,
  quoteMarkColor = COLORS.kind,
  startColor = COLORS.dark,
  endColor = COLORS.darkFaded
) {
  return box({
    layout: 'vertical',
    spacing: 'sm',
    paddingAll: '20px',
    background: {
      type: 'linearGradient',
      angle: '0deg',
      startColor,
      endColor
    },
    contents: [
      bodyText('“', { color: quoteMarkColor, size: 'sm', align: 'start' }),
      bodyText(quoteText, { color: quoteColor, size: 'lg', align: 'center', wrap: true }),
      bodyText('”', { color: quoteMarkColor, size: 'sm', align: 'end' })
    ]
  });
}

module.export = { quoteBox };
