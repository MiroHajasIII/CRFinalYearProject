<?php
$view = new stdClass();
$view->pageTitle = 'Login';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (isset($_POST['logoutButton'])){
    unset($_SESSION['LoggedIn']);
    session_destroy();
//    header("Location: loginPage.php");
//    exit(); // implemented for security purposes
}

require_once('Views/loginPage.phtml');