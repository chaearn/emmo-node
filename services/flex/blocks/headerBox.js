const { titleText, subtitleText } = require('../base/text');
const { box } = require('../base/box');
const { COLORS } = require('../base/color');

function headerBox({ title, subtitle, backgroundColor = COLORS.brand }) {
  return box({
    layout: 'vertical',
    contents: [
      titleText(title),
      subtitleText(subtitle)
    ],
    paddingTop: '19px',
    paddingAll: '12px',
    paddingBottom: '0px',
    backgroundColor,
    height: '120px'
  });
}

module.exports = { headerBox };
