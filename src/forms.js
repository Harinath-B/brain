// function sendMail() {
//     var params = {
//         name: document.getElementById("name").value,
//         email: document.getElementById("email").value,
//         subject: document.getElementById("subject").value,
//         message: document.getElementById("message").value,
//     };
  
//     const serviceID = "service_tflaseo";
//     const templateID = "template_x3r0jjy";
  
//     emailjs.send(serviceID, templateID, params)
//         .then(res => {
//             document.getElementById("name").value = "";
//             document.getElementById("email").value = "";
//             document.getElementById("subject").value = "";
//             document.getElementById("message").value = "";
  
//         })
//         .catch(err => console.log(err));
  
//   }


function sendMail() {
    // Prevent default form submission if needed
    event.preventDefault();

    // Collect form data
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var subject = document.getElementById('subject').value;
    var message = document.getElementById('message').value;

    // You would then need to send this data to a server
    // This is just a placeholder for whatever your email sending solution is
    var formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);

    // Example: using EmailJS or another client-side service
    emailjs.sendForm('service_tflaseo', 'template_x3r0jjy', formData)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            // Handle success (e.g., display a success message)
        }, function(error) {
            console.log('FAILED...', error);
            // Handle errors
        });
        document.addEventListener('DOMContentLoaded', function () {
            document.getElementById('sendButton').addEventListener('click', sendMail);
        });
        
}
