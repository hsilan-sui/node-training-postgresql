const dotenv = require("dotenv");

//讀取 .env 文件，並將變數載入 process.env
const result = dotenv.config();
// 載入 db 和 web 設定
//db：應該是資料庫相關的設定，例如 連線資訊、帳號密碼 等。
const db = require("./db");
//web：應該是網頁伺服器設定，例如 伺服器埠號 (port)、URL 等
const web = require("./web");

//result.error 用來檢查 .env 文件是否載入成功，如果失敗會拋出錯誤
if (result.error) {
  throw result.error;
}

//定義 config 物件 db 與 web物件內容
const config = {
  db,
  web,
};

//ConfigManager 配置管理類別
//透過.get()方法存取db 和 web物件內容
class ConfigManager {
  /**
   * Retrieves a configuration value based on the provided dot-separated path.
   * Throws an error if the specified configuration path is not found.
   *
   * @param {string} path - Dot-separated string representing the configuration path.以「點」分隔的字串，如 "db.host"
   * @returns {*} - The configuration value corresponding to the given path.對應的設定值
   * @throws Will throw an error if the configuration path is not found. 如果 `path` 無效或不存在，則拋出錯誤
   */

  static get(path) {
    if (!path || typeof path !== "string") {
      throw new Error(`incorrect path: ${path}`);
    }
    const keys = path.split("."); // // 解析 "db.host" => ['db', 'host']
    let configValue = config;
    keys.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(configValue, key)) {
        throw new Error(`config ${path} not found`);
      }
      configValue = configValue[key]; //// 逐層檢查設定值是否存在 (hasOwnProperty)
    });
    return configValue;
  }
}

module.exports = ConfigManager; //匯出 ConfigManager
//其他模組可使用const config = require('./config/index.js')
//console.log(config.get('db.host')) // 輸出 'localhost'
