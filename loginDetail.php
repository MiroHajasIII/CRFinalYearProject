<?php
// include the Database class
require_once 'Models/database.php';

// start the session
session_start();

// check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $username = $_POST['username'];
    $password = $_POST['password'];

    // create a new instance of the Database class
    $db = Database::getInstance();
    // get database connection
    $pdo = $db->getdbConnection();
    // prepare SQL statement
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");

    // bind parameters
    $stmt->bindParam(1, $username);

    // execute the statement
    $stmt->execute();

    // fetch user record
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // verify password
    if ($user && password_verify($password, $user['password'])) {
        // Set session variables
        $_SESSION['username'] = $username;

        // Set session cookie
        setcookie("username", $username, time() + (86400 * 30), "/"); // 86400 = 1 day
        console.log("verify password before completion");
        header("Location: index.php");
        exit();
    } else {
        echo "Invalid username or password.";
    }
}