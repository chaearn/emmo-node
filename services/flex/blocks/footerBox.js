const { box } = require('../base/box');
const { ctaButton } = require('../base/button');
const { COLORS } = require('../base');

function footerBox({
  buttons = [],
  layout = 'vertical',
  spacing = 'sm',
  color = COLORS.brand,
  flex = 0
}) {
  return box({
    layout,
    spacing,
    contents: buttons.map(btn => ctaButton({ ...btn, color })),
    flex
  });
}

module.exports = { footerBox };
