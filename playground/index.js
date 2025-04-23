const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const CHANNEL_ACCESS_TOKEN = '9hlTIdo7qeKiA7EQUR6sgYS9HiuKFMFgGDZ9ETDUVV6fOq7uN3ms4ybA4NICpM0hKSfwXdiwPF6oyAllezSmARaCuN02uPhaMw/m1EnBmrtqIapSUynKopo93HUDPksQRlsKQyDwsZzBoCzroz8ptAdB04t89/1O/w1cDnyilFU='; // 👈 แก้เป็นของจริง

app.use(express.json());

app.post('/webhook', async (req, res) => {
  const events = req.body.events;

  for (let event of events) {
    if (event.type === 'follow') {
      const userId = event.source.userId;

      const message = {
        to: userId,
        messages: [
          {
            type: 'flex',
            altText: 'Welcome to Emmo!',
            contents: {
              type: 'bubble',
              hero: {
                type: 'image',
                url: 'https://cdn.prod.website-files.com/68012eaec3b0222963a7e735/6801301b6c621cc9553d0f22_Frame%2014.png',
                size: 'full',
                aspectRatio: '26:15',
                aspectMode: 'cover',
                action: {
                  type: 'uri',
                  uri: 'https://line.me/'
                }
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'Hey, It’s Emmo here.',
                    weight: 'bold',
                    size: 'xl'
                  },
                  {
                    type: 'box',
                    layout: 'vertical',
                    contents: [
                      {
                        type: 'text',
                        text: 'Think of me like a friend who helps you show up when someone you love is hurting. We’ll learn, practice, and figure it out together — one reply at a time.',
                        wrap: true
                      }
                    ],
                    offsetTop: '4px'
                  }
                ]
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'button',
                    style: 'primary',
                    height: 'sm',
                    action: {
                      type: 'postback',
                      label: "Let's Start",
                      data: 'Start'
                    },
                    color: '#4F31D6'
                  }
                ],
                flex: 0
              }
            }
          }
        ]
      };

      try {
        await axios.post('https://api.line.me/v2/bot/message/push', message, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 9hlTIdo7qeKiA7EQUR6sgYS9HiuKFMFgGDZ9ETDUVV6fOq7uN3ms4ybA4NICpM0hKSfwXdiwPF6oyAllezSmARaCuN02uPhaMw/m1EnBmrtqIapSUynKopo93HUDPksQRlsKQyDwsZzBoCzroz8ptAdB04t89/1O/w1cDnyilFU=`
          }
        });
        console.log('✅ Flex message sent to', userId);
      } catch (error) {
        console.error('❌ Failed to send message:', error.response?.data || error.message);
      }
    }


    // 🟡 ตอบกลับเมื่อกดปุ่ม postback: 'Start'
    if (event.type === 'postback') {
        const userId = event.source.userId;
        const data = event.postback.data;
  
        if (data === 'Start') {
            try {
                // 1️⃣ ส่งข้อความแบบธรรมดา
                await axios.post('https://api.line.me/v2/bot/message/push', {
                  to: userId,
                  messages: [
                    {
                      type: 'text',
                      text: 'LEVEL 1: Listening Gently'
                    },
                    {
                      type: 'text',
                      text: '“Sometimes the kindest thing we can do is just be there.”'
                    }
                  ]
                }, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
                  }
                });
            
                // 2️⃣ ส่ง Flex message แบบ carousel
                await axios.post('https://api.line.me/v2/bot/message/push', {
                  to: userId,
                  messages: [
                    {
                      type: 'flex',
                      altText: 'Choose your first lesson',
                      contents: {
                        "type": "carousel",
                        "contents": [
                          {
                            "type": "bubble",
                            "size": "hecto",
                            "header": {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "vertical",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "sm",
                                      "gravity": "top",
                                      "weight": "bold",
                                      "flex": 1,
                                      "text": "LESSON 1:",
                                      "wrap": true
                                    },
                                    {
                                      "type": "text",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "xl",
                                      "gravity": "top",
                                      "weight": "bold",
                                      "flex": 1,
                                      "text": "What Not to Say",
                                      "wrap": true
                                    }
                                  ],
                                  "paddingBottom": "20px"
                                }
                              ],
                              "paddingTop": "19px",
                              "paddingAll": "12px",
                              "paddingBottom": "0px",
                              "background": {
                                "type": "linearGradient",
                                "angle": "0deg",
                                "startColor": "#00000050",
                                "endColor": "#00000000"
                              },
                              "height": "120px"
                            },
                            "body": {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "vertical",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "0%",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "xxs",
                                      "gravity": "bottom",
                                      "margin": "lg"
                                    },
                                    {
                                      "type": "box",
                                      "layout": "vertical",
                                      "contents": [
                                        {
                                          "type": "box",
                                          "layout": "vertical",
                                          "contents": [
                                            {
                                              "type": "filler"
                                            }
                                          ],
                                          "width": "0%",
                                          "backgroundColor": "#4F31D680",
                                          "height": "6px",
                                          "cornerRadius": "md"
                                        }
                                      ],
                                      "backgroundColor": "#9FD8E36E",
                                      "height": "6px",
                                      "margin": "sm",
                                      "cornerRadius": "md"
                                    }
                                  ],
                                  "paddingBottom": "10px",
                                  "flex": 1,
                                  "justifyContent": "flex-end"
                                },
                                {
                                  "type": "button",
                                  "action": {
                                    "type": "postback",
                                    "data": "lesson1",
                                    "label": "Start Lesson 1",
                                    "displayText": "Start Lesson 1"
                                  },
                                  "style": "primary",
                                  "color": "#4F31D6"
                                }
                              ],
                              "spacing": "md",
                              "paddingAll": "12px",
                              "background": {
                                "type": "linearGradient",
                                "angle": "0deg",
                                "startColor": "#00000099",
                                "endColor": "#00000050"
                              }
                            },
                            "styles": {
                              "header": {
                                "backgroundColor": "#4F31D6"
                              },
                              "body": {
                                "backgroundColor": "#4F31D6"
                              },
                              "footer": {
                                "separator": false
                              }
                            }
                          },
                          {
                            "type": "bubble",
                            "size": "hecto",
                            "header": {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "vertical",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "sm",
                                      "gravity": "top",
                                      "weight": "bold",
                                      "flex": 1,
                                      "text": "LESSON 2:",
                                      "wrap": true
                                    },
                                    {
                                      "type": "text",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "xl",
                                      "gravity": "top",
                                      "weight": "bold",
                                      "flex": 1,
                                      "text": "Holding Space",
                                      "wrap": true
                                    }
                                  ],
                                  "paddingBottom": "20px"
                                }
                              ],
                              "paddingTop": "19px",
                              "paddingAll": "12px",
                              "paddingBottom": "0px",
                              "background": {
                                "type": "linearGradient",
                                "angle": "0deg",
                                "startColor": "#00000050",
                                "endColor": "#00000000"
                              },
                              "height": "120px"
                            },
                            "body": {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "vertical",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "0%",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "xxs",
                                      "gravity": "bottom",
                                      "margin": "lg"
                                    },
                                    {
                                      "type": "box",
                                      "layout": "vertical",
                                      "contents": [
                                        {
                                          "type": "box",
                                          "layout": "vertical",
                                          "contents": [
                                            {
                                              "type": "filler"
                                            }
                                          ],
                                          "width": "0%",
                                          "backgroundColor": "#4F31D680",
                                          "height": "6px",
                                          "cornerRadius": "md"
                                        }
                                      ],
                                      "backgroundColor": "#9FD8E36E",
                                      "height": "6px",
                                      "margin": "sm",
                                      "cornerRadius": "md"
                                    }
                                  ],
                                  "paddingBottom": "10px",
                                  "flex": 1,
                                  "justifyContent": "flex-end"
                                },
                                {
                                  "type": "button",
                                  "action": {
                                    "type": "postback",
                                    "label": "Start Lesson 2",
                                    "data": "lesson2",
                                    "displayText": "Start Lesson 2"
                                  },
                                  "style": "primary",
                                  "color": "#4F31D6"
                                }
                              ],
                              "spacing": "md",
                              "paddingAll": "12px",
                              "background": {
                                "type": "linearGradient",
                                "angle": "0deg",
                                "startColor": "#00000099",
                                "endColor": "#00000050"
                              }
                            },
                            "styles": {
                              "header": {
                                "backgroundColor": "#4F31D6"
                              },
                              "body": {
                                "backgroundColor": "#4F31D6"
                              },
                              "footer": {
                                "separator": false
                              }
                            }
                          },
                          {
                            "type": "bubble",
                            "size": "hecto",
                            "header": {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "vertical",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "sm",
                                      "gravity": "top",
                                      "weight": "bold",
                                      "flex": 1,
                                      "text": "LESSON 3:",
                                      "wrap": true
                                    },
                                    {
                                      "type": "text",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "xl",
                                      "gravity": "top",
                                      "weight": "bold",
                                      "flex": 1,
                                      "text": "Presence > Perfect Words",
                                      "wrap": true
                                    }
                                  ],
                                  "paddingBottom": "20px"
                                }
                              ],
                              "paddingTop": "19px",
                              "paddingAll": "12px",
                              "paddingBottom": "0px",
                              "background": {
                                "type": "linearGradient",
                                "angle": "0deg",
                                "startColor": "#00000050",
                                "endColor": "#00000000"
                              },
                              "height": "120px"
                            },
                            "body": {
                              "type": "box",
                              "layout": "vertical",
                              "contents": [
                                {
                                  "type": "box",
                                  "layout": "vertical",
                                  "contents": [
                                    {
                                      "type": "text",
                                      "text": "0%",
                                      "color": "#ffffff",
                                      "align": "start",
                                      "size": "xxs",
                                      "gravity": "bottom",
                                      "margin": "lg"
                                    },
                                    {
                                      "type": "box",
                                      "layout": "vertical",
                                      "contents": [
                                        {
                                          "type": "box",
                                          "layout": "vertical",
                                          "contents": [
                                            {
                                              "type": "filler"
                                            }
                                          ],
                                          "width": "0%",
                                          "backgroundColor": "#4F31D680",
                                          "height": "6px",
                                          "cornerRadius": "md"
                                        }
                                      ],
                                      "backgroundColor": "#9FD8E36E",
                                      "height": "6px",
                                      "margin": "sm",
                                      "cornerRadius": "md"
                                    }
                                  ],
                                  "paddingBottom": "10px",
                                  "flex": 1,
                                  "justifyContent": "flex-end"
                                },
                                {
                                  "type": "button",
                                  "action": {
                                    "type": "postback",
                                    "label": "Start Lesson 3",
                                    "data": "lesson3",
                                    "displayText": "Start Lesson 3"
                                  },
                                  "style": "primary",
                                  "color": "#4F31D6"
                                }
                              ],
                              "spacing": "md",
                              "paddingAll": "12px",
                              "background": {
                                "type": "linearGradient",
                                "angle": "0deg",
                                "startColor": "#00000099",
                                "endColor": "#00000050"
                              }
                            },
                            "styles": {
                              "header": {
                                "backgroundColor": "#4F31D6"
                              },
                              "body": {
                                "backgroundColor": "#4F31D6"
                              },
                              "footer": {
                                "separator": false
                              }
                            }
                          }
                        ]
                      }
                    }
                  ]
                }, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer 9hlTIdo7qeKiA7EQUR6sgYS9HiuKFMFgGDZ9ETDUVV6fOq7uN3ms4ybA4NICpM0hKSfwXdiwPF6oyAllezSmARaCuN02uPhaMw/m1EnBmrtqIapSUynKopo93HUDPksQRlsKQyDwsZzBoCzroz8ptAdB04t89/1O/w1cDnyilFU=`
              }
            });
  
            console.log('📩 Replied to Start postback with Level + Carousel');
          } catch (error) {
            console.error('❌ Error replying to Start postback:', error.response?.data || error.message);
          }
        }
      }
    
    
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});