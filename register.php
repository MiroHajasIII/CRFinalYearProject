<?php
// include the Database class
require_once 'Models/database.php';

// check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // get form data
    $username = $_POST['reg_username'];
    $fullname = $_POST['fullname'];
    $password = $_POST['reg_password'];
    $phone_number = $_POST['phone_number'];

    // hash the password for security
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // create a new instance of the Database class
    $db = Database::getInstance();
    // get database connection
    $pdo = $db->getdbConnection();
    // prepare SQL statement
    $stmt = $pdo->prepare("INSERT INTO users (username, fullname, password, phone_number) VALUES (?, ?, ?, ?)");

    // bind parameters
    $stmt->bindParam(1, $username);
    $stmt->bindParam(2, $fullname);
    $stmt->bindParam(3, $hashed_password);
    $stmt->bindParam(4, $phone_number);

    if ($stmt->execute()) {
        echo "User registered successfully!";
    } else {
        echo "Error: Unable to register user.";
    }
}