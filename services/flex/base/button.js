function ctaButton({ label, data, color = COLORS.brand }) {
    return {
    type: 'button',
    style: 'primary',
    height: 'sm',
    action: {
        type: 'postback',
        label,
        data,
        displayText: label
    },
    color
    };
}

function ghostButton({ label, data, color = COLORS.white }) {
    return {
        type: 'button',
        style: 'link',
        height: 'sm',
        action: {
            type: 'postback',
            label,
            data,
            displayText: label
        },
        color
    };
}

function saveButton({ label = 'Save', data = 'save', color = COLORS.brand }) {
    return {
        type: 'button',
        style: 'primary',
        height: 'sm',
        action: {
            type: 'postback',
            label,
            data,
            displayText: label
        },
        color
    };
}

module.exports = {
    ctaButton,
    ghostButton,
    saveButton
};