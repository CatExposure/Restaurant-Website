var resId = document.getElementById('reservationId');
var roomNumber = document.getElementById('roomNumber');
var resDay = document.getElementById('reservationDay');
var resTime = document.getElementById('reservationTime');
var resTrainer = document.getElementById('reservationTrainer');
var resClient = document.getElementById('reservationClient');
var reservationForm = document.getElementById('UpdateReservationForm');
var table = document.getElementById("allReservationResults");
var allReservationId = [];
var allReservationRoom = [];
var allReservationDate = [];
var allReservationTime = [];
var allReservationTrainer = [];
var allReservationClient = [];
var resCurrentRoom;
var resCurrentDay;
var resCurrentTime;
var resCurrentTrainer;
var resCurrentClient;
var regIdValid = false;
var regDay = true;
var regTime = true;

reservationForm.addEventListener("submit", function(e){
    e.preventDefault();

    if (regDay == false || regTime == false) {
        alert("One or more of the fields is incorrect or blank");
        return;
    } else if (regIdValid == false) {
        alert("Reservation Id must be a valid Id");
        return;
    } else {

        var resRoomValue = roomNumber.value;
        var resDayValue = resDay.value;
        var resTimeValue = resTime.value;
        var resTrainerValue = resTrainer.value;
        var resClientValue = resClient.value;

        if (roomNumber.value == "") {
            resRoomValue = resCurrentRoom;
        } if (resDay.value == "") {
            resDayValue = resCurrentDay;
        } if (resTime.value == "") {
            resTimeValue = resCurrentTime;
        } if (resTrainer.value == "") {
            resTrainerValue = resCurrentTrainer;
        } if (resClient.value == "") {
            resClientValue = resCurrentClient;
        }

        var reservationData = {
            rId: resId.value,
            roomNumber: resRoomValue,
            resDay: resDayValue,
            resTime: resTimeValue,
            resTrainer: resTrainerValue,
            resClient: resClientValue
        };

        $.ajax({
            url: '/updateReservation',
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
        alert("Reservation successfully updated");
    }
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

resId.addEventListener("blur", function(){
    
    var regex = /^([1-9])*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageId').innerHTML = "Reservation Id must only contain numbers";
        regIdValid = false;
    } else if (!this.value){
        document.getElementById('errMessageId').innerHTML = "Field cannot be empty";
        regIdValid = false;
    } else {
        document.getElementById('errMessageId').innerHTML = "";
        regIdValid = true;

        var getResId = {reservationId: this.value};
    
        $.ajax({
            url: '/getReservationById',
            dataType: 'json',
            cache: false,
            async: false,
            data: getResId,
            success: function (data) {
                data.forEach(room => {
                    resCurrentRoom = (room[Object.keys(room)[1]]);
                    });
                data.forEach(day => {
                    resCurrentDay = (day[Object.keys(day)[2]]);
                    });
                data.forEach(time => {
                    resCurrentTime = (time[Object.keys(time)[3]]);
                    });
                data.forEach(trainer => {
                    resCurrentTrainer = (trainer[Object.keys(trainer)[4]]);
                    });
                data.forEach(client => {
                    resCurrentClient = (client[Object.keys(client)[5]]);
                    });
                    console.log(data);
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
    }
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

    $.ajax({
        url: '/getReservationById',
        dataType: 'json',
        cache: false,
        async: false,
        data: {reservationId: ""},
        success: function (data) {
            allReservations = data;
            console.log(allReservations);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    
        allReservations.forEach(cor => {
            console.log(cor);
            let row = table.insertRow(-1);
            Object.values(cor).forEach((text, index) => {
                if (index == 0) {
                    allReservationId.push(text);
                } else if (index == 1) {
                    allReservationRoom.push(text);
                } else if (index == 2) {
                    text = new Date(text).toISOString().split('T')[0];
                    allReservationDate.push(text);
                    text = new Date(text).toLocaleDateString();
                } else if (index == 3) {
                    allReservationTime.push(text);
                } else if (index == 4) {
                    allReservationTrainer.push(text);
                    text = facultyNames[text-1];
                } else if (index == 5) {
                    allReservationClient.push(text);
                    text = clientNames[text-1];
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
                    selectButton.innerHTML = "Change Reservation";
                    selectButton.className = "reservationChange";
                    selectButton.id = storeText;
                    selectButton.addEventListener("click", function(e) {
                        changeReservation(this.id);
                    });
                    row.appendChild(selectButton);
                    let deleteButton = document.createElement('button');
                    deleteButton.innerHTML = "Delete Reservation";
                    deleteButton.className = "reservationDelete";
                    deleteButton.id = storeText;
                    deleteButton.addEventListener("click", function(e) {
                        deleteReservation(this.id);
                    });
                    row.appendChild(deleteButton);
                };
            });
            table.appendChild(row);
            console.log(table);
            });
    
            function changeReservation(index) {
                regIdValid = true;
                resId.value = allReservationId[index-1];
                roomNumber.value = allReservationRoom[index-1];
                resDay.value = allReservationDate[index-1];
                resTime.value = allReservationTime[index-1]
                resTrainer.value = allReservationTrainer[index-1]
                resClient.value = allReservationClient[index-1]
            }
    
            function deleteReservation(index) {
                var uI = confirm("Are you sure you want to delete Reservation "+index+"?");
                if (uI == true) {
                    $.ajax({
                        url: '/deleteReservation',
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
    
                    alert("Reservation "+index+" has been deleted");
                } else {
                    return;
                }
            }