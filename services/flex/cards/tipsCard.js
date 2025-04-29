const { bubble } = require('../base');
const { quoteBox } = require('../blocks');
const { headerBox } = require('../blocks');
const { footerBox } = require('../blocks');
const { ghostButton } = require('../base');
const { COLORS } = require('../base/colors');

function tipsCard({
  title = 'Mini Tip:',
  subtitle = 'Why Positivity Can Sometimes Hurts',
  quote = '“That sounds hard. I’m here if you need me.”',
  quoteColor,
//   quoteMarkColor,
  startColor,
  endColor,
  ctaLabel = 'Save this tip',
  ctaData = 'save_this_tip'
}) {
  return bubble({
    header: headerBox(title, subtitle),
    body: quoteBox({ 
      quote, 
      quoteColor: quoteColor || COLORS.brand, 
    //   quoteMarkColor: quoteMarkColor || COLORS.kind, 
      startColor: startColor || COLORS.light, 
      endColor: endColor || COLORS.light 
    }),
    footer: footerBox({
      direction: 'horizontal',
      contents: [ghostButton({ label: ctaLabel, data: ctaData, color: COLORS.grey })]
    })
  });
}

module.exports = { tipsCard };
