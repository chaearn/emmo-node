function heroImage(url) {
    return {
    type: 'image',
    url,
    size: 'full',
    aspectRatio: '26:15',
    aspectMode: 'cover',
    action: {
        type: 'uri',
        uri: 'https://line.me/' // default action, แก้ใหม่ตอนใช้จริงได้
    }
    };
}

module.exports = { 
    heroImage
};