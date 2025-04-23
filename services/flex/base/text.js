const { COLORS } = require('../../theme/colors');

function titleText(text, color = COLORS.white) {
    return {
        type: 'text',
        text,
        weight: 'bold',
        size: 'xl',
        color,
        wrap: true
    };
}

function subtitleText(text, color = COLORS.white) {
    return {
        type: 'text',
        text,
        size: 'sm',
        color,
        wrap: true
    };
}

function bodyText(text, size = 'xs', color = COLORS.white) {
    return {
        type: 'text',
        text,
        size,
        color,
        wrap: true
    };
}

module.exports = {
    titleText,
    subtitleText,
    bodyText
};
