// Function for publishing
function publishSampleMessage(c, t, d) {
  var publishConfig = {
        channel: c,
        message: {
            title: t,
            description: d,
          },
      };

  pubnub.publish(publishConfig, function (status, response) {
        console.log(status, response);
      });
}

// Set up the channel connection
pubnub = new PubNub({
    publishKey: pubKey,
    subscribeKey: subKey,
  });

pubnub.addListener({
    status: function (statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory') {
          console.log('Connected to ' + channelName);
        }
      },

    message: function (msg) {
        console.log(msg.message.title);
        console.log(msg.message.description);
      },

    presence: function (presenceEvent) {
        // handle presence
      },
  });

console.log('Subscribing to ' + channelName);
pubnub.subscribe({
    channels: [channelName],
  });

// Map the test button
$('#test').on('click', function () {
  publishSampleMessage(channelName, 'oh wait', 'I am back');
});
