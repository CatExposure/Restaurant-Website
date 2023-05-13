//declaring variables to be used globally
//sessionStorage.removeItem("Permission");
//console.log(sessionStorage.getItem("Permission"));

var signForm = document.getElementById("signInForm");
var adminEmail = document.getElementById("email");
var adminPassword = document.getElementById("pwd");

//eventlistener for the sign form to run when the submit button is clicked
signForm.addEventListener("submit", function(e) {
    //prevents the page from loading
    e.preventDefault();

    //creating regex for the password and email then testing them using the values the user entered
    var regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    var regexEmail = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
    var regTestEmail = regexEmail.test(adminEmail.value);
    var regTestPassword = true; //regexPassword.test(adminPassword.value);

    //gives an error and returns depending on the regtest results
    if (regTestEmail == false) {
        alert("Email is invalid");
        return;
    } else if (regTestPassword == false) {
        alert("Password is invalid");
        return;
    } else if (!adminEmail.value || !adminPassword.value) {
        alert("Fields cannot be blank");
        return;
    } else {
        //creating an array by declaring variable names that have a value tied to them
         var logininfo = {
            adminEmail: adminEmail.value,
            adminPassword: adminPassword.value
        };
        console.log(logininfo);

        //AJAX function to return a redirect if the given values match a stored record
        $.ajax({
            url: '/loginAdmin/',
            dataType: 'json',
            type: 'POST',
            data: logininfo,
            success: function (data) {
                console.log("it worked?");
                $.ajax({
                    url: '/getAdminType/',
                    dataType: 'json',
                    data: {aemail: adminEmail.value},
                    success: function (data2) {
                        //sessionStorage.setItem("Permission", data2[0].userTypeId);
                        //console.log(sessionStorage.getItem("Permission"));
                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.error(status, err.toString());
                    }.bind(this)
                });

                location.href = "http://localhost:3000/backEnd/home.html"
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }.bind(this)
        });
    }
});

//the following two event listeners run whenever their respective element is deselected
adminEmail.addEventListener("blur", function (){
    //creates a regex for the specific element and tests it against the value the user entered
    var regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;
    var regTest = regex.test(this.value);

    //sets the text of the corresponding element depending on the regtest results
    if (regTest == false) {
        document.getElementById('errMessageEmail').innerHTML = "Incorrect Email";
    } else if (!this.value){
        document.getElementById('errMessageEmail').innerHTML = "Field cannot be empty";
    } else {
        document.getElementById('errMessageEmail').innerHTML = "";
    }
});

/*adminPassword.addEventListener("blur", function(){
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    var regTest = regex.test(this.value);

    if (regTest == false) {
        document.getElementById('errMessagePassword').innerHTML = "Password must contain at least eight characters, at least one uppercase letter, one lowercase letter and one number";
    } else if (!this.value){
        document.getElementById('errMessagePassword').innerHTML = "Field cannot be empty";
    } else {
        document.getElementById('errMessagePassword').innerHTML = "";
    }
});*/