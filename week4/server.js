require("dotenv").config();
const http = require("http");
const AppDataSource = require("./db");
function isUndefined(value) {
  return value === undefined;
}

function isNotValidSting(value) {
  return typeof value !== "string" || value.trim().length === 0 || value === "";
}

function isNotValidInteger(value) {
  return typeof value !== "number" || value < 0 || value % 1 !== 0;
}
const requestListener = async (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/api/credit-package" && req.method === "GET") {
    try {
      const creditPackagesData = await AppDataSource.getRepository(
        "CreditPackage"
      ).find({
        select: ["id", "name", "credit_amount", "price", "created_at"],
      });

      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: creditPackagesData,
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(500, headers);
      res.write(
        JSON.stringify({
          status: "error",
          message: "伺服器錯誤",
        })
      );
      res.end();
    }
  } else if (req.url === "/api/credit-package" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const { name, credit_amount, price } = JSON.parse(body);

        //防呆1
        if (
          isUndefined(name) ||
          isUndefined(credit_amount) ||
          isUndefined(price) ||
          isNotValidSting(name) ||
          isNotValidInteger(credit_amount) ||
          isNotValidInteger(price)
        ) {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: "failed",
              message: "欄位未填寫正確",
            })
          );
          res.end();
          return;
        }

        //防呆2
        const CreditPackageRepo = await AppDataSource.getRepository(
          "CreditPackage"
        );

        //檢查重複
        const existPackage = await CreditPackageRepo.find({
          where: {
            name, //名稱不可重複
          },
        });

        if (existPackage.length > 0) {
          res.writeHead(409, headers);
          res.write(
            JSON.stringify({
              status: "failed",
              message: "資料重複",
            })
          );
          res.end();
          return;
        }

        const newPackage = await CreditPackageRepo.create({
          name,
          credit_amount,
          price,
        });

        const result = await CreditPackageRepo.save(newPackage);

        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            data: newPackage,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(500, headers);
        res.write(
          JSON.stringify({
            status: "error",
            message: "伺服器錯誤",
          })
        );
        res.end();
      }
    });
  } else if (
    req.url.startsWith("/api/credit-package/") &&
    req.method === "DELETE"
  ) {
    try {
      const packageId = req.url.split("/").pop();

      //防呆
      if (isUndefined(packageId) || isNotValidSting(packageId)) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "failed",
            message: "ID錯誤",
          })
        );
        res.end();
        return;
      }

      const result = await AppDataSource.getRepository("CreditPackage").delete(
        packageId
      );

      console.log(result);
      if (result.afftected === 0) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "failed",
            message: "ID錯誤",
          })
        );
        res.end();
        return;
      }
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(500, headers);
      res.write(
        JSON.stringify({
          status: "error",
          message: "伺服器錯誤",
        })
      );
      res.end();
    }
  } else if (req.url === "/api/coaches/skill" && req.method === "GET") {
    try {
      const skillData = await AppDataSource.getRepository("Skill").find({
        select: ["id", "name", "createdAt"],
      });

      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: skillData,
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(500, headers);
      res.write(
        JSON.stringify({
          status: "error",
          message: "伺服器錯誤",
        })
      );
      res.end();
    }
  } else if (req.url === "/api/coaches/skill" && req.method === "POST") {
    req.on("end", async () => {
      try {
        const { name } = JSON.parse(body);
        if (isUndefined(name) || isNotValidSting(name)) {
          res.writeHead(400, headers);
          res.write(
            JSON.stringify({
              status: "failed",
              message: "欄位未填寫正確",
            })
          );
          res.end();
          return;
        }

        const skillRepo = await AppDataSource.getRepository("Skill");

        const existData = await skillRepo.find({
          where: {
            name,
          },
        });

        if (existData.length > 0) {
          res.writeHead(409, headers);
          res.write(
            JSON.stringify({
              status: "failed",
              message: "資料重複",
            })
          );
          res.end();
          return;
        }

        const newSkill = await skillRepo.create({
          name,
        });

        const result = await skillRepo.save(newSkill);
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            data: newSkill,
          })
        );
        res.end();
      } catch (error) {
        res.writeHead(500, headers);
        res.write(
          JSON.stringify({
            status: "error",
            message: "伺服器錯誤",
          })
        );
        res.end();
      }
    });
  } else if (
    req.url.startsWith("/api/coaches/skill") &&
    req.method === "DELETE"
  ) {
    try {
      const skillId = req.url.split("/").pop();

      if (isUndefined(skillId) || isNotValidSting(skillId)) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "failed",
            message: "ID錯誤",
          })
        );
        res.end();
        return;
      }

      const result = await AppDataSource.getRepository("Skill").delete(skillId);

      if (result.affected === 0) {
        res.writeHead(400, headers);
        res.write(
          JSON.stringify({
            status: "failed",
            message: "ID錯誤",
          })
        );
        res.end();
        return;
      }
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
        })
      );
      res.end();
    } catch (error) {
      res.writeHead(500, headers);
      res.write(
        JSON.stringify({
          status: "error",
          message: "伺服器錯誤",
        })
      );
      res.end();
    }
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "failed",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);

async function startServer() {
  await AppDataSource.initialize();
  console.log("資料庫連接成功");
  server.listen(process.env.PORT);
  console.log(`伺服器啟動成功, port: ${process.env.PORT}`);
  return server;
}

module.exports = startServer();
