// Function for publishing
function publishSampleMessage(c, d, t, cmd) {
  var publishConfig = {
        channel: c,
        message: {
            device: d,
            type: t,
            command: cmd,
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
  retVal = n.getFullYear() + '-';
  retVal += (n.getMonth() + 1).toLocaleString('en', { minimumIntegerDigits: 2 });
  retVal += '-' + n.getDate().toLocaleString('en', { minimumIntegerDigits: 2 });
  retVal += ' ' + n.getHours().toLocaleString('en', { minimumIntegerDigits: 2 });
  retVal += ':' + n.getMinutes().toLocaleString('en', { minimumIntegerDigits: 2 });
  retVal += ':' + n.getSeconds().toLocaleString('en', { minimumIntegerDigits: 2 });
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
        console.log(msg.message.device);
        console.log(msg.message.type);
        console.log(msg.message.command);
        $('#timeline_list').prepend(insertItem(now(),
                            'A message', msg.message.command, 'gray'));
      },

  });

console.log('Subscribing to ' + channelName);
pubnub.subscribe({
    channels: [channelName],
  });

$('#test').on('click', function () {
  publishSampleMessage(channelName, 'device', 'type', 'command');
});

// Map the clear button
$('#clear').on('click', function () {
  $('#timeline_list').empty();
});

// Possibly hide the test row
if (!testMode) {
  document.getElementById('test-row').style.display = 'none';
}

// Map the submit button
$('#submit').on('click', function () {
  publishSampleMessage(channelName,
                       document.getElementById('input-device').value,
                       document.getElementById('input-type').value,
                       document.getElementById('input-command').value);
  var msg = '<div>device: ' + document.getElementById('input-device').value + '</div>';
  msg += '<div>type: ' + document.getElementById('input-type').value + '</div>';
  msg += '<div>command: ' + document.getElementById('input-command').value + '</div>';
  $('#timeline_list').prepend(insertItem(now(),
                      'Command Sent', msg, 'gray'));
  document.getElementById('input-command').value = '';
});
