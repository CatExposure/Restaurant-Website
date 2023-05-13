var itemName = document.getElementById('itemName');
var itemDesc = document.getElementById('itemDesc');
var itemPrice = document.getElementById('itemPrice');
var itemSize = document.getElementById('itemSize');
var menuForm = document.getElementById('InsertMenuItemForm');
let regNameValid = false;
let regPriceValid = false;
var mId;

menuForm.addEventListener("submit", function(e){
    e.preventDefault();

    function getMenuId() {
        $.ajax({
            url: '/getMaxMenuId',
            dataType: 'json',
            cache: false,
            async: false,
            success: function (data) {
                data.forEach(element => {
                    if ((element[Object.keys(element)[0]]) == null) {
                        mId = 0;
                    } else {
                        mId = (element[Object.keys(element)[0]]);
                    }
                });
            }
        });
        return mId;
    }

    mId = getMenuId();
    mId = Number(mId);
    mId += 1;

    if (regNameValid == false || regQtyValid == false) { 
        alert("One or more of the fields is incorrect or blank");
        return;
    } else {
        var menuData = {
            mId: mId,
            itemName: itemName.value,
            itemDesc: itemDesc.value,
            itemSize: itemSize.value,
            itemPrice: itemPrice.value
        };
        
        $.ajax({
            url: '/insertMenu',
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
    alert(itemName+" Successfully added");
    location.reload();
});

itemName.addEventListener("blur", function(){
    if (!this.value){
        document.getElementById('errMessageName').innerHTML = "Field cannot be empty";
        regNameValid = false;
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
        document.getElementById('errMessageQty').innerHTML = "Field cannot be empty";
        regQtyValid = false;
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