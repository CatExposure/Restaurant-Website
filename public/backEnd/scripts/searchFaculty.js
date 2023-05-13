var searchFacultyForm = document.getElementById('SearchFacultyForm');
var facultyFirstNameSearch = document.getElementById('userfirstnamesearch');
var facultyLastNameSearch = document.getElementById('userlastnamesearch');
var facultyEmailSearch = document.getElementById('useremailsearch');
var facultyTypeNames = [];
var facultyArray = [];

searchFacultyForm.addEventListener("submit", function(e){
    e.preventDefault();

        var facultyData = {
            'facultyFirstNameSearch': facultyFirstNameSearch.value,
            'facultyLastNameSearch': facultyLastNameSearch.value,
            'facultyEmailSearch': facultyEmailSearch.value,
        };

        $.ajax({
            url: '/searchFaculty',
            dataType: 'json',
            data: facultyData,
            cache: false,
            async: false,
            success: function (data) {
                facultyArray = data;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });

        var tableHeaders = ['First Name', 'Last Name', 'Email', 'Position'];
        var charList = [];

        if (document.getElementsByClassName("facultyTable")) {
            document.querySelectorAll('.facultyTable').forEach(e => e.remove());
        }
        console.log(facultyArray);
        facultyArray.forEach(fac => {
            console.log(fac);
            var firstChar = (fac[Object.keys(fac)[0]].charAt(0)).toUpperCase();

                if(charList.includes(firstChar)) {
                    var existingTable = document.getElementById(firstChar);
                    let row = document.createElement('tr');

                    Object.values(fac).forEach((text, index) => {
                        let cell = document.createElement('td');
                        if (index == 3) {
                            text = facultyTypeNames[text-2];
                        };
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    });

                    existingTable.appendChild(row);
                } else {
                charList.push(firstChar);

                let table = document.createElement('table');
                table.setAttribute("class", "facultyTable");
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

                    if (fac[Object.keys(fac)[0]].charAt(0) == firstChar){
                    let row = document.createElement('tr');

                    Object.values(fac).forEach((text, index) => {
                        let cell = document.createElement('td');
                        if (index == 3) {
                            text = facultyTypeNames[text-2];
                        };
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    });

                    table.appendChild(row);
                }

        document.getElementById('searchResults').appendChild(table);
    }
});
});

getUserTypes();

    function getUserTypes() {
    $.ajax({
        url: '/getUserTypes',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            facultyTypeNames = [];
            data.forEach(typeName => {
                facultyTypeNames.push(typeName[Object.keys(typeName)[0]]);
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    console.log(facultyTypeNames);