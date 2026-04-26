<?php
echo "Extensions: " . implode(", ", get_loaded_extensions()) . "\n";
echo "PDO drivers: " . implode(", ", PDO::getAvailableDrivers()) . "\n";
echo "MYSQL_HOST: " . getenv('MYSQL_HOST') . "\n";