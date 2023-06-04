# Databases Project 2023: School Libraries

## Prerequisites
1. [Node.js](https://nodejs.org/en/download)
2. [MariaDB](https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.1.0&os=windows&cpu=x86_64&pkg=msi&m=crete)

## Installation steps
1. ```$ git clone https://github.com/manos2400/db-project-92```
2. ```$ cd db-project-92```
3. ```$ npm install```
4. ```$ cp .env.example .env```
5. Edit the new **.env** file with the database connection information
6. Login into mariadb cli with the command ```$ mysql -u <username> -p<password>```
7. In the mariadb cli execute the commands:
  * ```> source /path/to/db-project-92/sql_scripts/ddl.sql;```
  * ```> source /path/to/db-project-92/sql_scripts/dml.sql;```
8. Exit the mariadb cli and start the app with: ```$ npm start```
