CREATE DATABASE hooky;

# CREATE USER 'hooky'@'localhost' IDENTIFIED BY '';
# GRANT SELECT,INSERT,UPDATE,DELETE ON hooky.* TO hooky@localhost;
# FLUSH PRIVILEGES;

USE hooky;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS hook;
CREATE TABLE hook(

  id INT NOT NULL AUTO_INCREMENT,

  headers TEXT,
  payload TEXT,
  creationStamp DATETIME DEFAULT CURRENT_TIMESTAMP, 

  PRIMARY KEY(id)
) CHARACTER SET utf8mb4;

SET FOREIGN_KEY_CHECKS=1;