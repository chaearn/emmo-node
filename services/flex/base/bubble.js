function bubble({ hero, header, body, footer, size = 'hecto', ...rest }) {
  return {
    type: 'bubble',
    size,
    ...(hero && { hero }),
    ...(header && { header }),
    ...(body && { body }),
    ...(footer && { footer }),
    ...rest
  };
}

module.exports = {
  bubble
};