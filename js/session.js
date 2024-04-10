// cookieManager.js

// // Function to set session cookie
// function setSessionCookie(userData, expiryDays) {
//     var expiryDate = new Date();
//     expiryDate.setDate(expiryDate.getDate() + expiryDays);
//
//     document.cookie = `sessionData=${userData}; expires=${expiryDate.toUTCString()}; path=/`;
// }
//
// // Function to delete session cookie
// function deleteSessionCookie() {
//     document.cookie = "sessionData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
// }
//
// // // Function to get session data from cookie
// // function getSessionData() {
// //     var cookies = document.cookie.split(';');
// //     for (var i = 0; i < cookies.length; i++) {
// //         var cookie = cookies[i].trim();
// //         if (cookie.startsWith('sessionData=')) {
// //             return cookie.substring('sessionData='.length, cookie.length);
// //         }
// //     }
// //     return null;
// // }
