var orderItems = document.getElementById('orderItems');
var orderQty = document.getElementById('orderQty');
var orderForm = document.getElementById('InsertOrderForm');
var orderClient = document.getElementById('orderClient');
var orderSize = document.getElementById('orderSize');
var clientFirstName = document.getElementById('clientFirst');
var clientLastName = document.getElementById('clientLast');
var clientAddress = document.getElementById('clientAddress');
var clientPhone = document.getElementById('clientPhone');
var clientEmail = document.getElementById('clientEmail');
var menuItemId = [];
var menuItemName = [];
var menuItemSize = [];
var menuItemPrice = [];
var menuItemQty = [];
var orderItemsArray = [];
var orderQtyArray = [];
var orderSizeArray = [];
var orderPriceArray = [];
var itemMenuArray = [];
var tempQty;
var priceTotal = 0.00;
var runningTotal = 0.00;
var oId;
var cId;

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
    $("#orderCartTable").remove();
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

    var clientData = {
        clientFirstName: clientFirstName.value,
        clientLastName: clientLastName.value,
        clientAddress: clientAddress.value,
        clientPhone: clientPhone.value,
        clientEmail: clientEmail.value
    };

    $.ajax({
        url: '/insertClient',
        dataType: 'json',
        type: 'POST',
        data: clientData,
        success: function (data) {
            this.setState({data: data});
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });

    function getClientId() {
        $.ajax({
            url: '/getMaxClientId',
            dataType: 'json',
            cache: false,
            async: false,
            success: function (data) {
                data.forEach(element => {
                        cId = (element[Object.keys(element)[0]]);
                });
            }
        });
        return cId;
    }

    cId = getClientId();
    cId = Number(cId);

    $.ajax({
        url: '/insertOrder',
        dataType: 'json',
        type: 'POST',
        data: {
            oId: oId,
            currentOrderClient: cId,
            currentOrderDate: currentDate,
            currentOrderTime: currentTime,
            orderPrice: parseFloat(priceTotal)
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
    currentClient = "";
    orderItemsArray = [];
    orderQtyArray = [];
    orderSizeArray = [];
    orderPriceArray = [];
    };
    location.reload();
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
                        menuItemPrice.push(id[Object.keys(id)[2]]);
                        });
                        data.forEach(id => {
                            menuItemSize.push(id[Object.keys(id)[4]]);
                            });
                            data.forEach(qty => {
                                menuItemQty.push(qty[Object.keys(qty)[5]]);
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
    orderPriceArray.push((itemMenuArray[Object.keys(itemMenuArray)[selItem]]).ItemPrice)
    var cartArray = [];
    for(var i = 0; i < orderItemsArray.length; i++) {
        var tempOrderArray = 
    {
        items: orderItemsArray[i],
        size: orderSizeArray[i],
        Quantity: orderQtyArray[i],
        price: orderPriceArray[i]
    }
        cartArray.push(tempOrderArray);
    }
    console.log(cartArray);

    if($("#orderCartTable").length) {
        $("#orderCartTable tr.data").remove();
            cartArray.forEach(element => {
                    console.log(element);
                    let table = document.getElementById("orderCartTable");
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
                            tempQty = parseFloat(text)
                        } else if (index == 3) {
                            var price = parseFloat(text);
                            var total = (price * tempQty);
                            text = formatter.format(total);
                            runningTotal = parseFloat(priceTotal);
                            runningTotal += parseFloat(total);
                            console.log(priceTotal);
                        };
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                        console.log(row);
                    });
                    console.log(table);
                    table.appendChild(row);
                    console.log(table);
        });
        $("#orderTotal tr.data").remove();
        let table = document.getElementById("orderTotal");
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        row.setAttribute("id", "totalPrice");
        row.setAttribute("class", "data");
        let textNode = document.createTextNode("Total Price: "+formatter.format(runningTotal));
        cell.appendChild(textNode);
        row.appendChild(cell);
        table.appendChild(row);

        priceTotal = runningTotal;
        runningTotal = 0.00;
    };
};

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