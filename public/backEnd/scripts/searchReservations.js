var roomNumber = document.getElementById('roomNumber');
var resDay = document.getElementById('reservationDay');
var resTime = document.getElementById('reservationTime');
var resTrainer = document.getElementById('reservationTrainer');
var resClient = document.getElementById('reservationClient');
var reservationForm = document.getElementById('SearchReservationForm');
var roomSort = document.getElementById("sortImageRoom");
var dateSort = document.getElementById("sortImageDate");
var timeSort = document.getElementById("sortImageTime");
var trainerSort = document.getElementById("sortImageTrainer");
var clientSort = document.getElementById("sortImageClient");
var resArray = [];
var table = document.getElementById('reservationTable');
var rId;

reservationForm.addEventListener("submit", function(e){
    e.preventDefault();

    var reservationData = {
        roomNumber: roomNumber.value,
        resDay: resDay.value,
        resTime: resTime.value,
        resTrainer: resTrainer.value,
        resClient: resClient.value
    };

    console.log(reservationData);
    $.ajax({
        url: '/searchReservation',
        dataType: 'json',
        cache: false,
        async: false,
        data: reservationData,
        success: function (data) {
            resArray = data;
            console.log(resArray);
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });

    $("tr.test", table).remove();

    resArray.forEach(cor => {
        let row = table.insertRow(-1);
        row.className = "test";
        //creates a td html element and appends a textnode to it using the values of every element within the specified index, to then append the td element to the existing row
        Object.values(cor).forEach((text, index) => {
            if (index == 1) {
                console.log(text);
                text = new Date(text).toLocaleDateString();
            } else if (index == 3) {text = facultyNames[text-1];
            } else if (index == 4) {text = clientNames[text-1];};
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        });
        table.appendChild(row);
        console.log(row);
    });
    
});

getUserTypes();
    var i=0;
    facultyIds.forEach(id => {
    var option = document.createElement("option");
    option.value = id;
    option.text = facultyNames[i];
    resTrainer.add(option);
    i++;
});

    function getUserTypes() {
    $.ajax({
        url: '/getUserTypeId',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            facultyIds = [];
            facultyNames = [];
            data.forEach(id => {
                facultyIds.push(id[Object.keys(id)[0]]);
                });
            data.forEach(name => {
                facultyNames.push(name[Object.keys(name)[1]]);
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }

    getRooms();
    var i=0;
    roomIds.forEach(id => {
    var option = document.createElement("option");
    option.value = roomNames[i];
    option.text = roomNames[i];
    roomNumber.add(option);
    i++;
});

    function getRooms() {
    $.ajax({
        url: '/getRooms',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (data) {
            roomIds = [];
            roomNames = [];
            data.forEach(id => {
                roomIds.push(id[Object.keys(id)[0]]);
                });
            data.forEach(name => {
                roomNames.push(name[Object.keys(name)[1]]);
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
    resClient.add(option);
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

    roomSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 0;
        tableSort(j);
    });

    dateSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 1;
        tableSort(j);
    });

    timeSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 2;
        tableSort(j);
    });

    trainerSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 3;
        tableSort(j);
    });

    clientSort.addEventListener("click", function(e) {
        e.preventDefault();
        var j = 4;
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
            if (x.innerHTML > y.innerHTML) {
                shouldSwitch = true;
                break;
            }
            }
            if (shouldSwitch) {
            // if a switch has been marked, make the switch and mark that a switch has been done
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            }
        }
    };