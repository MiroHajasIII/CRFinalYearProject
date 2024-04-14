<?php

class Database {
    /**
     * @var Database
     */
    protected static $_dbInstance = null;

    /**
     * @var PDO
     */
    protected $_dbHandle;

    /**
     * @return Database
     */
    public static function getInstance() {
        $username ='agd916';
        $password = 'GoldenGolem123!';
        $host = 'poseidon.salford.ac.uk';
        $dbName = 'agd916_codesculptor';

        if(self::$_dbInstance === null) { // checks if the PDO exists
            self::$_dbInstance = new self($username, $password, $host, $dbName);
        }

        return self::$_dbInstance;
    }

    /**
     * @param $username
     * @param $password
     * @param $host
     * @param $database
     */
    private function __construct($username, $password, $host, $database) {
        try {
            $this->_dbHandle = new PDO("mysql:host=$host;dbname=$database",  $username, $password);
        }
        catch (PDOException $e) { // catch any failure to connect to the database
            echo $e->getMessage();
        }
    }

    /**
     * @return PDO
     */
    public function getdbConnection() {
        return $this->_dbHandle;
    }

    public function __destruct() {
        $this->_dbHandle = null;
    }

    public function loginUser($username, $password) {
        $sql = "SELECT * FROM users WHERE username = :username";
        $stmt = $this->_dbHandle->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            return $user;
            // set session as true after successful login
            $_SESSION['LoggedIn'] = true;
        } else {
            return false;
        }
    }

    public function registerUser($username, $fullname, $password, $phone_number) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (username, fullname, password, phone_number) VALUES (:username, :fullname, :password, :phone_number)";
        $stmt = $this->_dbHandle->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->bindParam(':fullname', $fullname, PDO::PARAM_STR);
        $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
        $stmt->bindParam(':phone_number', $phone_number, PDO::PARAM_STR);

        return $stmt->execute();
    }
}
