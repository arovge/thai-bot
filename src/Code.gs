/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onMessage(event) {
  // menu test
  var name;
  var message;
  var isDM = event.space.type == "DM";
  if (isDM) {
    name = "You";
    if(event.message.text.substring(0, 10) != "@thai-bot ") {
      message = event.message.text;
    } else {
      message = event.message.text.substring(10);
    }
  } else {
    name = event.user.displayName;
    message = event.message.text.substring(10);
  }
  return handleMessage(event.user.displayName, message, isDM);
}

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onAddToSpace(event) {
  var message = "Welcome to thai-bot: the new, modern thai experience";

  return { "text": message };
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onRemoveFromSpace(event) {
  console.info("Bot removed from ",
      (event.space.name ? event.space.name : "this chat"));
}

function handleMessage (name, message, isDM) {
  var command = message.toLowerCase();
  if (command == "menu") {
      return { "text": getMenuLink() }
  }
  if (command == "surpriseme") {
    command = "order"
    message = "order 49 mild"
  }
  if (command == "listorders") {
    return { "text" : listOrders() };
  }
  if (command.substring(0,5) == "order") {
    return { "text" : addPersonOrder(name, message) };
  }
  if (command == "help") {
    return { "text": getHelpText() }
  }
  if(command == "openordering") {
    if(isDM) {
       return { "text" : "This command is not supported in direct messages. Use the tels-thai room instead" };
    }
    return { "text" : openOrdering(name) };
  }
  if(command == "lastcall") {
    if(isDM) {
       return { "text" : "This command is not supported in direct messages. Use the tels-thai room instead" };
    }
    return { "text" : lastCall() };
  }
  if(command == "closeordering") {
    if(isDM) {
       return { "text" : "This command is not supported in direct messages. Use the tels-thai room instead" };
    }
    return {
      "text" : closeOrdering()
    }
  }
  if (command == "clearallmyorders") {
    if(isDM) {
       return { "text" : "This command is not supported in direct messages. Use the tels-thai room instead" };
    }
    return {
      "text": clearCurrentUsersOrders(name)
    }
  }
  if (command == "amipog") {
    return { "text" : "you are pog champ" };
  }
  if (command == "execute order 66") {
    return { "text": "Yes my Lord" }
  }
  return { "text": "Command not supported :(" };
}
