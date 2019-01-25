// Set up the outbound channel connection
pubnubOut = new PubNub({
    publishKey: outPubKey,
    subscribeKey: outSubKey,
  });

// Set up the inbound channel connection
pubnubIn = new PubNub({
    publishKey: inPubKey,
    subscribeKey: inSubKey,
  });

// Function for publishing
function publishCommand(c, d, t, cmd) {
  var publishConfig = {
        channel: c,
        message: {
            device: d,
            type: t,
            command: cmd,
          },
      };

  pubnubOut.publish(publishConfig, function (status, response) {
        console.log('Outbound status: ' + JSON.stringify(status, null, 2));
        console.log('Outbound response: ' + JSON.stringify(response, null, 2));
      });
}

function fauxPublishResponse(c, t, m, s) {
  var publishConfig = {
        channel: c,
        message: {
            title: t,
            message: m,
            severity: s,
          },
      };

  pubnubIn.publish(publishConfig, function (status, response) {
        console.log('Faux inbound status: ' + JSON.stringify(status, null, 2));
        console.log('Faux inbound response: ' + JSON.stringify(response, null, 2));
      });
}

// Function mapping severity to color
function severity2color(severity) {
  if (severity == 'primary') {
    return 'blue';
  }

  if (severity == 'success') {
    return 'green';
  }

  if (severity == 'danger') {
    return 'red';
  }

  if (severity == 'warning') {
    return 'yellow';
  }

  return 'gray';
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

// Outbound Channel Listeners
pubnubOut.addListener({
    status: function (statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory') {
          console.log('Connected to ' + inChannelName);
        }
      },

    message: function (msg) {
        console.log('Outbound message confirmed: ' + JSON.stringify(msg.message, null, 2));
      },

  });

pubnubOut.subscribe({
    channels: [outChannelName],
  });

// Inbound Channel Listeners
pubnubIn.addListener({
    status: function (statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory') {
          console.log('Connected to ' + outChannelName);
        }
      },

    message: function (msg) {
        console.log('Inbound message received: ' + JSON.stringify(msg.message, null, 2));
        $('#timeline_list').prepend(insertItem(now(),
                            msg.message.title, msg.message.message, msg.message.severity));
      },

  });

pubnubIn.subscribe({
    channels: [inChannelName],
  });

// Test button mappings
$('#test').on('click', function () {
  fauxPublishResponse(inChannelName,
                      document.getElementById('input-title').value,
                      document.getElementById('input-message').value,
                      severity2color(document.getElementById('input-severity').value));
});

$('#clear').on('click', function () {
  $('#timeline_list').empty();
});

// Possibly hide the test row
if (!testMode) {
  document.getElementById('test-row').style.display = 'none';
}

// Map the submit button
$('#submit').on('click', function () {
  publishCommand(outChannelName,
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
