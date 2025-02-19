//存放typeorm的DataSource相關來源設定
const { DataSource } = require("typeorm");
//這裡有ConfigManager 已經載入環境變數 config/db.js 和config/web.js等設定值
//等於引入該模組就引入了資料庫與伺服器的相關config
const config = require("../config/index.js");

//把資料表實體拆到entities/目錄下 要一一引入過來
const CreditPackage = require("../entities/CreditPackages.js");

//實體化typeorm的來源設定
//運用config | ConfigManager提供.get方法可以直接取用config/db.js中的物件內容
const dataSource = new DataSource({
  type: "postgres",
  host: config.get("db.host"),
  port: config.get("db.port"),
  username: config.get("db,username"),
  password: config.get("db.password"),
  database: config.get("db.database"),
  synchronize: config.get("db.synchronize"),
  poolSize: 10, //???
  entities: [CreditPackage, Skill],
  ssl: config.get("db.ssl"), //連線加密？？
});

module.exports = { dataSource };
// const dataSource = new DataSource({

//   poolSize: 10,
//   entities: [
//     CreditPackage
//   ],
//   ssl: config.get('db.ssl')
// })

// module.exports = { dataSource }
