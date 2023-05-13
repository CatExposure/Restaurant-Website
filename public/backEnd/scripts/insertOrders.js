var orderItems = document.getElementById('orderItems');
var orderQty = document.getElementById('orderQty');
var orderForm = document.getElementById('InsertOrderForm');
var orderClient = document.getElementById('orderClient');
var orderSize = document.getElementById('orderSize');
var menuItemId = [];
var menuItemName = [];
var menuItemSize = [];
var menuItemQty = [];
var menuItemPrice = [];
var orderItemsArray = [];
var orderQtyArray = [];
var orderSizeArray = [];
var orderClientArray = [];
var orderPriceArray = [];
var itemMenuArray = [];
var tableHeaders = ['Item', 'Size', 'Quantity', 'Client', 'Price'];
var currentClient = "";
var oId;
var runningTotal;
var totalPrice;
var currentQty;

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

orderForm.addEventListener("submit", function(e){
    e.preventDefault();
    if (orderItemsArray.length == 0) {
        alert("Must add an item before placing an order");
        return;
    } else  {
    $("#currentOrderTable").remove();
    var newDate = new Date();
    var currentDate = newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
    var currentTime = newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();

    function getOrderId() {
        $.ajax({
            url: '/getMaxOrderId',
            dataType: 'json',
            cache: false,
            async: false,
            success: function (data) {
                data.forEach(element => {
                    if ((element[Object.keys(element)[0]]) == null) {
                        rId = 0;
                    } else {
                        rId = (element[Object.keys(element)[0]]);
                    }
                });
            }
        });
        return oId;
    }

    oId = getOrderId();
    oId = Number(rId);
    oId += 1;

    $.ajax({
        url: '/insertOrder',
        dataType: 'json',
        type: 'POST',
        data: {
            oId: oId,
            currentOrderClient: currentClient,
            currentOrderDate: currentDate,
            currentOrderTime: currentTime,
            orderPrice: totalPrice
        },
        success: function (data) {
            this.setState({data: data});
        }.bind(this)
    });
console.log(orderItemsArray);
    for (var i = 0; i < orderItemsArray.length; i++){
        var currentOrderItemId = orderItemsArray[i];
        var currentOrderName = orderItemsArray[i];
        var currentOrderQty = orderQtyArray[i];
        
        var currentOrderArray = {
            oId: oId,
            itemId: currentOrderItemId,
            itemName: currentOrderName,
            itemQty: currentOrderQty,
        };
        console.log(currentOrderArray);
        $.ajax({
            url: '/insertOrderItems',
            dataType: 'json',
            type: 'POST',
            data: currentOrderArray,
            success: function (data) {
                this.setState({data: data});
            }.bind(this)
        });
    };
    alert("Order successfully placed");
    location.reload();
    };
});


orderSize.addEventListener("blur", function(){
    var currentSize = orderSize.value;
    var lastSize = menuItemSize[(orderItems.value)-1];
    var currentOrderItem = parseInt(orderItems.value);

    const diff = (lastSize, currentSize) => {
    if (lastSize > currentSize) {
        return -(lastSize-currentSize);
    } else {
        return currentSize-lastSize;
    }
};

    $("#orderItems option").remove();
    var i=0;
    menuItemId.forEach(id => {
        if (menuItemSize[i] == currentSize) {
            var option = document.createElement("option");
            option.value = id;
            option.text = menuItemName[i];
            orderItems.add(option);
        }
        i++;
    });
    switch(diff(lastSize, currentSize)) {
        case -2:
            orderItems.value = (currentOrderItem-2);
            orderItems.text = menuItemName[(currentOrderItem)-2];
        break;
        case -1:
            orderItems.value = (currentOrderItem-1);
            orderItems.text = menuItemName[(currentOrderItem)-1];
        break;
        case 0:
            orderItems.value = (currentOrderItem);
            orderItems.text = menuItemName[(currentOrderItem)];
        break;
        case 1:
            orderItems.value = (currentOrderItem+1);
            orderItems.text = menuItemName[(currentOrderItem)+1];
        break;
        case 2:
            orderItems.value = (currentOrderItem+2);
            orderItems.text = menuItemName[(currentOrderItem)+2];
        break;
    };
});

orderQty.addEventListener("blur", function(){
    if (orderQty.value == "") {
        document.getElementById("errMessageQty").innerHTML = "Must have a quantity to add an item";
    } else {
        document.getElementById("errMessageQty").innerHTML = "";
    };
});

