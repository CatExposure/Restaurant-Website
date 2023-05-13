var itemId = document.getElementById('itemId');
var itemName = document.getElementById('itemName');
var itemDesc = document.getElementById('itemDesc');
var itemPrice = document.getElementById('itemPrice');
var itemSize = document.getElementById('itemSize');
var menuForm = document.getElementById('UpdateMenuItemForm');
var table = document.getElementById("allItemResults");
var allItemId = [];
var allItemName = [];
var allItemDesc = [];
var allItemSize = [];
var allItemQuantity = [];
var allItemPrice = [];
var allMenuItems = [];
var currentItemName;
var currentItemDesc;
var currentItemSize;
var currentItemPrice;
let regIdValid = false;
let regNameValid = true;
let regPriceValid = true;

menuForm.addEventListener("submit", function(e){
    e.preventDefault();

    if (regNameValid == false || regPriceValid == false) { 
        alert("One or more of the fields is incorrect or blank");
        return;
    } else if (regIdValid == false) {
        alert("Item Id must be a valid ID");
        return;
    } else {

        var itemNameValue = itemName.value;
        var itemDescValue = itemDesc.value;
        var itemSizeValue = itemSize.value;
        var itemPriceValue = itemPrice.value;

        if (itemName.value == "") {
            itemNameValue = currentItemName;
        } if (itemDesc.value == "") {
            itemDescValue = currentItemDesc;
        } if (itemSize.value == "") {
            itemSizeValue = currentItemSize;
        } if (itemPrice.value == "") {
            itemPriceValue = currentItemPrice;
        }

        var menuData = {
            iId: itemId.value,
            itemName: itemNameValue,
            itemDesc: itemDescValue,
            itemSize: itemSizeValue,
            itemPrice: itemPriceValue
        };
        
        $.ajax({
            url: '/updateMenu',
            dataType: 'json',
            type: 'POST',
            data: menuData,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }
    alert(menuData.itemName+" Successfully added");
});

itemId.addEventListener("blur", function(){

    var regex = /^([1-9])*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageId').innerHTML = "Item Id must only contain numbers";
        regIdValid = false;
    } else if (!this.value){
        document.getElementById('errMessageId').innerHTML = "Field cannot be empty";
        regIdValid = false;
    } else {
        document.getElementById('errMessageId').innerHTML = "";
        regIdValid = true;

        var getMenuId = {mId: this.value};
    
        $.ajax({
            url: '/getMenuById',
            dataType: 'json',
            cache: false,
            async: false,
            data: getMenuId,
            success: function (data) {
                data.forEach(id => {
                    currentItemPrice = (id[Object.keys(id)[2]]);
                    });
                data.forEach(name => {
                    currentItemName = (name[Object.keys(name)[1]]);
                    });
                data.forEach(desc => {
                    currentItemDesc = (desc[Object.keys(desc)[3]]);
                    });
                data.forEach(desc => {
                    currentItemSize = (desc[Object.keys(desc)[4]]);
                    });
                console.log(data);
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
    }
});

itemName.addEventListener("blur", function(){
    if (!this.value){
        document.getElementById('errMessageName').innerHTML = "";
        regNameValid = true;
    } else {
        document.getElementById('errMessageName').innerHTML = "";
        regNameValid = true;
    }
});

itemPrice.addEventListener("blur", function(){
    var regex = /^\d*\.?\d*$/;
    var regTest = regex.test(this.value);

    if (regTest == false) {
        document.getElementById('errMessageQty').innerHTML = "Field can only consist of numbers";
        regQtyValid = false;
    } else if (!this.value){
        document.getElementById('errMessageQty').innerHTML = "";
        regQtyValid = true;
    } else {
        document.getElementById('errMessageQty').innerHTML = "";
        regQtyValid = true;
    }
});

getSize();
    var i=0;
    sizeIds.forEach(id => {
    var option = document.createElement("option");
    option.value = id;
    option.text = sizeNames[i];
    itemSize.add(option);
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

    $.ajax({
        url: '/getMenuById',
        dataType: 'json',
        cache: false,
        async: false,
        data: {mId: ""},
        success: function (data) {
            allMenuItems = data;
            console.log(allMenuItems);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    
        allMenuItems.forEach(cor => {
            console.log(cor);
            let row = table.insertRow(-1);
            Object.values(cor).forEach((text, index) => {
                if (index == 0) {
                    allItemId.push(text);
                } else if (index == 1) {
                    allItemName.push(text);
                } else if (index == 2) {
                    allItemPrice.push(text);
                } else if (index == 3) {
                    allItemDesc.push(text);
                } else if (index == 4) {
                    allItemSize.push(text);
                    text = sizeNames[text-1];
                } else if (index == 5) {
                    allItemQuantity.push(text);
                }
                let cell = document.createElement('td');
                let textNode = document.createTextNode(text);
                cell.appendChild(textNode);
                if (index == 0) {
                    storeText = text;
                };
                row.appendChild(cell);
                if (index == 5) {
                    let selectButton = document.createElement('button');
                    selectButton.innerHTML = "Change Item";
                    selectButton.className = "itemChange";
                    selectButton.id = storeText;
                    selectButton.addEventListener("click", function(e) {
                        changeItem(this.id);
                    });
                    row.appendChild(selectButton);
                    let deleteButton = document.createElement('button');
                    deleteButton.innerHTML = "Delete Item";
                    deleteButton.className = "itemDelete";
                    deleteButton.id = storeText;
                    deleteButton.addEventListener("click", function(e) {
                        deleteItem(this.id);
                    });
                    row.appendChild(deleteButton);
                };
            });
            table.appendChild(row);
            console.log(table);
            });
    
            function changeItem(index) {
                itemId.value = allItemId[index-1];
                itemName.value = allItemName[index-1];
                itemDesc.value = allItemDesc[index-1];
                itemPrice.value = allItemPrice[index-1]
                itemSize.value = allItemSize[index-1]
            }
    
            function deleteItem(index) {
                var uI = confirm("Are you sure you want to delete item "+index+"?");
                if (uI == true) {
                    $.ajax({
                        url: '/deleteMenuItem',
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
    
                    alert("Item "+index+" has been deleted");
                } else {
                    return;
                }
            }