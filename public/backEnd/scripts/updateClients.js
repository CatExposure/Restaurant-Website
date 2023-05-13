var clientId = document.getElementById('clientId');
var clientFirstName = document.getElementById('userfirstname');
var clientLastName = document.getElementById('userlastname');
var clientAddress = document.getElementById('useraddress');
var clientPhone = document.getElementById('userphone');
var clientEmail = document.getElementById('useremail');
var clientForm = document.getElementById('UpdateClientsForm');
var table = document.getElementById("allClientResults");
var allClients = [];
var allClientId = [];
var allClientFirstName = [];
var allClientLastName = [];
var allClientAddress = [];
var allClientEmail = [];
var allClientPhone = [];
var clientCurrentId;
var clientCurrentFirstName;
var clientCurrentLastName;
var clientCurrentAddress;
var clientCurrentPhone;
var clientCurrentEmail;
let regIdValid = false;
let regFirstValid = true;
let regLastValid = true;
let regEmailValid = true;
let regPhoneValid = true;

clientForm.addEventListener("submit", function(e){
    e.preventDefault();

    if (regFirstValid == false || regLastValid == false || regEmailValid == false || regPhoneValid == false) { 
        alert("One or more of the fields is incorrect");
        return;
    } else if (regIdValid == false) {
        alert("Client Id must be a valid Id");
        return;
    } else {

        var clientFirstNameValue = clientFirstName.value;
        var clientLastNameValue = clientLastName.value;
        var clientAddressValue = clientAddress.value;
        var clientPhoneValue = clientPhone.value;
        var clientEmailValue = clientEmail.value;

        if (clientFirstName.value == "") {
            clientFirstNameValue = clientCurrentFirstName;
        } if (clientLastName.value == "") {
            clientLastNameValue = clientCurrentLastName;
        } if (clientPhone.value == "") {
            clientPhoneValue = clientCurrentPhone;
        } if (clientAddress.value == "") {
            clientAddressValue = clientCurrentAddress;
        } if (clientEmail.value == "") {
            clientEmailValue = clientCurrentEmail;
        }

        var clientData = {
            clientId: clientId.value,
            clientFirstName: clientFirstNameValue,
            clientLastName: clientLastNameValue,
            clientAddress: clientAddressValue,
            clientPhone: clientPhoneValue,
            clientEmail: clientEmailValue
        };
        console.log(clientData);
        $.ajax({
            url: '/updateClient',
            dataType: 'json',
            type: 'POST',
            data: clientData,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
        alert("Client "+clientData.clientFirstName+" "+clientData.clientLastName+" Successfully updated");
    }
});

clientId.addEventListener("blur", function(){
    
    var regex = /^([1-9])*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageId').innerHTML = "Client Id must only contain numbers";
        regIdValid = false;
    } else if (!this.value){
        document.getElementById('errMessageId').innerHTML = "Field cannot be empty";
        regIdValid = false;
    } else {
        document.getElementById('errMessageId').innerHTML = "";
        regIdValid = true;

        var getClientId = {clientId: this.value};
    
        $.ajax({
            url: '/getClientById',
            dataType: 'json',
            cache: false,
            async: false,
            data: getClientId,
            success: function (data) {
                data.forEach(id => {
                    clientCurrentId = (id[Object.keys(id)[0]]);
                    });
                data.forEach(name => {
                    clientCurrentFirstName = (name[Object.keys(name)[1]]);
                    });
                data.forEach(name => {
                    clientCurrentLastName = (name[Object.keys(name)[2]]);
                    });
                data.forEach(address => {
                    clientCurrentAddress = (address[Object.keys(address)[3]]);
                    });
                data.forEach(phone => {
                    clientCurrentPhone = (phone[Object.keys(phone)[5]]);
                    });
                data.forEach(email => {
                    clientCurrentEmail = (email[Object.keys(email)[4]]);
                    });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
    }
});

clientFirstName.addEventListener("blur", function(){

    if (this.value) {
    var regex = /^([A-Z]{1}[A-Za-z]{1,25})*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageFirstName').innerHTML = "First Name has to start with an upper case letter and can only contain letters";
        regFirstValid = false;
    } else if (this.value == "") {
        document.getElementById('errMessageFirstName').innerHTML = "";
        regFirstValid = true;
    };
} else {
    document.getElementById('errMessageFirstName').innerHTML = "";
    regFirstValid = true;
};
});

clientLastName.addEventListener("blur", function(){

    if (this.value) {
    var regex = /^([A-Z]{1}[a-zA-Z]{1,25})*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageLastName').innerHTML = "Last Name has to start with an upper case letter and can only contain letters";
        regLastValid = false;
    } else if (this.value == "") {
        document.getElementById('errMessageLastName').innerHTML = "";
        regLastValid = true;
    };
} else {
    document.getElementById('errMessageLastName').innerHTML = "";
    regLastValid = true;
};
});

clientEmail.addEventListener("blur", function (){

    if (this.value) {
    var regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
    var regTest = regex.test(this.value);

    if (regTest == false) {
        document.getElementById('errMessageEmail').innerHTML = "Incorrect Email";
        regEmailValid = false;
    } else if (this.value == "") {
        document.getElementById('errMessageEmail').innerHTML = "";
        regEmailValid = true;
    };
} else {
    document.getElementById('errMessageEmail').innerHTML = "";
    regEmailValid = true;
};
});

clientPhone.addEventListener("blur", function(){

    if (this.value) {
    var regex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessagePhone').innerHTML = "Phone number is incorrect";
        regPhoneValid = false;
    } else if (this.value == "") {
        document.getElementById('errMessagePhone').innerHTML = "";
        regPhoneValid = true;
    };
} else {
    document.getElementById('errMessagePhone').innerHTML = "";
    regPhoneValid = true;
};
});

$.ajax({
    url: '/getClientById',
    dataType: 'json',
    cache: false,
    async: false,
    data: {clientId: ""},
    success: function (data) {
      allClients = data;
      console.log(allClients);
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });

    allClients.forEach(cor => {
        console.log(cor);
        let row = table.insertRow(-1);
        Object.values(cor).forEach((text, index) => {
            if (index == 0) {
                allClientId.push(text);
            } else if (index == 1) {
                allClientFirstName.push(text);
            } else if (index == 2) {
                allClientLastName.push(text);
            } else if (index == 3) {
                allClientAddress.push(text);
            } else if (index == 4) {
                allClientEmail.push(text);
            } else if (index == 5) {
                allClientPhone.push(text);
            } else if (index == 6) {
                return;
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
                selectButton.innerHTML = "Change Client";
                selectButton.className = "clientChange";
                selectButton.id = storeText;
                selectButton.addEventListener("click", function(e) {
                    changeClient(this.id);
                });
                row.appendChild(selectButton);
                let deleteButton = document.createElement('button');
                deleteButton.innerHTML = "Delete Client";
                deleteButton.className = "clientDelete";
                deleteButton.id = storeText;
                deleteButton.addEventListener("click", function(e) {
                    deleteClient(this.id);
                });
                row.appendChild(deleteButton);
            };
        });
        table.appendChild(row);
        });

        function changeClient(index) {
            regIdValid = true;
            clientId.value = allClientId[index-1];
            clientFirstName.value = allClientFirstName[index-1];
            clientLastName.value = allClientLastName[index-1];
            clientAddress.value = allClientAddress[index-1];
            clientEmail.value = allClientEmail[index-1];
            clientPhone.value = allClientPhone[index-1]
        }

        function deleteClient(index) {
            var uI = confirm("Are you sure you want to delete client "+index+"?");
            if (uI == true) {
                $.ajax({
                    url: '/deleteClient',
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

                alert("Client "+index+" has been deleted");
            } else {
                return;
            }
        }