function getMenuItems() {
    $.ajax({
        url: '/getMenuItems',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            itemMenuArray = data;
            console.log(data);
            data.forEach(id => {
                menuItemId.push(id[Object.keys(id)[0]]);
                });
                data.forEach(id => {
                    menuItemName.push(id[Object.keys(id)[1]]);
                    });
                        data.forEach(id => {
                            menuItemSize.push(id[Object.keys(id)[4]]);
                            });
                            data.forEach(id => {
                                menuItemQty.push(id[Object.keys(id)[5]]);
                                });
                                data.forEach(price => {
                                    menuItemPrice.push(price[Object.keys(price)[2]]);
                                    });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
}

getMenuItems();
   
var i = 0;
menuItemId.forEach(id => {
    if (menuItemSize[i] == 1) {
        var option = document.createElement("option");
        option.value = id;
        option.text = menuItemName[i];
        orderItems.add(option);
    }
    i++;
});

function addItem() {
    var selItem = $('#orderItems').find(":selected").val();
    selItem--;

var currentItemMenuQty = (itemMenuArray[Object.keys(itemMenuArray)[selItem]]).ItemQty;
var currentItemMenuName = (itemMenuArray[Object.keys(itemMenuArray)[selItem]]).ItemName;
    if (currentClient == "") {
        currentClient = orderClient.value;
    }; 
    if (orderClient.value != currentClient){
        alert("Cannot add different client to order");
        return;
    }; 
    if (orderQty.value == "") {
        alert("Must have a quantity to add an item");
        return;
    } else if (currentItemMenuQty < orderQty.value) {
        alert("Only "+currentItemMenuQty+" "+currentItemMenuName+" are in stock");
        return;
    };

    orderItemsArray.push((itemMenuArray[Object.keys(itemMenuArray)[selItem]]).ItemId);
    orderQtyArray.push(orderQty.value);
    orderSizeArray.push((itemMenuArray[Object.keys(itemMenuArray)[selItem]]).ItemSize);
    orderClientArray.push(orderClient.value);
    orderPriceArray.push((itemMenuArray[Object.keys(itemMenuArray)[selItem]]).ItemPrice);
    var cartArray = [];
    for(var i = 0; i < orderItemsArray.length; i++) {
        var tempOrderArray = 
    {
        items: orderItemsArray[i],
        size: orderSizeArray[i],
        Quantity: orderQtyArray[i],
        Client: orderClientArray[i],
        Price: orderPriceArray[i]
    }
        cartArray.push(tempOrderArray);
    }
    console.log(cartArray);

    if($("#currentOrderTable").length) {
        $("#currentOrderTable tr.data").remove();
        $("#totalPriceTable tr.totalPrice").remove();
        var runningTotal = 0;
            cartArray.forEach(element => {
                    console.log(element);
                    let table = document.getElementById("currentOrderTable");
                let row = document.createElement('tr');
                row.setAttribute("class", "data");
                    Object.values(element).forEach((text, index) => {
                        let cell = document.createElement('td');
                        if (index == 0) {
                            text = menuItemName[text-1];
                        } else if (index == 1) {
                            if (text == 1) {
                                text = "Small";
                            } else if (text == 2) {
                                text = "Medium";
                            } else {text = "Large";}
                        } else if (index == 2) {
                            currentQty = parseInt(text);
                        } else if (index == 3) {
                            text = clientNames[text-1];
                        } else if (index == 4) {
                            runningTotal += ((parseFloat(text))*currentQty);
                            console.log(runningTotal);
                            text = formatter.format((parseFloat(text))*currentQty);
                        };

                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                        console.log(row);
                    });
                    table.appendChild(row);
        });
        let table2 = document.getElementById("totalPriceTable")
        let finalRow = document.createElement('tr');
        finalRow.setAttribute("class", "totalPrice");
        let cell = document.createElement('td');

        text = "Total Price: "+formatter.format(runningTotal);
        totalPrice = runningTotal;

        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
        finalRow.appendChild(cell);
        table2.appendChild(finalRow);
    } else {
    let table = document.createElement('table');
                table.setAttribute("class", "currentOrderTable");
                table.setAttribute("id", "currentOrderTable");
                let headerRow = document.createElement('tr');

                tableHeaders.forEach(headerText => {
                let header = document.createElement('th');
                let textNode = document.createTextNode(headerText);
                header.appendChild(textNode);
                headerRow.appendChild(header);
                });

                table.appendChild(headerRow);
                cartArray.forEach(element => {
                let row = document.createElement('tr');
                row.setAttribute("class", "data");
                    Object.values(element).forEach((text, index) => {
                        let cell = document.createElement('td');
                        if (index == 0) {
                            text = menuItemName[text-1];
                        } else if (index == 1) {
                            if (text == 1) {
                                text = "Small";
                            } else if (text == 2) {
                                text = "Medium";
                            } else {text = "Large";}
                        } else if (index == 2) {
                            currentQty = parseInt(text);
                        } else if (index == 3) {
                            text = clientNames[text-1];
                        } else if (index == 4) {
                            runningTotal = ((parseFloat(text))*currentQty);
                            console.log(runningTotal);
                            text = formatter.format((parseFloat(text))*currentQty);
                        };

                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    });
                    table.appendChild(row);
                });

                let table2 = document.createElement("table");
                table2.setAttribute("id", "totalPriceTable");
                    let row = document.createElement('tr');
                    row.setAttribute("class", "totalPrice");
                    let cell = document.createElement('td');

                    text = "Total Price: "+formatter.format(runningTotal);
                    totalPrice = runningTotal;

                    let textNode = document.createTextNode(text);
                    cell.appendChild(textNode);
                    row.appendChild(cell);
                    table2.appendChild(row);
                    document.getElementById('results').appendChild(table);
                    document.getElementById('results').appendChild(table2);
            }
    };

getClients();
    var i=0;
    clientIds.forEach(id => {
    var option = document.createElement("option");
    option.value = id;
    option.text = clientNames[i];
    orderClient.add(option);
    i++;
});

    function getClients() {
    $.ajax({
        url: '/getClients',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            clientIds = [];
            clientNames = [];
            data.forEach(id => {
                clientIds.push(id[Object.keys(id)[0]]);
                });
            data.forEach(name => {
                clientNames.push(name[Object.keys(name)[1]]);
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    getSize();
    var i=0;
    sizeIds.forEach(id => {
    var option = document.createElement("option");
    option.value = id;
    option.text = sizeNames[i];
    orderSize.add(option);
    i++;
});

    function getSize() {
    $.ajax({
        url: '/getSize',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            sizeIds = [];
            sizeNames = [];
            data.forEach(id => {
                sizeIds.push(id[Object.keys(id)[0]]);
                });
            data.forEach(name => {
                sizeNames.push(name[Object.keys(name)[1]]);
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }