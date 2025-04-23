const { bubble } = require('../base');
const { quoteBox } = require('../blocks');
const { headerBox } = require('../blocks');
const { footerBox } = require('../blocks');
const { ghostButton } = require('../base');
const { COLORS } = require('../base/colors');

function quoteCard({
  title = 'Kind Replies Collection',
  subtitle = 'These are all the good ones! Save them for later when you need it!',
  quote = '“That sounds hard. I’m here if you need me.”',
  quoteColor,
  quoteMarkColor,
  startColor,
  endColor,
  ctaLabel = 'Save this reply',
  ctaData = 'save_this_reply'
}) {
  return bubble({
    header: headerBox(title, subtitle),
    body: quoteBox({ 
      quote, 
      quoteColor: quoteColor || COLORS.white, 
      quoteMarkColor: quoteMarkColor || COLORS.kind, 
      startColor: startColor || COLORS.dark, 
      endColor: endColor || COLORS.darkFaded 
    }),
    footer: footerBox({
      direction: 'horizontal',
      contents: [ghostButton({ label: ctaLabel, data: ctaData, color: COLORS.brand })]
    })
  });
}

module.exports = { quoteCard };
