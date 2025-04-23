const { box } = require('../base');
const { COLORS } = require('../base');

function progressBar({ percent = 0, fillColor = COLORS.brandFaded, baseColor = COLORS.lightFaded }) {
  return box({
    layout: 'vertical',
    contents: [
      box({
        layout: 'vertical',
        contents: [
          {
            type: 'filler'
          }
        ],
        width: `${percent}%`,
        backgroundColor: fillColor,
        height: '6px',
        cornerRadius: 'md'
      })
    ],
    backgroundColor: baseColor,
    height: '6px',
    margin: 'sm',
    cornerRadius: 'md'
  });
}

module.exports = { progressBar };
