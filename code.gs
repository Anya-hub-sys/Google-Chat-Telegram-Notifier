function testChatAccess() {
  try {
    // Attempt to list Chat spaces the account can access
    var response = Chat.Spaces.list();
    Logger.log('Success! Chat API is accessible.');
    Logger.log(JSON.stringify(response));
  } catch (e) {
    Logger.log('Error: ' + e.message);
  }
}
function testTelegram() {
  var token = 'Your token';
  var chatId = '917576428';
  var url = 'https://api.telegram.org/bot' + token + '/sendMessage';
  UrlFetchApp.fetch(url, {
    method: 'post',
    payload: { chat_id: chatId, text: 'Test from Apps Script' }
  });
}

function checkChatAndNotify() {
  var token = 'Your token';
  var chatId = '917576428';
  var myName = 'ayan das';

  var props = PropertiesService.getScriptProperties();
  var last = props.getProperty('lastCheck');
  var now = new Date().toISOString();

  if (!last) {
    props.setProperty('lastCheck', now);
    return;
  }

  var spaces = Chat.Spaces.list().spaces || [];

  for (var i = 0; i < spaces.length; i++) {
    var space = spaces[i];
    var isDM = space.spaceType === 'DIRECT_MESSAGE';

    try {
      var res = Chat.Spaces.Messages.list(space.name, {
        filter: 'createTime > "' + last + '"',
        pageSize: 25
      });
      var messages = res.messages || [];

      for (var j = 0; j < messages.length; j++) {
        var msg = messages[j];
        var text = msg.text || '';
        var sender = (msg.sender && msg.sender.displayName) || 'Someone';

        if (sender.toLowerCase() === myName) continue;

        var isNamed = text.toLowerCase().indexOf(myName) !== -1;
        var isAll = false;
        var notes = msg.annotations || [];
        for (var k = 0; k < notes.length; k++) {
          if (notes[k].type === 'USER_MENTION' &&
              notes[k].userMention && notes[k].userMention.type === 'ALL') {
            isAll = true;
          }
        }

        if (isDM || isNamed || isAll) {
          var label = isDM ? 'DM' : (isAll ? '@all' : 'Mention');
          var msgTime = Utilities.formatDate(
            new Date(msg.createTime), 'Asia/Kolkata', 'hh:mm a'
          );
          UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
            method: 'post',
            payload: {
              chat_id: chatId,
              text: '[' + msgTime + '] ' + label + ' from ' + sender + ': ' + text
            }
          });
        }
      }
    } catch (e) {
      Logger.log('Error in space ' + space.name + ': ' + e.message);
    }
  }

  props.setProperty('lastCheck', now);
}
