module.exports = {
    HOST: 'localhost',
    PORT: '5432',
    USER: 'gps_user',
    CODE: 'user@gps',
    DB: 'community',
    dialect: 'postgres',
    timezone: '+08:00', // for writing to database
    dialectOptions: {
      useUTC: false, // for reading from database
    },
  };
  
  // 執行部署環境
  // NODE_ENV=production node server.js