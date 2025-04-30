// const eventMSG = require('./events/eventMSG');
const eventLV = require('./events/eventLevel');
const eventFollow = require('./events/handleFollow');
// const handlePostback = require('./events/handlePostback');

module.exports = async function lineWebhook(req, res) {
  const events = req.body.events;

  for (let event of events) {
    if (event.type === 'follow') {
      await eventFollow(event);
    }

    if (event.type === 'postback') {
      await eventLV(event);
    }

    // if (event.type === 'message' && event.message.type === 'text') {
    //   await eventMSG(event);
    // }
  }

  res.status(200).send('OK');
};