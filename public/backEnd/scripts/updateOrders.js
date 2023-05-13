var orderId = document.getElementById("orderId");
var orderStatus = document.getElementById('orderStatus');
var orderDate = document.getElementById('orderDate');
var orderForm = document.getElementById('UpdateOrderForm');
var orderClient = document.getElementById('orderClient');
var orderTime = document.getElementById('orderTime');
var orderItems = document.getElementById('orderItems');
var orderQty = document.getElementById('orderQty');
var orderItemForm = document.getElementById('UpdateOrderItem');
var orderSize = document.getElementById('orderSize');
var orderItemId = document.getElementById("orderItemId");
var table = document.getElementById("allOrderResults");
var table2 = document.getElementById("allOrderItemsResults");
var clientNames = [];
var statusNames = [];
var allOrdersArray = [];
var menuItemId = [];
var menuItemName = [];
var menuItemSize = [];
var menuItemQty = [];
var menuItemPrice = [];
var tableHeaders = ['Order Item Id', 'Item', 'Quantity'];
var allOrderId = [];
var allOrderStatus = [];
var allOrderDate = [];
var allOrderTime = [];
var allOrderClient = [];
var allOrderPrices = [];
var allOrderItemId = [];
var allOrderItems = [];
var allOrderItemSize = [];
var allOrderItemQty = [];
var priceChange;
var oldOrderPrice;
var newOrderPrice
regOrderIdValid = false;
regOrderItemIdValid = false;

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

