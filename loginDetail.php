<?php
// include the Database class
require_once 'Models/database.php';

// start the session
session_start();

// check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // get form data
    $username = $_POST['username'];
    $password = $_POST['password'];

    // create a new instance of the Database class
    $db = Database::getInstance();
    $pdo = $db->getdbConnection();
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");

    $stmt->bindParam(1, $username);
    $stmt->execute();
    // fetch user record
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // verify password
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['username'] = $username;

        // set session cookie
        setcookie("username", $username, time() + (86400 * 30), "/"); // timer for 1 day * 30
        header("Location: index.php");
        exit();
    } else {
        echo "Invalid username or password.";
    }
}