//declaring variables
//all item... variables are tied by the inputs/forms on the respective html page
var itemName = document.getElementById('itemName');
var itemDesc = document.getElementById('itemDesc');
var itemPrice = document.getElementById('itemPrice');
var itemSize = document.getElementById('itemSize');
var itemQty = document.getElementById('itemQty');
var searchMenuForm = document.getElementById('SearchMenuItemForm');
var menuArray = [];
var tableHeaders = ['Item Name', 'Item Description', 'Price', 'Size', 'Quantity'];

//adding an event listener to the previously declared form to determine when the search button has been clicked, and to run the following code

searchMenuForm.addEventListener("submit", function(e){
    e.preventDefault();

    //creates an object that stores variables values tied to names, which are later sent to the server.js page
        var menuData = {
            itemName: itemName.value,
            itemDesc: itemDesc.value,
            itemSize: itemSize.value,
            itemPrice: itemPrice.value,
            itemQty: itemQty.value
        };
        
        //AJAX function to send the previously declared object to the server.js page
        //results in the data being used as searching constraints VIA SQL
        //provides an error message if information could not be sent correctly
        $.ajax({
            url: '/searchMenu',
            dataType: 'json',
            data: menuData,
            cache: false,
            async: false,
            success: function (data) {
                //previously declared array contains an array of objects with the data pertaining to the user's constraints
                menuArray = data;
                console.log(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        //declaring a variable that is required to be within the the search form event listener, which is later explained
        var charList = [];

        //if there is a table with the class name "menuTable", then remove all tables with that classname
        if (document.getElementsByClassName("menuTable")) {
            document.querySelectorAll('.menuTable').forEach(e => e.remove());
        }

        //for each element or 'fac'(faculty member) in the array...
        menuArray.forEach(fac => {
            //creating variable i which is used as an index. Alternative is to use the (fac, index) => passthrough on the anonymous function
            var i = 0;
            //obtaining the first character of the first name for each returned element or 'faculty member'
            var firstChar = (fac[Object.keys(fac)[0]].charAt(0)).toUpperCase();
            //if the charList array includes the firstChar obtained...
            //get the table with the id as the firstChar and create a new row
                if(charList.includes(firstChar)) {
                    var existingTable = document.getElementById(firstChar);
                    let row = document.createElement('tr');
                    //for each value in the key:value pair...
                    Object.values(fac).forEach(text => {
                        //create a cell element to write in
                        let cell = document.createElement('td');
                        //if i == 2, then that is the price of the menu item, therefore add an $ to the text
                        //if i == 3, then that is the size of the menu item, therefore compare the text to either 1 (small), 2 (medium) or 3 (large)
                        if (i == 2) {text = ("$"+text);}
                        if (i == 3) {
                            if (text == 1) {
                                text = "Small";
                            } else if (text == 2) {
                                text = "Medium";
                            } else {text = "Large"}
                        };
                        //append the text to the cell and add it to the row, as well as increase the index
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                        i++;
                    });

                    existingTable.appendChild(row);
                //if there is no table on the html page with an id of any of the elements within the charList array, then do the following
                } else {
                //push the firstChar to the array, then create a table and set the class attribute (for css and deleting reasons) and the id attribute to the firstChar
                charList.push(firstChar);

                let table = document.createElement('table');
                table.setAttribute("class", "menuTable");
                table.setAttribute("id", firstChar);
                //create a headerRow with the firstChar as the innerHTML to label what data is within the table
                let headerRow = document.createElement('tr');
                let headerChar = document.createElement('th');
                headerChar.innerHTML="<h2>"+firstChar+"</h2>";
                table.appendChild(headerChar);

                //create a table header for each element in the headerText array
                tableHeaders.forEach(headerText => {
                    let header = document.createElement('th');
                    let textNode = document.createTextNode(headerText);
                    header.appendChild(textNode);
                    headerRow.appendChild(header);
                });

                table.appendChild(headerRow);
                //create a row for the data
                    let row = document.createElement('tr');
                    //do the same process within the if statement explained above
                    Object.values(fac).forEach(text => {
                        let cell = document.createElement('td');
                        if (i == 2) {text = ("$"+text);}
                        if (i == 3) {
                            if (text == 1) {
                                text = "Small";
                            } else if (text == 2) {
                                text = "Medium";
                            } else {text = "Large"}
                        };
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                        i++;
                    });
                    table.appendChild(row);
            document.getElementById('searchResults').appendChild(table);
        }
     });
});

//runs the getSize function
getSize();
//creating var i for the use of indexing
    var i=0;
    //for each element/id in the sizeIds array...
    sizeIds.forEach(id => {
    //create an option and set the value and text, then add the option to the previously declared select element
    var option = document.createElement("option");
    option.value = id;
    option.text = sizeNames[i];
    itemSize.add(option);
    i++;
});

    //obtains all the data (size id and size name, such as 1 = small) then pushes them to their correlating arrays
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