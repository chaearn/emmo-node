const { COLORS } = require('../base');
const { box } = require('../base');
const { bodyText } = require('../base');

function bodyBox(contents = [], startColor = COLORS.dark, endColor = COLORS.darkFaded) {
  return box({
    layout: 'vertical',
    contents,
    spacing: 'sm',
    paddingAll: '12px',
    background: {
      type: 'linearGradient',
      angle: '0deg',
      startColor,
      endColor
    }
  });
}

module.exports = {
  bodyBox
};
