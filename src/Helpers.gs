function orderIsOpen() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty("ordering") == "open";
}

function userHasExistingOrder(personName) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var keys = scriptProperties.getKeys();
  for(var i = 0; i < keys.length; i++) {
    if (keys[i].startsWith(personName)) {
      return true;
    }
  }
  return false;
}

function appendPersonOrder(personName, order) {
  var orderNumber = getNumberOfOrders(personName, order);
  orderNumber += 1;
  return addOrder(personName+orderNumber, order);
}

function getNumberOfOrders(personName, order) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var keys = scriptProperties.getKeys();
  var orders = 0;
  for(var i = 1; i < keys.length; i++) {
    if (keys[i].startsWith(personName)) {
      orders += 1;
    }
  }
  return orders;
}

function containsNumber(value) {
  return /\d/.test(myString);
}

function parseOrder(order) {
  var orderDict = getOrderDictionary();
  var orderArgs = order.split(" ");
  
  var orderList = getOrderObject(orderArgs, orderDict);
  
  if(!orderList) {
    return "invalid order";
  }
  var orderMessage = " ";
  
  var orderName = orderList[0];
  var orderObject = orderList[1];
  
  orderMessage += orderName + " ";
  var price = orderObject["price"];
  
  if (requiresMeat(orderObject)) {
    var meatList = getMeat(orderObject, orderArgs);
    if(!meatList){
      return "meat required";
    }
    var meatName = meatList[0];
    var meatPrice = meatList[1];
    
    orderMessage += " " + meatName + " ";
    price += meatPrice;
  }
  
  // INSERT FUNCTION FOR SPICE
  var spiceName = getSpiceName(orderArgs);
  if (spiceName == null) {
    orderMessage += "mild ";
  } else {
    orderMessage += spiceName + " ";
  }
  
  if (requiresPortionPrice(orderObject)) {
    var portionList = getPortion(orderObject, orderArgs);
    if(!portionList){
      var portionName = " lunch ";
      var portionPrice = 0;
    } else{
      var portionName = portionList[0];
      var portionPrice = portionList[1];
    }
    
    orderMessage += portionName;
    price += portionPrice;
  }
  
  if (requiresRice(orderObject)) {
    var riceList = getRice(orderObject, orderArgs);
    if(riceList == null) {
      orderMessage += " with white rice ";
    } else {
      if (riceList[0] == "white_rice") {
        orderMessage += " with " + riceList[0] + " ";
        price += riceList[1];
      } else {
        orderMessage += " with " + riceList[0] + " ";
        price += riceList[1];
      }
    }
  }
  
  return orderMessage + "$" + price + "\n";
}

function getOrderObject(orderArgs, orderDict) {
  for (var i = 0; i < orderArgs.length; i++) {
    var arg = orderArgs[i];
    console.log("the arg is " + arg);
    if (orderDict.hasOwnProperty(arg.toString())) {
      var orderObject = orderDict[arg];
      return [arg, orderObject];
    }
  }
  return null;
}

function getMeat(orderObject, orderArgs) {
  var meatDict = orderObject["meatPrice"];
  for (var i = 0; i < orderArgs.length; i++) {
    var arg = orderArgs[i];
    if (meatDict.hasOwnProperty(arg)) {
      var meatSelection = meatDict[arg];
      return [arg, meatSelection];
    }
  }
  return null;
}

function getPortion(orderObject, orderArgs) {
  var portionDict = orderObject["portionPrice"];
  for (var i = 0; i < orderArgs.length; i++) {
    var arg = orderArgs[i];
    if (portionDict.hasOwnProperty(arg)) {
      var portionSelection = portionDict[arg];
      return [arg, portionSelection];
    }
  }
  return null;
}

function getMeatList() {
  return ["chicken", "beef", "pork", "tofu", "shrimp", "seafood"];
}

function getSpiceName(orderArgs) {
  var spicesList = getSpiceList();
  for (var i = 0; i < orderArgs.length; i++) {
    var arg = orderArgs[i];
    if (spicesList.includes(arg)) {
      return arg;
    }
  }
  return null;
}

function getRice(orderObject, orderArgs) {
  var riceList = orderObject.rice;
  for (var i = 0; i < orderArgs.length; i++) {
    var arg = orderArgs[i];
    if (riceList.hasOwnProperty(arg)) {
      return [arg, riceList[arg]];
    }
  }
  return null;
}

