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

    // Check if username already exists
    $stmt_check_username = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $stmt_check_username->execute([$username]);
    $count = $stmt_check_username->fetchColumn();

    if ($count > 0) {
        // Username already exists, display error message
        echo "<script>alert('Username already exists. Please choose a different username.');</script>";
        echo "<script>window.location.href = 'loginPage.php';</script>"; // redirect user after dismissing the message prompt
    } else {
        // Username is available, proceed with registration
        // prepare SQL statement
        $stmt = $pdo->prepare("INSERT INTO users (username, fullname, password, phone_number) VALUES (?, ?, ?, ?)");

        // bind parameters
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $fullname);
        $stmt->bindParam(3, $hashed_password);
        $stmt->bindParam(4, $phone_number);

        if ($stmt->execute()) {
            echo "<script>alert('Account created successfully. Please log in now.');</script>";
            echo "<script>window.location.href = 'loginPage.php';</script>"; // redirect user after dismissing the message prompt
            exit; // stop further execution for security reasons
        } else {
            echo "Error: Unable to register user.";
        }
    }
}