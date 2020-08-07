function setMenuLink(newLink) {
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.setProperty("menu", newLink);
}

function getMenuLink() {
  var scriptProperties = PropertiesService.getScriptProperties();
  return "<" + scriptProperties.getProperty("menu") +"|here is the menu>";
}

function addOrder(personName, newOrder) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty(personName, newOrder);
  return scriptProperties.getProperty(personName);
}

function clearPersonsOrders(personName) {
  var scriptProperties = PropertiesService.getScriptProperties()
  var keys = scriptProperties.getKeys();
  keys.forEach(function(key) {
    console.log(key)
    if (key.startsWith(personName)) {
      scriptProperties.deleteProperty(key)
    }
  })
}

function getOrder(personName) {
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty(personName);
}

function getAllOrders() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var keys = scriptProperties.getKeys();
  var dict = {};
  
  var price = 0;
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] != "menu" && keys[i] != "ordering") {
      var name = keys[i].replace(/\d+/g, '');
      if(!dict[name]) {
        dict[name] = {orderText: "", price: 0};
      }
      var orderText = scriptProperties.getProperty(keys[i]);
      dict[name].orderText += "\t - " + orderText;
      var priceText = orderText.match(/[\$]([0-9]+\.*[0-9]*)/g)[0];
      dict[name].price += parseFloat(priceText.substring(1, priceText.length));
    }
  }
  
  var message = "The Following Is A Complete List of Orders: \n";
  for(var key in dict) {
    message += key + ": $" + dict[key].price + "\n";
    message += dict[key].orderText;
  }
  
  return message;
}

function openOrderingProperty() {
  clearOrders();
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("ordering", "open");
}

function closeOrderingProperty() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("ordering", "closed");
}

function clearOrders() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var keys = scriptProperties.getKeys();
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] != "menu")
      scriptProperties.deleteProperty(keys[i]);
  }
}

function isOrderingOpen(){
  var scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.getProperty("ordering") == "open";
}
