var clientName = document.getElementById('userName');
var clientPhone = document.getElementById('userPhone');
var clientEmail = document.getElementById('userEmail');
var clientMessage = document.getElementById('userMessage');
var contactForm = document.getElementById("ContactUsForm");
var regNameValid = false;
var regPhoneValid = false;
var regEmailValid = false;
var regMessageValid = false;

contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (regNameValid == false || regPhoneValid == false || regEmailValid == false || regMessageValid == false) { 
        alert("One or more of the fields is incorrect or blank");
        return;
    } else {

    var contactInfo = {
        clientName: clientName.value,
        clientPhone: clientPhone.value,
        clientEmail: clientEmail.value,
        clientMessage: clientMessage.value
    }

    alert("Thank you "+contactInfo.clientName+" for contacting us! We will get back to you as soon as possible with the email "+contactInfo.clientEmail);
}
});

clientName.addEventListener("blur", function(e) {
    if (!clientName) {
        document.getElementById("errMessageName").innerHTML = "Field cannot be blank";
        regNameValid = false;
    } else {
        document.getElementById("errMessageName").innerHTML = "";
        regNameValid = true;
    }
});

clientPhone.addEventListener("blur", function(e) {
    if (!clientPhone) {
        document.getElementById("errMessagePhone").innerHTML = "Field cannot be blank";
        regPhoneValid = false;
    } else {
        document.getElementById("errMessagePhone").innerHTML = "";
        regPhoneValid = true;
    }
});

clientEmail.addEventListener("blur", function(e) {
    if (!clientEmail) {
        document.getElementById("errMessageEmail").innerHTML = "Field cannot be blank";
        regEmailValid = false;
    } else {
        document.getElementById("errMessageEmail").innerHTML = "";
        regEmailValid = true;
    }
});

clientMessage.addEventListener("blur", function(e) {
    if (!clientMessage) {
        document.getElementById("errMessageMsg").innerHTML = "Field cannot be blank";
        regMessageValid = false;
    } else {
        document.getElementById("errMessageMsg").innerHTML = "";
        regMessageValid = true;
    }
});

