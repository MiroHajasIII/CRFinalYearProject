<?php
$view = new stdClass();
$view->pageTitle = 'Login';

// check if the session has already been started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (isset($_POST['logoutButton'])){
    unset($_SESSION['LoggedIn']);
    session_destroy();
}

require_once('Views/loginPage.phtml');