var roomNumber = document.getElementById('roomNumber');
var resDay = document.getElementById('reservationDay');
var resTime = document.getElementById('reservationTime');
var resTrainer = document.getElementById('reservationTrainer');
var resClient = document.getElementById('reservationClient');
var reservationForm = document.getElementById('InsertReservationForm');
var regDay = false;
var regTime = false;
var rId;

reservationForm.addEventListener("submit", function(e){
    e.preventDefault();

    if (regDay == false || regTime == false) {
        alert("One or more of the fields is incorrect or blank");
        return;
    } else {
    function getReservationId() {
        $.ajax({
            url: '/getMaxReservationId',
            dataType: 'json',
            cache: false,
            async: false,
            success: function (data) {
                data.forEach(element => {
                    if ((element[Object.keys(element)[0]]) == null) {
                        rId = 0;
                    } else {
                        rId = (element[Object.keys(element)[0]]);
                    }
                });
            }
        });
        return rId;
    }

    rId = getReservationId();
    rId = Number(rId);
    rId += 1;

        var reservationData = {
            rId: rId,
            roomNumber: roomNumber.value,
            resDay: resDay.value,
            resTime: resTime.value,
            resTrainer: resTrainer.value,
            resClient: resClient.value
        };

        $.ajax({
            url: '/insertReservation',
            dataType: 'json',
            type: 'POST',
            data: reservationData,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
        alert("Reservation successfully placed for "+resClient.options[resClient.selectedIndex].text);
    }
    location.reload();
});

resDay.addEventListener("blur", function() {
    var q = new Date();
    var m = q.getMonth();
    var d = q.getDate();
    var y = q.getFullYear();

    var currentDate = new Date(y,m,d).toISOString();

    selectedDate = resDay.value;
    if (resDay.value <= currentDate) {
        document.getElementById('errMessageDay').innerHTML = "Reservation must be made at least a day in advance";
        regDay = false;
    } else {
        regDay = true;
        document.getElementById('errMessageDay').innerHTML = "";
    };
});

resTime.addEventListener("blur", function() {
    selectedTime = resTime.value.slice(0,2);
    if (selectedTime < 9 || (selectedTime > 19)) {
        document.getElementById('errMessageTime').innerHTML = "Reservations can only be between 9AM and before 8PM";
        regTime = false;
    } else {
        document.getElementById('errMessageTime').innerHTML = "";
        regTime = true;
    };
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