function getSpiceList() {
  return ["mild", "medium", "hot", "on fire"];
}

function requiresMeat(orderObject) {
  return orderObject.hasOwnProperty("meatPrice");
}

function requiresPortionPrice(orderObject) {
  return orderObject.hasOwnProperty("portionPrice");
}

function requiresRice(orderObject) {
  return orderObject.rice !== undefined;
}

function getOrderDictionary() {
  var orderDict = {};
  var meatPriceDict = {
    "chicken": 0,
    "beef": 0,
    "pork": 0,
    "tofu": 0,
    "shrimp": 1,
    "seafood": 1
  };
  var portionPriceDict = {
    "lunch": 0,
    "dinner": 1
  };
  
  var normalOrders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 48, 50, 56];
  var meatlessOrders = [11, 14, 15, 16, 17, 18, 47, 49, 41, 42];
  
  for (var i in normalOrders) { 
    orderDict[normalOrders[i]+""] = { "price": 9.75, "meatPrice": meatPriceDict, "portionPrice": portionPriceDict, spiceRequired: true }; 
  }
  for (var i in meatlessOrders) { 
    orderDict[meatlessOrders[i]+""] = { "price": 9.75, "portionPrice": portionPriceDict, spiceRequired: true }; 
  }
  orderDict["43"] = { "price": 10.75, "portionPrice": portionPriceDict, spiceRequired: true };
  orderDict["44"] = { "price": 10.75, "portionPrice": portionPriceDict, spiceRequired: true }; 
  orderDict["45"] = { "price": 14.75, spiceRequired: true };
  orderDict["46"] = { "price": 14.75, spiceRequired: true };
  orderDict["Thai_Iced_Tea"] = { "price": 2.50, spiceRequired: false };
  orderDict["Thai_Iced_Coffee"] = { "price": 2.50, spiceRequired: false };
  
  orderDict["53"] = { "price": 11.75, spiceRequired: true };
  orderDict["55"] = { "price": 11.75, spiceRequired: true };
  orderDict["27"] = { "price": 10.75, "portionPrice": portionPriceDict };
  orderDict["51"] = { "price": 9.75, spiceRequired: true };
  orderDict["52"] = { "price": 10.75, spiceRequired: true };
  
  orderDict["54"] = { "price": 13.75, spiceRequired: true };
  
  // A Items
  orderDict["a1"] = { "price": 1.50, spiceRequired: false };
  orderDict["a2"] = { "price": 1.50, spiceRequired: false };
  orderDict["a4"] = { "price": 6.25, spiceRequired: false };
  orderDict["a6"] = { "price": 6.25, spiceRequired: true };
  orderDict["a3"] = { "price": 4.75, spiceRequired: false };
  orderDict["a5"] = { "price": 5.95, spiceRequired: true };
  orderDict["a7"] = { "price": 9.95, spiceRequired: true };
  orderDict["a8"] = { "price": 10.95, spiceRequired: true };
  orderDict["a9"] = { "price": 6.50, spiceRequired: true };
  orderDict["a10"] = { "price": 8.25, spiceRequired: true };
  orderDict["a11"] = { "price": 8.25, spiceRequired: true };
  orderDict["a12"] = { "price": 4.25, spiceRequired: true };
  
  // S Items
  orderDict["s1"] = { "price": 4.25, "meatPrice": meatPriceDict, spiceRequired: true };
  orderDict["s2"] = { "price": 4.25, "meatPrice": meatPriceDict, spiceRequired: true };
  orderDict["S3"] = { "price": 4.25, spiceRequired: true };
  orderDict["S4"] = { "price": 4.25, spiceRequired: true };
  orderDict["s5"] = { "price": 4.25, spiceRequired: true };
  
  // Beverages and Desserts
  
  orderDict["canned_soda"] = { "price": 1.50, spiceRequired: false };
  orderDict["hot_tea"] = { "price": 1.25, spiceRequired: false };
  orderDict["coconut_ice_cream"] = { "price": 3.00, spiceRequired: false };
  
  // With or without rice
  var ricePriceDict = {
    "white_rice": 0,
    "fried_rice": 1
  }
  for (var i = 1; i <=16; i++) { orderDict[i+""].rice = ricePriceDict; }
  
  var cheapRiceDict = {
    "white_rice": 0,
    "fried_rice": 0
  }
  for ( var i = 17; i <= 27; i++) { orderDict[i+""].rice = cheapRiceDict; }
 
  return orderDict;
}
