//declaring variables
//all faculty... variables are tied by the inputs/forms on the respective html page
//all reg... variables are to ensure that the user cannot enter a blank form, nor enter any incorrect information
var facultyFirstName = document.getElementById('userfirstname');
var facultyLastName = document.getElementById('userlastname');
var facultyAddress = document.getElementById('useraddress');
var facultyPhone = document.getElementById('userphone');
var facultyType = document.getElementById('usertype');
var facultyEmail = document.getElementById('useremail');
var facultyForm = document.getElementById('InsertFacultyForm');
var facultyPassword = document.getElementById('userpassword');
var facultyConfirmPassword = document.getElementById('userconfirmpassword');
let regFirstValid = false;
let regLastValid = false;
let regEmailValid = false;
let regPhoneValid = false;
let regPasswordValid = false;
let regConfirmPasswordValid = false;

//adding an event listener to the previously declared form to determine when the submit button has been clicked, and to run the following code
facultyForm.addEventListener("submit", function(e){
    //prevents the default event, which reloads the page
    e.preventDefault();

    //testing if any variables are incorrect
    //displays error message and returns, resulting in no actions being done
    if (regFirstValid == false || regLastValid == false || regEmailValid == false || regPhoneValid == false || regPasswordValid == false || facultyConfirmPassword == false) { 
        alert("One or more of the fields is incorrect or blank");
        return;
    } else {
        //creates an object that stores variables values tied to names, which are later sent to the server.js page
        var facultyData = {
            facultyFirstName: facultyFirstName.value,
            facultyLastName: facultyLastName.value,
            facultyAddress: facultyAddress.value,
            facultyPhone: facultyPhone.value,
            facultyType: facultyType.value,
            facultyEmail: facultyEmail.value,
            facultyPassword: facultyPassword.value,
        };

        //AJAX function to send the previously declared object to the server.js page, which results in the data being inserted VIA SQL
        //provides an error message if information could not be sent correctly
        $.ajax({
            url: '/insertFaculty',
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
    }
    //alerts the user that the new faculty member has been inserted/added to the database
    alert("Faculty Member "+facultyFirstName+" "+facultyLastName+" as "+facultyType.options[facultyType.selectedIndex].text+" Successfully added");
    location.reload();
});

//the following event listeners all perform the same functions with few exceptions.
//adds an event listener to particular inputs, creating a regex that satisfies needs
//creates a local variable that will be used as a boolean to switch another global boolean to determine if the user has correctly entered information
//if statements provide different error messages and all ensure the global boolean variabl is false, unless rules are adhered to.
facultyFirstName.addEventListener("blur", function(){
    var regex = /^([A-Z]{1}[a-zA-Z]{1,25})*$/;
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

facultyLastName.addEventListener("blur", function(){
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

facultyEmail.addEventListener("blur", function (){
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

facultyPhone.addEventListener("blur", function(){
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

facultyPassword.addEventListener("blur", function(){
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

facultyConfirmPassword.addEventListener("blur", function(){

    if (facultyConfirmPassword.value != facultyPassword.value) {
        document.getElementById('errMessageConfirmPassword').innerHTML = "Password does not match";
        regConfirmPasswordValid = false;
    } else {
        document.getElementById('errMessageConfirmPassword').innerHTML = "";
        regConfirmPasswordValid = true;
    }
});