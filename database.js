const mariadb = require('mariadb');
const { exec } = require('child_process');

const pool = mariadb.createPool({ 
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME, 
    connectionLimit: 10
});

function backupDatabase() {
    return new Promise((resolve, reject) => {
    const backupCommand = `${process.env.PATH_TO_DB}mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASS} ${process.env.DB_NAME} > backup.sql`;
    
    exec(backupCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Backup failed: ${error.message}`);      
        return;
    }
    
        resolve('Backup completed successfully');    
    });
});
  }
function restoreDatabase() {
    return new Promise((resolve, reject) => {

    const restoreCommand = `${process.env.PATH_TO_DB}mysql -u ${process.env.DB_USER} -p${process.env.DB_PASS} ${process.env.DB_NAME} < backup.sql`;
    
    exec(restoreCommand, (error, stdout, stderr) => {
        if (error) {
            reject(`Restore failed: ${error.message}`);
            return;
          }
    
          resolve('Restore completed successfully');
    });
});
}
  

module.exports = {
    pool,
    backupDatabase,
    restoreDatabase
}