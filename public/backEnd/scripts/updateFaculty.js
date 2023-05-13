var facultyId = document.getElementById('facultyId');
var facultyFirstName = document.getElementById('userfirstname');
var facultyLastName = document.getElementById('userlastname');
var facultyAddress = document.getElementById('useraddress');
var facultyPhone = document.getElementById('userphone');
var facultyType = document.getElementById('usertype');
var facultyEmail = document.getElementById('useremail');
var facultyForm = document.getElementById('UpdateFacultyForm');
var facultyPassword = document.getElementById('userpassword');
var facultyConfirmPassword = document.getElementById('userconfirmpassword');
var table = document.getElementById("allFacultyResults");
var facultyTypeNames = [];
var allFaculty = [];
var allFacultyId = [];
var allFacultyFirstName = [];
var allFacultyLastName = [];
var allFacultyAddress = [];
var allFacultyEmail = [];
var allFacultyPhone = [];
var allFacultyPermission = [];
var facultyCurrentId;
var facultyCurrentFirstName;
var facultyCurrentLastName;
var facultyCurrentAddress;
var facultyCurrentPhone;
var facultyCurrentEmail;
var facultyCurrentType;
var facultyCurrentPassword;
let regIdValid = false;
let regFirstValid = true;
let regLastValid = true;
let regEmailValid = true;
let regPhoneValid = true;
let regPasswordValid = true;
let regConfirmPasswordValid = true;

facultyForm.addEventListener("submit", function(e){
    e.preventDefault();

    if (regFirstValid == false || regLastValid == false || regEmailValid == false || regPhoneValid == false || regPasswordValid == false || facultyConfirmPassword == false) { 
        alert("One or more of the fields is incorrect or blank");
        return;
    } else if (regIdValid == false) {
        alert("Faculty Id must be a valid Id");
        return;
    } else {
        var facultyFirstNameValue = facultyFirstName.value;
        var facultyLastNameValue = facultyLastName.value;
        var facultyAddressValue = facultyAddress.value;
        var facultyPhoneValue = facultyPhone.value;
        var facultyEmailValue = facultyEmail.value;
        var facultyTypeValue = facultyType.value;
        var facultyPasswordValue = facultyPassword.value;

        if (facultyFirstName.value == "") {
            facultyFirstNameValue = facultyCurrentFirstName;
        } if (facultyLastName.value == "") {
            facultyLastNameValue = facultyCurrentLastName;
        } if (facultyPhone.value == "") {
            facultyPhoneValue = facultyCurrentPhone;
        } if (facultyAddress.value == "") {
            facultyAddressValue = facultyCurrentAddress;
        } if (facultyEmail.value == "") {
            facultyEmailValue = facultyCurrentEmail;
        } if (facultyType.value == "") {
            facultyTypeValue = facultyCurrentType;
        } if (facultyPassword.value == "") {
            facultyPasswordValue = facultyCurrentPassword;
        }

        var facultyData = {
            facultyId: facultyId.value,
            facultyFirstName: facultyFirstNameValue,
            facultyLastName: facultyLastNameValue,
            facultyAddress: facultyAddressValue,
            facultyPhone: facultyPhoneValue,
            facultyType: facultyTypeValue,
            facultyEmail: facultyEmailValue,
            facultyPassword: facultyPasswordValue,
        };
        console.log(facultyData);
        $.ajax({
            url: '/updateFaculty',
            dataType: 'json',
            type: 'POST',
            data: facultyData,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
        alert("Faculty Member "+facultyData.facultyFirstName+" "+facultyData.facultyLastName+" Successfully updated");
    }
});

facultyId.addEventListener("blur", function(){
    
    var regex = /^([1-9])*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageId').innerHTML = "faculty Id must only contain numbers";
        regIdValid = false;
    } else if (!this.value){
        document.getElementById('errMessageId').innerHTML = "Field cannot be empty";
        regIdValid = false;
    } else {
        document.getElementById('errMessageId').innerHTML = "";
        regIdValid = true;

        var getFacultyId = {facultyId: this.value};
    
        $.ajax({
            url: '/getFacultyById',
            dataType: 'json',
            cache: false,
            async: false,
            data: getFacultyId,
            success: function (data) {
                data.forEach(id => {
                    facultyCurrentId = (id[Object.keys(id)[0]]);
                    });
                data.forEach(name => {
                    facultyCurrentFirstName = (name[Object.keys(name)[2]]);
                    });
                data.forEach(name => {
                    facultyCurrentLastName = (name[Object.keys(name)[3]]);
                    });
                data.forEach(address => {
                    facultyCurrentAddress = (address[Object.keys(address)[4]]);
                    });
                data.forEach(phone => {
                    facultyCurrentPhone = (phone[Object.keys(phone)[6]]);
                    });
                data.forEach(email => {
                    facultyCurrentEmail = (email[Object.keys(email)[5]]);
                    });
                data.forEach(type => {
                    facultyCurrentType = (type[Object.keys(type)[1]]);
                    });
                data.forEach(password => {
                    facultyCurrentPassword = (password[Object.keys(password)[7]]);
                    });
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(status, err.toString());
                }.bind(this)
            });
    }
});
facultyFirstName.addEventListener("blur", function(){
    if (this.value) {
    var regex = /^([A-Z]{1}[a-zA-Z]{1,25})*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageFirstName').innerHTML = "First Name has to start with an upper case letter and can only contain letters";
        regFirstValid = false;
    } else if (!this.value){
        document.getElementById('errMessageFirstName').innerHTML = "";
        regFirstValid = true;
    };
} else {
    document.getElementById('errMessageFirstName').innerHTML = "";
    regFirstValid = true;
};
});

