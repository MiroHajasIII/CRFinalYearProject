<?php
session_start();

if (isset($_POST['loginButton'])){
    //check login
    $_SESSION['LoggedIn'] = true; // temp force login
}
if (isset($_POST['submitRegister'])){
    $_SESSION['LoggedIn'] = true;

}
if (isset($_POST['logoutButton'])){
    unset($_SESSION['LoggedIn']);
    session_destroy();
}