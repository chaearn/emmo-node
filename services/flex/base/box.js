function box({ layout = 'vertical', contents = [], ...rest }) {
    return {
    type: 'box',
    layout,
    contents,
    ...rest
    };
}

module.exports = {
    box
};