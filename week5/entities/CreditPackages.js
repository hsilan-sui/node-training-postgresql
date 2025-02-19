const { EntitySchema } = require("typeorm");

//這裡的實體檔案專屬於 CreditPackage 這個資料表
module.exports = new EntitySchema({
  name: "CreditPackage",
  tableName: "CREDIT_PACKAGE",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
      nullable: false,
    },
    name: {
      type: "varchar",
      length: 50,
      nullable: false,
      unique: true,
    },
    credit_amount: {
      type: "integer",
      nullable: false,
    },
    price: {
      type: "numeric",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
      name: "created_at",
      nullable: false,
    },
  },
});
