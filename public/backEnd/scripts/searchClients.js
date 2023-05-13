var searchClientsForm = document.getElementById('SearchClientsForm');
var clientFirstNameSearch = document.getElementById('userfirstnamesearch');
var clientLastNameSearch = document.getElementById('userlastnamesearch');
var clientEmailSearch = document.getElementById('useremailsearch');
var clientArray = [];

searchClientsForm.addEventListener("submit", function(e){
    e.preventDefault();

        var clientData = {
            'clientFirstNameSearch': clientFirstNameSearch.value,
            'clientLastNameSearch': clientLastNameSearch.value,
            'clientEmailSearch': clientEmailSearch.value,
        };

        $.ajax({
            url: '/searchClients',
            dataType: 'json',
            data: clientData,
            cache: false,
            async: false,
            success: function (data) {
                clientArray = data;
                console.log(data);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        var tableHeaders = ['First Name', 'Last Name', 'Email'];
        var charList = [];

        if (document.getElementsByClassName("clientTable")) {
            document.querySelectorAll('.clientTable').forEach(e => e.remove());
        }

        clientArray.forEach(fac => {
            var firstChar = (fac[Object.keys(fac)[0]].charAt(0)).toUpperCase();
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
                table.setAttribute("class", "clientTable");
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