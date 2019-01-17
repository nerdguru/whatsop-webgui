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

// Function for icon color
function iconColor(color) {
  if (color == 'green')
    return '<div class="timeline__icon timeline--success"></div>';

  if (color == 'blue')
    return '<div class="timeline__icon timeline--info"></div>';

  if (color == 'yellow')
    return '<div class="timeline__icon timeline--warning"></div>';

  if (color == 'red')
    return '<div class="timeline__icon timeline--danger"></div>';

  return '<div class="timeline__icon"></div>';
}

// Function for title color
function titleColor(color) {
  if (color == 'green')
    return '<div class="text-bold text-success">';

  if (color == 'blue')
    return '<div class="text-bold text-blue">';

  if (color == 'yellow')
    return '<div class="text-bold text-warning">';

  if (color == 'red')
    return '<div class="text-bold text-danger">';

  return '<div class="text-bold">';
}

// Function for item insertion
function insertItem(timestamp, title, description, color) {
  var retVal = '';
  retVal += '<div class="timeline__item">';
  retVal += iconColor(color);
  retVal += '<div class="timeline__time">' + timestamp + '</div>';
  retVal += '<div class="timeline__content">';
  retVal += titleColor(color) + title + '</div>';
  retVal += '<div>' + description + '</div>';
  retVal += '</div>';
  retVal += '</div>';
  return retVal;
}

// Function for current date/time
function now() {
  var n = new Date();
  var retVal = '';
  retVal = n.getFullYear() + '-' + (n.getMonth() + 1) + '-' + n.getDate();
  retVal += ' ' + n.getHours() + ':' + n.getMinutes() + ':' + n.getSeconds();
  return retVal;
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
        $('#timeline_list').prepend(insertItem(now(),
                            msg.message.title, msg.message.description, msg.message.description));
      },

    presence: function (presenceEvent) {
        // handle presence
      },
  });

console.log('Subscribing to ' + channelName);
pubnub.subscribe({
    channels: [channelName],
  });

if (testMode) {
  // Insert the buttons
  $('#form-area').append('<button id="test" class="btn btn--secondary">test</button>');
  $('#form-area').append('<button id="clear" class="btn btn--negative">clear</button>');

  // Map the test button
  $('#test').on('click', function () {
    publishSampleMessage(channelName, 'oh wait', 'I am back');
  });

  // Map the clear button
  $('#clear').on('click', function () {
    $('#timeline_list').empty();
  });
}

// Map the submit button
$('#submit').on('click', function () {
  publishSampleMessage(channelName, 'Command Sent',
          document.getElementById('input-textarea-multiple').value);
  document.getElementById('input-textarea-multiple').value = '';
});
