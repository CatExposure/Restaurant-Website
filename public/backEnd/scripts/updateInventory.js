//declaring variables
//all item... variables are tied by the inputs/forms on the respective html page
var itemId = document.getElementById('itemId');
var itemName = document.getElementById('itemName');
var itemDesc = document.getElementById('itemDesc');
var itemQty = document.getElementById('itemQuantity');
var inventoryForm = document.getElementById('UpdateInventoryForm');
var table = document.getElementById("allItemResults");
var currentItemName;
var currentItemDesc;
var currentItemQty;
var allItemId = [];
var allItemName = [];
var allItemDesc = [];
var allItemQty = [];
var allInventoryItems = [];
let regIdValid = false;
let regNameValid = true;
let regQtyValid = true;

//adding an event listener to the previously declared form to determine when the update button has been clicked, and to run the following code
inventoryForm.addEventListener("submit", function(e){
    e.preventDefault();

    //tests to see if the global variables are false, which informs the user that the regex is incorrect
    if (regNameValid == false || regQtyValid == false) { 
        alert("One or more of the fields is incorrect or blank");
        return;
    } else if (regIdValid == false) {
        alert("Item Id must be a valid ID");
        return;
    } else {
        //creating variables that allows the use to not enter in information if they do not wish to change it
        var itemNameValue = itemName.value;
        var itemDescValue = itemDesc.value;
        var itemQtyValue = itemQty.value;

        //determines if the user entered in a value
        //if they did not, then set the value to the correlating values from the item the user is currently modifying (this is explained later)
        if (itemName.value == "") {
            itemNameValue = currentItemName;
        } if (itemDesc.value == "") {
            itemDescValue = currentItemDesc;
        } if (itemQty.value == "") {
            itemQtyValue = currentItemQty;
        }

        //creates an object that stores variables values tied to names, which are later sent to the server.js page
        var inventoryData = {
            iId: itemId.value,
            itemName: itemNameValue,
            itemDesc: itemDescValue,
            itemQty: itemQtyValue,
        };

        //AJAX function to send the previously declared object to the server.js page
        //results in the data being updated within the database
        //provides an error message if information could not be sent correctl
        $.ajax({
            url: '/updateInventory',
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
    alert(inventoryData.itemName+" successfully updated");
});

//adds an event listener to the itemId variable, which runs whenever the user unselects the itemId
itemId.addEventListener("blur", function(){

    //regex to ensure the id is a number with no special chars, the tests to the regex with the value the user entered
    var regex = /^([1-9])*$/;
    var regTest = regex.test(this.value);
    
    //returns various messages to the user if the regTest fails, otherwise sets the errMessage field blank and sets the regIdValid boolean to true
    //then continues on with the rest of the function
    if (regTest == false) {
        document.getElementById('errMessageId').innerHTML = "Item Id must only contain numbers";
        regIdValid = false;
    } else if (!this.value){
        document.getElementById('errMessageId').innerHTML = "Field cannot be empty";
        regIdValid = false;
    } else {
        document.getElementById('errMessageId').innerHTML = "";
        regIdValid = true;

        //obtaining the value the user entered and setting it in a key:value pair
        var getInventoryId = {iId: this.value};
    
        //AJAX function to send the previously declared object to the server.js page
        //results in the data row being returned with the Id the user specified
        //provides an error message if information could not be sent correctl
        $.ajax({
            url: '/getInventoryById',
            dataType: 'json',
            cache: false,
            async: false,
            data: getInventoryId,
            success: function (data) {
                //sets previously declared variables to the correlating data that was returned VIA the AJAX function
                data.forEach(id => {
                    currentItemQty = (id[Object.keys(id)[0]]);
                    });
                data.forEach(name => {
                    currentItemName = (name[Object.keys(name)[1]]);
                    });
                data.forEach(desc => {
                    currentItemDesc = (desc[Object.keys(desc)[2]]);
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

//event listener ensures that the user enters a number for the item qty and just like the id event listener changes the errMessage field accordingly
itemQty.addEventListener("blur", function(){
    var regex = /^[0-9]*$/;
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

//this AJAX function obtains all the data in the inventory so that we can display them in a table
$.ajax({
    url: '/getInventoryById',
    dataType: 'json',
    cache: false,
    async: false,
    data: {Iid: ""},
    success: function (data) {
        allInventoryItems = data;
        console.log(allInventoryItems);
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });

    //for each ite in the allInventoryItem table...
    allInventoryItems.forEach(cor => {
        console.log(cor);
        //create a new row
        let row = table.insertRow(-1);
        //for each key:value pair inside the current element/object...
        Object.values(cor).forEach((text, index) => {
            //depending on the index pushes the correlating data to its array which is used later                                
            if (index == 0) {
                allItemId.push(text);
            } else if (index == 1) {
                allItemName.push(text);
            } else if (index == 2) {
                allItemDesc.push(text);
            } else if (index == 3) {
                allItemQty.push(text);
            }
            //create a cell to write into
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            //storing the text if the index == 0 (item id)
            if (index == 0) {
                storeText = text;
            };
            row.appendChild(cell);
            //if the index == 3 (last data in each object), then create a button with a className (used for css) and id set to the id of the current item
            //this allows the user to select the data within a row
            //add an click event listener to the button that runs its respective function
            if (index == 3) {
                let selectButton = document.createElement('button');
                selectButton.innerHTML = "Change Item";
                selectButton.className = "itemChange";
                selectButton.id = storeText;
                selectButton.addEventListener("click", function(e) {
                    changeItem(this.id);
                });
                //does the same as the above function, but deletes the row from the database
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

        //sets all the input fields values to the row the user selected
        function changeItem(index) {
            itemId.value = allItemId[index-1];
            itemName.value = allItemName[index-1];
            itemDesc.value = allItemDesc[index-1];
            itemQty.value = allItemQty[index-1]
        }

        //asks the user if they want to delete the row from the database, then runs an AJAX function that runs sql to delete the row
        function deleteItem(index) {
            var uI = confirm("Are you sure you want to delete item "+index+"?");
            if (uI == true) {
                $.ajax({
                    url: '/deleteInventoryItem',
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