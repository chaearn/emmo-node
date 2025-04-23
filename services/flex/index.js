const base = require('./base');
const blocks = require('./blocks');
const cards = require('./cards');
const bubbles = require('./bubbles');

module.exports = {
  ...base,
  ...blocks,
  ...cards,
  ...bubbles
};