facultyLastName.addEventListener("blur", function(){
    if (this.value) {
    var regex = /^([A-Z]{1}[a-zA-Z]{1,25})*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageLastName').innerHTML = "Last Name has to start with an upper case letter and can only contain letters";
        regLastValid = false;
    } else if (!this.value){
        document.getElementById('errMessageLastName').innerHTML = "";
        regLastValid = true;
    };
} else {
    document.getElementById('errMessageLastName').innerHTML = "";
    regLastValid = true;
}
});

facultyEmail.addEventListener("blur", function (){
    if (this.value) {
    var regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
    var regTest = regex.test(this.value);

    if (regTest == false) {
        document.getElementById('errMessageEmail').innerHTML = "Incorrect Email";
        regEmailValid = false;
    } else if (!this.value){
        document.getElementById('errMessageEmail').innerHTML = "";
        regEmailValid = true;
    };
} else {
    document.getElementById('errMessageEmail').innerHTML = "";
    regEmailValid = true;
};
});

facultyPhone.addEventListener("blur", function(){
    if (this.value) {
    var regex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessagePhone').innerHTML = "Phone number is incorrect";
        regPhoneValid = false;
    } else if (!this.value){
        document.getElementById('errMessagePhone').innerHTML = "";
        regPhoneValid = true;
    };
} else {
    document.getElementById('errMessagePhone').innerHTML = "";
    regPhoneValid = true;
};
});

facultyPassword.addEventListener("blur", function(){

    if (this.value) {
        var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        var regTest = regex.test(this.value);

        if (regTest == false) {
            document.getElementById('errMessagePassword').innerHTML = "Password must contain at least eight characters, at least one uppercase letter, one lowercase letter and one number";
            regPasswordValid = false;
        } else {
            document.getElementById('errMessagePassword').innerHTML = "";
            regPasswordValid = true;
        }
} else {
    document.getElementById('errMessagePassword').innerHTML = "";
    regPasswordValid = true;
};
});

facultyConfirmPassword.addEventListener("blur", function(){

    if (facultyPassword.value && !facultyConfirmPassword.value) {
        document.getElementById('errMessageConfirmPassword').innerHTML = "Please confirm your password";
        regConfirmPasswordValid = false;
    } else if (facultyConfirmPassword.value != facultyPassword.value) {
            document.getElementById('errMessageConfirmPassword').innerHTML = "Passwords do not match";
            regConfirmPasswordValid = false;
        } else if (facultyConfirmPassword.value == facultyPassword.value){
            document.getElementById('errMessageConfirmPassword').innerHTML = "";
            regConfirmPasswordValid = true;
        };
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

$.ajax({
    url: '/getFacultyById',
    dataType: 'json',
    cache: false,
    async: false,
    data: {facultyId: ""},
    success: function (data) {
      allFaculty = data;
      console.log(allFaculty);
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(status, err.toString());
        }.bind(this)
    });

    allFaculty.forEach(cor => {
        console.log(cor);
        let row = table.insertRow(-1);
        Object.values(cor).forEach((text, index) => {
            if (index == 0) {
                allFacultyId.push(text);
            } else if (index == 1) {
                allFacultyPermission.push(text);
                text = facultyTypeNames[text-2];
            } else if (index == 2) {
                allFacultyFirstName.push(text);
            } else if (index == 3) {
                allFacultyLastName.push(text);
            } else if (index == 4) {
                allFacultyAddress.push(text);
            } else if (index == 5) {
                allFacultyEmail.push(text);
            } else if (index == 6) {
                allFacultyPhone.push(text);
            } else if (index == 7) {
                return;
            }
            let cell = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            if (index == 0) {
                storeText = text;
            };
            row.appendChild(cell);
            if (index == 6) {
                let selectButton = document.createElement('button');
                selectButton.innerHTML = "Change Faculty";
                selectButton.className = "facultyChange";
                selectButton.id = storeText;
                selectButton.addEventListener("click", function(e) {
                    changeFaculty(this.id);
                });
                row.appendChild(selectButton);
                let deleteButton = document.createElement('button');
                deleteButton.innerHTML = "Delete Faculty";
                deleteButton.className = "facultyDelete";
                deleteButton.id = storeText;
                deleteButton.addEventListener("click", function(e) {
                    deleteFaculty(this.id);
                });
                row.appendChild(deleteButton);
            };
        });
        table.appendChild(row);
        });

        function changeFaculty(index) {
            regIdValid = true;
            facultyId.value = allFacultyId[index-1];
            facultyType.value = allFacultyPermission[index-1];
            facultyFirstName.value = allFacultyFirstName[index-1];
            facultyLastName.value = allFacultyLastName[index-1];
            facultyAddress.value = allFacultyAddress[index-1];
            facultyEmail.value = allFacultyEmail[index-1];
            facultyPhone.value = allFacultyPhone[index-1]
        }

        function deleteFaculty(index) {
            var uI = confirm("Are you sure you want to delete faculty member "+index+"?");
            if (uI == true) {
                $.ajax({
                    url: '/deleteFaculty',
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

                alert("Faculty member "+index+" has been deleted");
            } else {
                return;
            }
        }