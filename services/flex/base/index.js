const bubble = require('./bubble');
const box = require('./box');
const image = require('./image');
const text = require('./text');
const button = require('./button');
const colors = require('./colors');

module.exports = {
    ...bubble,
    ...box,
    ...image,
    ...text,
    ...button,
    COLORS: colors.COLORS
};
