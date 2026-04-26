<?php
require __DIR__ . '/_bootstrap.php';

try {
    // Create database if not exists
    $pdo = new PDO('mysql:host=localhost', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $pdo->exec('CREATE DATABASE IF NOT EXISTS daad_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    echo "Database 'daad_db' created successfully!\n";
    
    // Connect to database
    $pdo = new PDO('mysql:host=localhost;dbname=daad_db;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    
    // Create users table
    $pdo->exec('CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(32) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');
    echo "Table 'users' created successfully!\n";
    
    // Create workspaces table
    $pdo->exec('CREATE TABLE IF NOT EXISTS workspaces (
        user_id INT PRIMARY KEY,
        json TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )');
    echo "Table 'workspaces' created successfully!\n";
    
    echo "\n=== Setup Complete! ===\n";
    echo "You can now use the application.\n";
    echo "Go to: http://localhost/phpmyadmin/index.php?route=/database/structure&db=daad_db\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
