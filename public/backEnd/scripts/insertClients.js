var clientFirstName = document.getElementById('userfirstname');
var clientLastName = document.getElementById('userlastname');
var clientAddress = document.getElementById('useraddress');
var clientPhone = document.getElementById('userphone');
var clientEmail = document.getElementById('useremail');
var clientForm = document.getElementById('InsertClientsForm');
var clientPassword = document.getElementById('userpassword');
var clientConfirmPassword = document.getElementById('userconfirmpassword');
let regFirstValid = false;
let regLastValid = false;
let regEmailValid = false;
let regPhoneValid = false;
let regPasswordValid = false;
let regConfirmPasswordValid = false;

clientForm.addEventListener("submit", function(e){
    e.preventDefault();

    if (regFirstValid == false || regLastValid == false || regEmailValid == false || regPhoneValid == false || regPasswordValid == false || regConfirmPasswordValid == false) { 
        alert("One or more of the fields is incorrect or blank");
        return;
    } else {
        var clientData = {
            clientFirstName: clientFirstName.value,
            clientLastName: clientLastName.value,
            clientAddress: clientAddress.value,
            clientPhone: clientPhone.value,
            clientEmail: clientEmail.value,

        };

        $.ajax({
            url: '/insertClient',
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
    }
    alert("Client "+clientFirstName+" "+clientLastName+" Successfully added");
    location.reload();
});

clientFirstName.addEventListener("blur", function(){
    var regex = /^([A-Z]{1}[A-Za-z]{1,25})*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageFirstName').innerHTML = "First Name has to start with an upper case letter and can only contain letters";
        regFirstValid = false;
    } else if (!this.value){
        document.getElementById('errMessageFirstName').innerHTML = "Field cannot be empty";
        regFirstValid = false;
    } else {
        document.getElementById('errMessageFirstName').innerHTML = "";
        regFirstValid = true;
    }
});

clientLastName.addEventListener("blur", function(){
    var regex = /^([A-Z]{1}[a-zA-Z]{1,25})*$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessageLastName').innerHTML = "Last Name has to start with an upper case letter and can only contain letters";
        regLastValid = false;
    } else if (!this.value){
        document.getElementById('errMessageLastName').innerHTML = "Field cannot be empty";
        regLastValid = false;
    } else {
        document.getElementById('errMessageLastName').innerHTML = "";
        regLastValid = true;
    }
});

clientEmail.addEventListener("blur", function (){
    var regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
    var regTest = regex.test(this.value);

    if (regTest == false) {
        document.getElementById('errMessageEmail').innerHTML = "Incorrect Email";
        regEmailValid = false;
    } else if (!this.value){
        document.getElementById('errMessageEmail').innerHTML = "Field cannot be empty";
        regEmailValid = false;
    } else {
        document.getElementById('errMessageEmail').innerHTML = "";
        regEmailValid = true;
    }
});

clientPhone.addEventListener("blur", function(){
    var regex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    var regTest = regex.test(this.value);
    
    if (regTest == false) {
        document.getElementById('errMessagePhone').innerHTML = "Phone number is incorrect";
        regPhoneValid = false;
    } else if (!this.value){
        document.getElementById('errMessagePhone').innerHTML = "Field cannot be empty";
        regPhoneValid = false;
    } else {
        document.getElementById('errMessagePhone').innerHTML = "";
        regPhoneValid = true;
    }
});

clientPassword.addEventListener("blur", function(){
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    var regTest = regex.test(this.value);

    if (regTest == false) {
        document.getElementById('errMessagePassword').innerHTML = "Password must contain at least eight characters, at least one uppercase letter, one lowercase letter and one number";
        regPasswordValid = false;
    } else if (!this.value){
        document.getElementById('errMessagePassword').innerHTML = "Field cannot be empty";
        regPasswordValid = false;
    } else {
        document.getElementById('errMessagePassword').innerHTML = "";
        regPasswordValid = true;
    }
});

clientConfirmPassword.addEventListener("blur", function(){

    if (clientConfirmPassword.value != clientPassword.value) {
        document.getElementById('errMessageConfirmPassword').innerHTML = "Password does not match";
        regConfirmPasswordValid = false;
    } else {
        document.getElementById('errMessageConfirmPassword').innerHTML = "";
        regConfirmPasswordValid = true;
    }
});