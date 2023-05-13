var inventorySearchForm = document.getElementById('SearchInventoryForm');
var inventoryIdSearch = document.getElementById('itemId');
var inventoryNameSearch = document.getElementById('itemName');
var inventoryDescSearch = document.getElementById('itemDesc');
var inventoryQtySearch = document.getElementById('itemQuantity');
var inventoryArray = [];

inventorySearchForm.addEventListener("submit", function(e){
    e.preventDefault();

        var inventoryData = {
            iId: inventoryIdSearch.value,
            itemName: inventoryNameSearch.value,
            itemDesc: inventoryDescSearch.value,
            itemQty: inventoryQtySearch.value
        };

        $.ajax({
            url: '/searchInventory',
            dataType: 'json',
            data: inventoryData,
            cache: false,
            async: false,
            success: function (data) {
                inventoryArray = data;
                console.log(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        var tableHeaders = ['Item Id', 'Item Quantity', 'Item Name', 'Item Description'];
        var charList = [];

        if (document.getElementsByClassName("inventoryTable")) {
            document.querySelectorAll('.inventoryTable').forEach(e => e.remove());
        }

        inventoryArray.forEach(fac => {
            var firstChar = (fac[Object.keys(fac)[2]].charAt(0)).toUpperCase();
                if(charList.includes(firstChar)) {
                    var existingTable = document.getElementById(firstChar);
                    let row = document.createElement('tr');
                    Object.values(fac).forEach(text => {
                        let cell = document.createElement('td');
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    });

                    existingTable.appendChild(row);
                } else {
                charList.push(firstChar);

                let table = document.createElement('table');
                table.setAttribute("class", "inventoryTable");
                table.setAttribute("id", firstChar);
                let headerRow = document.createElement('tr');
                let headerChar = document.createElement('th');
                headerChar.innerHTML="<h2>"+firstChar+"</h2>";
                table.appendChild(headerChar);

                tableHeaders.forEach(headerText => {
                    let header = document.createElement('th');
                    let textNode = document.createTextNode(headerText);
                    header.appendChild(textNode);
                    headerRow.appendChild(header);
                });

                table.appendChild(headerRow);
                    let row = document.createElement('tr');
                    Object.values(fac).forEach(text => {
                        let cell = document.createElement('td');
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    });
                    table.appendChild(row);
            document.getElementById('searchResults').appendChild(table);
        }
     });
});
