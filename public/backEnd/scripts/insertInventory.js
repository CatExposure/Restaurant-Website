var itemName = document.getElementById('itemName');
var itemDesc = document.getElementById('itemDesc');
var itemQty = document.getElementById('itemQuantity');
var inventoryForm = document.getElementById('InsertInventoryForm');
let regNameValid = false;
let regQtyValid = false;
var iId;

inventoryForm.addEventListener("submit", function(e){
    e.preventDefault();

    function getInventoryId() {
        $.ajax({
            url: '/getMaxInventoryId',
            dataType: 'json',
            cache: false,
            async: false,
            success: function (data) {
                data.forEach(element => {
                    if ((element[Object.keys(element)[0]]) == null) {
                        iId = 0;
                    } else {
                        iId = (element[Object.keys(element)[0]]);
                    }
                });
            }
        });
        return iId;
    }

    iId = getInventoryId();
    iId = Number(iId);
    iId += 1;

    if (regNameValid == false || regQtyValid == false) { 
        alert("One or more of the fields is incorrect or blank");
        return;
    } else {
        const inventoryData = {
            iId: iId,
            itemName: itemName.value,
            itemDesc: itemDesc.value,
            itemQty: itemQty.value,
        };

        $.ajax({
            url: '/insertInventory',
            dataType: 'json',
            type: 'POST',
            data: inventoryData,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }
    alert(itemName.value+" successfully added with "+itemQty.value+" currently in stock");
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

itemQty.addEventListener("blur", function(){
    var regex = /^[0-9]*$/;
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