orderForm.addEventListener("submit", function(e){
    e.preventDefault();

    if (!orderStatus.value || !orderDate.value || !orderTime.value || !orderClient.value) {
        alert("Update order fields cannot be blank");
        return;
    
} else if (regOrderIdValid == false) {
        alert("Order Id must be a valid Id");
        return;
    } else {

        var orderData = {
            oId: orderId.value,
            orderStatus: orderStatus.value,
            orderDate: orderDate.value,
            orderTime: orderTime.value,
            orderClient: orderClient.value
        };

    $.ajax({
        url: '/updateOrder',
        dataType: 'json',
        type: 'POST',
        data: orderData,
        success: function (data) {
            this.setState({data: data});
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });
    alert("Order successfully updated");
    location.reload();
    };
});

orderItemForm.addEventListener("submit", function(e){
    e.preventDefault();

    console.log(orderItems.value);
    console.log(menuItemQty[orderItems.value-1]);

    if (!orderId.value || !orderItems.value || !orderQty.value) {
        alert("Update order item fields cannot be blank");
        return;
    } else if (regOrderItemIdValid == false) {
        alert("Order Id must be a valid Id");
        return;
    } else if (menuItemQty[orderItems.value-1] < orderQty.value) {
        alert("Only "+menuItemQty[orderItems.value-1]+" "+menuItemName[orderItems.value-1]+" are in stock");
        return;
    } else {
        newOrderPrice = (menuItemPrice[menuItemId.indexOf(parseInt(orderItems.value))] * orderQty.value);
        console.log(oldOrderPrice, newOrderPrice);
        if (oldOrderPrice != newOrderPrice) {
            priceChange = (newOrderPrice - oldOrderPrice);
        } else {
        priceChange = 0;
        };

        console.log(parseFloat(priceChange).toFixed(2));
        var orderItemData = {
            oItemId: orderItemId.value,
            oId: orderId.value,
            orderMenuItem: orderItems.value,
            orderQty: orderQty.value,
            priceChange: parseFloat(priceChange).toFixed(2)
        };
    $.ajax({
        url: '/updateOrderItem',
        dataType: 'json',
        type: 'POST',
        data: orderItemData,
        success: function (data) {
            this.setState({data: data});
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });

    alert("Order Item successfully updated");
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

    var regex = /^([0-9])*$/;
    var regTest = regex.test(this.value);

    if (regTest == false) {
        document.getElementById("errMessageQty").innerHTML = "Must have a quantity to add an item";
        regQtyValid = false;
    } else if (orderQty.value == 0){
        document.getElementById("errMessageQty").innerHTML = "Must have a quantity to add an item";
    } else {
        document.getElementById("errMessageQty").innerHTML = "";
        regQtyValid = true;
    };
});

orderId.addEventListener("blur", function(){
    
    var regex = /^([1-9])*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageId').innerHTML = "Order Id must only contain numbers";
        regOrderIdValid = false;
    } else if (!this.value){
        document.getElementById('errMessageId').innerHTML = "Field cannot be empty";
        regOrderIdValid = false;
    } else {
        document.getElementById('errMessageId').innerHTML = "";
        regOrderIdValid = true;

        var getOrderId = {orderId: this.value};
    
        $.ajax({
            url: '/getOrderById',
            dataType: 'json',
            cache: false,
            async: false,
            data: getOrderId,
            success: function (data) {
                data.forEach(id => {
                    orderCurrentId = (id[Object.keys(id)[0]]);
                    });
                data.forEach(room => {
                    orderCurrentStatus = (room[Object.keys(room)[1]]);
                    });
                data.forEach(day => {
                    orderCurrentDate = (day[Object.keys(day)[2]]);
                    });
                data.forEach(time => {
                    orderCurrentTime = (time[Object.keys(time)[3]]);
                    });
                data.forEach(client => {
                    orderCurrentClient = (client[Object.keys(client)[4]]);
                    });
                    data.forEach(client => {
                        orderCurrentPrice = (client[Object.keys(client)[5]]);
                        });
                   allOrdersArray = data;
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });

            var orderItemsId = {orderItemsId: this.value}
            $.ajax({
                url: '/searchClientItems',
                dataType: 'json',
                data: orderItemsId,
                cache: false,
                async: false,
                success: function (data) {
                   clientItemsArray = data;
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });

            $(".clientOrderItemsTable").remove();

            let table2 = document.createElement('table');
    table2.setAttribute("class", "clientOrderItemsTable");
    table2.setAttribute("id", this.value);
    let headerRow = document.createElement('tr');

    tableHeaders.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        header.appendChild(textNode);
        headerRow.appendChild(header);
    });

    table2.appendChild(headerRow);
    clientItemsArray.forEach(element => {
        let row = document.createElement('tr');
        Object.values(element).forEach((text, index) => {
            if (index == 1) {
                var sizeText;
                if (menuItemSize[text-1] == 1) {
                    sizeText = "Small";
                } else if (menuItemSize[text-1] == 2) {
                    sizeText = "Medium";
                } else {sizeText = "Large";}

                text = menuItemName[text]+"("+sizeText+")";
            }
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        });
        table2.appendChild(row);
    });
        
document.getElementById('results').appendChild(table2);
    }
});

orderItemId.addEventListener("blur", function(){
    
    var regex = /^([1-9])*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageItemId').innerHTML = "Order Id must only contain numbers";
        regOrderItemIdValid = false;
    } else if (!this.value){
        document.getElementById('errMessageItemId').innerHTML = "Field cannot be empty";
        regOrderItemIdValid = false;
    } else {
        document.getElementById('errMessageItemId').innerHTML = "";
        regOrderItemIdValid = true;

    };
});

function getMenuItems() {
    $.ajax({
        url: '/getMenuItems',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            data.forEach(id => {
                menuItemId.push(id[Object.keys(id)[0]]);
                });
                data.forEach(id => {
                    menuItemName.push(id[Object.keys(id)[1]]);
                    });
                        data.forEach(id => {
                            menuItemSize.push(id[Object.keys(id)[4]]);
                            });
                            data.forEach(qty => {
                                menuItemQty.push(qty[Object.keys(qty)[5]]);
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

getStatus();
    var i=0;
    statusIds.forEach(id => {
    var option = document.createElement("option");
    option.value = id;
    option.text = statusNames[i];
    orderStatus.add(option);
    i++;
});

    function getStatus() {
    $.ajax({
        url: '/getStatus',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            statusIds = [];
            statusNames = [];
            data.forEach(id => {
                statusIds.push(id[Object.keys(id)[0]]);
                });
            data.forEach(name => {
                statusNames.push(name[Object.keys(name)[1]]);
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

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
    };

$.ajax({
    url: '/getOrderById',
    dataType: 'json',
    cache: false,
    async: false,
    data: {orderId: ""},
    success: function (data) {
           allOrdersArray = data;
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });

allOrdersArray.forEach(cor => {
    let row = table.insertRow(-1);
    Object.values(cor).forEach((text, index) => {
        if (index == 0) {
            allOrderId.push(text);
            console.log(allOrderId);
        } else if (index == 1) {
            allOrderStatus.push(text);
            text = statusNames[text-1];
        } else if (index == 2) {
            text = new Date(text).toISOString().split('T')[0];
            allOrderDate.push(text);
            text = new Date(text).toLocaleDateString();
        } else if (index == 3) {
            allOrderTime.push(text);
        } else if (index == 4) {
            allOrderClient.push(text);
            var currentClientName = clientIds.indexOf(text);
            text = clientNames[currentClientName];
        } else if (index == 5) {
            allOrderPrices.push(parseInt(text))
            text = formatter.format(text);
        }
        let cell = document.createElement('td');
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
        if (index == 0) {
            storeText = text;
            console.log(allOrdersArray);
        };
        row.appendChild(cell);
        if (index == 5) {
            let selectButton = document.createElement('button');
            selectButton.innerHTML = "Change Order";
            selectButton.className = "orderChange";
            selectButton.id = storeText;
            selectButton.addEventListener("click", function(e) {
                changeOrder(this.id);
            });
            row.appendChild(selectButton);
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Delete Order";
            deleteButton.className = "orderDelete";
            deleteButton.id = storeText;
            deleteButton.addEventListener("click", function(e) {
                deleteOrder(this.id);
            });
            row.appendChild(deleteButton);
        };
    });
    table.appendChild(row);
    });

    function changeOrder(index) {
        regOrderIdValid = true;
        document.getElementById('errMessageId').innerHTML = "";
        $("tr.data", table2).remove();
        allOrderItemId = [];
        allOrderItems = [];
        allOrderItemSize = [];
        allOrderItemQty = [];

        var indexValue = allOrderId.indexOf(parseInt(index));
        orderId.value = index;
        orderStatus.value = allOrderStatus[indexValue];
        orderDate.value = allOrderDate[indexValue];
        orderTime.value = allOrderTime[indexValue];
        orderClient.value = allOrderClient[indexValue];

            var orderItemsId = {orderItemsId: orderId.value}
            $.ajax({
                url: '/searchClientItems',
                dataType: 'json',
                data: orderItemsId,
                cache: false,
                async: false,
                success: function (data) {
                   clientItemsArray = data;
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
var i = 0;
    clientItemsArray.forEach(element => {
        let row = document.createElement('tr');
        row.className = "data";
        i++
        Object.values(element).forEach((text, index) => {
            if (index == 0) {
                allOrderItemId.push(text);
                storeText = text;
            } else if (index == 1) {
                allOrderItems.push(text);
                var sizeText;
                if (menuItemSize[text-1] == 1) {
                    sizeText = "Small";
                    allOrderItemSize.push("1");
                } else if (menuItemSize[text-1] == 2) {
                    sizeText = "Medium";
                    allOrderItemSize.push("2");
                } else {sizeText = "Large";
                    allOrderItemSize.push("3");
                    }               
                text = menuItemName[text-1]+"("+sizeText+")";
            }
            if (index == 2) {  
                allOrderItemQty.push(text);
            } 
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
            if (index == 2) {
            let selectButton = document.createElement('button');
            selectButton.innerHTML = "Change Order Item";
            selectButton.className = "orderItemChange";
            console.log(i);
            selectButton.id = i;
            selectButton.addEventListener("click", function(e) {
                changeOrderItem(this.id);
            });
            row.appendChild(selectButton);
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Delete Order Item";
            deleteButton.className = "orderItemDelete";
            deleteButton.id = i;
            deleteButton.addEventListener("click", function(e) {
                deleteOrderItem(this.id);
            });
            row.appendChild(deleteButton);
        };
        });
        table2.appendChild(row);
    });
    };

    function changeOrderItem(index) {
        regOrderItemIdValid = true;
        orderItemId.value = allOrderItemId[index-1];
        orderSize.value = allOrderItemSize[index-1];
        orderQty.value = allOrderItemQty[index-1]
        var currentSize = orderSize.value;

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
        orderItems.value = allOrderItems[index-1];
        console.log(allOrderItems);
        orderItems.text = menuItemName[index-1];
        oldOrderPrice = (menuItemPrice[menuItemId.indexOf(parseInt(orderItems.value))]*orderQty.value);
        console.log(oldOrderPrice)
    };

    function deleteOrderItem(index) {
        var uI = confirm("Are you sure you want to delete order item "+allOrderItemId[index-1]+"?");
        if (uI == true) {
            var currentSize = orderSize.value;
            orderQty.value = allOrderItemQty[index-1]
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
        var deleteItem = allOrderItems[index-1];
        oldOrderPrice = (menuItemPrice[menuItemId.indexOf(parseInt(deleteItem))]*orderQty.value);

            $.ajax({
                url: '/deleteOrderItem',
                dataType: 'json',
                type: 'POST',
                data: {"index": allOrderItemId[index-1],
                        priceChange: parseFloat(oldOrderPrice),
                    oId: orderId.value},
                success: function (data) {
                    this.setState({data: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });

            alert("Order item "+allOrderItemId[index-1]+" has been deleted");
            location.reload();
        } else {
            return;
        }
    };

    function deleteOrder(index) {
        var uI = confirm("Are you sure you want to delete order "+index+"?");
        if (uI == true) {
            $.ajax({
                url: '/deleteOrder',
                dataType: 'json',
                type: 'POST',
                data: {"index": index},
                success: function (data) {
                    this.setState({data: data});
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });

            alert("Order "+index+" has been deleted");
            location.reload();
        } else {
            return;
        }
    };