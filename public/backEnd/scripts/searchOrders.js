var orderId = document.getElementById('orderId');
var orderClient = document.getElementById('orderClient');
var orderDay = document.getElementById('orderDay');
var orderTime = document.getElementById('orderTime');
var orderStatus = document.getElementById('orderStatus');
var orderForm = document.getElementById('SearchOrderForm');
var ordersArray = [];
var clientNames = [];
var statusNames = [];
var menuItemId = [];
var menuItemName = [];
var menuItemSize = [];
var idSort = document.getElementById("sortImageId");
var daySort = document.getElementById("sortImageDay");
var timeSort = document.getElementById("sortImageTime");
var statusSort = document.getElementById("sortImageStatus");
var priceSort = document.getElementById("sortImagePrice");
var clientSort = document.getElementById("sortImageClient");
var table = document.getElementById('ordersTable');
var tableHeaders = ["Item", "Quantity"];

orderForm.addEventListener("submit", function(e){
    e.preventDefault();
        
    var OrderArray = {
        orderId: orderId.value,
        orderClient: orderClient.value,
        orderDay: orderDay.value,
        orderTime: orderTime.value,
        orderStatus: orderStatus.value
    };

        $.ajax({
            url: '/searchOrders',
            dataType: 'json',
            data: OrderArray,
            cache: false,
            async: false,
            success: function (data) {
               ordersArray = data;
               console.log(ordersArray);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        $("tr.classOrder", table).remove();
    ordersArray.forEach(cor => {
    console.log(cor);
    let row = table.insertRow(-1);
    row.className = "classOrder";
    Object.values(cor).forEach((text, index) => {
        if (index == 1) {
            text = statusNames[text-1];
        } else if (index == 2) {
            console.log(text);
            text = new Date(text).toLocaleDateString();
        } else if (index == 4) {
            var currentClientName = clientIds.indexOf(text);
            text = clientNames[currentClientName];
        } else if (index == 5) {
            text = "$"+text;
        }
        let cell = document.createElement('td');
        let textNode = document.createTextNode(text);
        cell.appendChild(textNode);
        if (index == 0) {
            storeText = text;
        };
        row.appendChild(cell);
        if (index == 5) {
            console.log(storeText);
            let button = document.createElement('button');
            button.innerHTML = "See Cart";
            button.className = "searchCart";
            button.id = storeText;
            button.addEventListener("click", function(e) {
                test(this.id);
            });
            row.appendChild(button);
        };
    });
    table.appendChild(row);
    });
});

function test(firstChar) {
    var clientData= {
        orderItemsId: firstChar
    };

    $.ajax({
        url: '/searchClientItems',
        dataType: 'json',
        data: clientData,
        cache: false,
        async: false,
        success: function (data) {
           clientItemsArray = data;
           console.log(clientItemsArray);
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });

    $(".clientOrderItemsTable").remove();
    
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
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

    let table2 = document.createElement('table');
    table2.setAttribute("class", "clientOrderItemsTable");
    table2.setAttribute("id", firstChar);
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
        console.log(element);
        Object.values(element).forEach((text, index) => {
            if(index == 0) {return;}
            if (index == 1) {
                var sizeText;
                console.log()
                if (menuItemSize[text-1] == 1) {
                    sizeText = "Small";
                } else if (menuItemSize[text-1] == 2) {
                    sizeText = "Medium";
                } else {sizeText = "Large";}

                text = menuItemName[text-1]+"("+sizeText+")";
            }
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        });
        console.log(row);
        table2.appendChild(row);
        console.log(table2);
    });
        
document.getElementById('searchResults').appendChild(table2);
};

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

    idSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 0;
        tableSort(j);
    });

    clientSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 1;
        tableSort(j);
    });

    daySort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 2;
        tableSort(j);
    });

    timeSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 3;
        tableSort(j);
    });

    statusSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 4;
        tableSort(j);
    });

    priceSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 5;
        tableSort(j);
    });

    //
    function tableSort(j) {
        var rows, switching, i, x, y, shouldSwitch;
        switching = true;
        // make a loop that will continue until no switching has been done
        while (switching) {
            // start by saying no switching is done
            switching = false;
            rows = table.rows;
            // loop through all table rows except the first, which contains table headers
            for (i = 1; i < (rows.length - 1); i++) {
            // start by saying there should be no switching
            shouldSwitch = false;
            // get the two elements you want to compare, one from current row and one from the next
            x = rows[i].getElementsByTagName("TD")[j];
            y = rows[i + 1].getElementsByTagName("TD")[j];
            // check if the two rows should switch place and runs the shouldswitch if statement
            if (j == 0) {
                if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            } else {
                if (x.innerHTML > y.innerHTML) {
                    shouldSwitch = true;
                    break;
                }
            };
            }
            if (shouldSwitch) {
            // if a switch has been marked, make the switch and mark that a switch has been done
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            }
        }
    };
