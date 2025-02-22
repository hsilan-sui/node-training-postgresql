const { EntitySchema, JoinColumn } = require("typeorm");

module.exports = new EntitySchema({
  name: "Course",
  tableName: "COURSE",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid",
    },
    user_id: {
      //外鍵
      type: "uuid",
      nullable: false,
    },
    skill_id: {
      //外鍵
      type: "uuid",
      nullable: false,
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    description: {
      type: "text",
      length: 2048,
      nullable: true,
    },
    start_at: {
      type: "timestamp",
      nullable: false,
    },
    end_at: {
      type: "timestamp",
      nullable: false,
    },
    max_participants: {
      type: "integer",
      nullable: false,
    },
    meeting_url: {
      type: "varchar",
      length: 2048,
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true, //自動創建日期
      nullable: false,
    },
    update_at: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
  },
  relations: {
    User: {
      target: "User",
      type: "many-to-one",
      inverseSide: "Course",
      joinColumn: {
        name: "user_id",
        referenceColumnName: "id",
        foreignKeyConstrainName: "courses_user_id_fk",
      },
    },
  },
  relations: {
    //課程類別規定是單選-->
    Skill: {
      target: "Skill",
      //一個類別可以開很多堂課(多的設定外來鍵skill_id)
      //一堂課只能是一個類別(單選)
      type: "many-to-one",
      inverseSide: "Course",
      joinColumn: {
        name: "skill_id",
        referenceColumnName: "id",
        foreignKeyConstrainName: "courses_skill_id_fk",
      },
    },
  },
});
