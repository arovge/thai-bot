/**
 * COMMANDS
 * - listOrders
 *   Returns a list of the current orders registered
 *
 * - menu
 *   Returns a link to the menu
 *
 * - openOrdering [OPTIONAL END TIME]
 *   Opens the bot for ordering.
 *     Optional parameter for the concrete end time
 *     If supplied, will remind the chat when there is 5 minutes remaining
 *
 * - endOrdering
 *   Ends the ordering. Any orders after this are not added to the bot
 *   
 * - closeOrdering [TOTAL COST]
 *   Ends the curernt orders. Clears the list of orders
 *   Total cost will divide 
 *
 * - order [MENU ITEM] [HEAT LEVEL] [OPTIONAL PORTION = DEFAULT LUNCH] [ADDITIONAL NOTES]
 *   Adds a menu item based on number on menu (49), heat level (mild), portion size, and any additional notes
 *   
 * - help [OPTIONAL COMMAND TYPE]
 *   lists all available commands
 *     if a command type is specified, it'll instead return how that command is used
 */

function listOrders() {
  var scriptProperties = PropertiesService.getScriptProperties();
  if (orderIsOpen()) {
    return getAllOrders();
  } else {
    return "Sorry, there is no open order at this time."
  }
}

function getCompleteOrder() {
  return getAllOrders();
}

function getPersonOrder(person) {
  return getOrder(person);
}

function addPersonOrder(person, order) {
  order = order.substring(6);
  var scriptProperties = PropertiesService.getScriptProperties();
  if(orderIsOpen()) {
    let message = ""
    if (order.includes("49 mild")) {
      message += "Excellent choice sir. \n";
    }
    
    message += person + " ";
    order = parseOrder(order);
    
    if(order == "invalid order") {
      return "The order number you gave does not exist.";
    }
    if(order == "meat required"){
      return "You have to select a meat for this order.";
    }
    
    if (!userHasExistingOrder(person)) {
      message += " ordered" + addOrder(person, order);
    } else {
      message += " also ordered" + appendPersonOrder(person, order);
    }
    
    return message;
  } else {
    return "Ordering is not open right now, please wait for someone to open an order.\n" +
      "Or you may open one with `openOrdering`";
  }
}

function clearCurrentUsersOrders(name) {
  clearPersonsOrders(name)
  return "All orders for " + name + " have been cleared";
}

function openOrdering(person) {
  if(isOrderingOpen()){
    return "ordering has already been opened";
  }
  openOrderingProperty();
  return "<users/all> " + person + " has opened ordering, place your orders now!";
}

function closeOrdering() {
  if(!isOrderingOpen()){
    return "Ordering is not open.";
  }
  closeOrderingProperty();
  return "Ordering has closed, thanks for participating!\n" + getCompressedList();
}

function getCompressedList() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var keys = scriptProperties.getKeys();
  var orderDict = {};
  
  for (var i = 0; i < keys.length; i++) {
    if(keys[i] == "menu" || keys[i] == "ordering")
      continue;
    var orderText = scriptProperties.getProperty(keys[i]);
    if (!orderDict.hasOwnProperty(orderText))
      orderDict[orderText] = 0;
    orderDict[orderText] += 1;
  }
  
  var compressedMessage = "Compressed List of Orders: \n";
  var keys = Object.keys(orderDict);
  for (var i = 0; i < keys.length; i++) {
    compressedMessage += "\t - " + keys[i].trim() + " (x" + orderDict[keys[i]] + ")\n";
  }
  
  return compressedMessage;
}

function getHelpText() {
  let output = ""
  output += "`listOrders`\n"
  output += "\t- Returns a list of the current orders\n"
  output += "`menu`\n"
  output += "\t- Returns a link to the menu\n"
  output += "`openOrdering`\n"
  output += "\t- Opens the bot for ordering.\n"
  output += "`closeOrdering`\n"
  output += "\t- Ends the ordering. Any orders after this are not added to the bot\n"
  output += "\t- Clears list of orders and prints them out\n"
  output += "`order <order-info>`\n"
  output += "\t- This places an order with the text supplied\n"
  output += "`clearAllMyOrders`\n"
  output += "\t- This clears all of the orders set for the user that ordered\n"
  output += "`surpriseMe`\n"
  output += "\t- Places a surprise order for you!\n"
  output += "`help`\n"
  output += "\t- prints information for commands"
  return output
}
