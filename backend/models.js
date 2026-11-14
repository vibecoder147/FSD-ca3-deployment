const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";
const isPostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres");

const sequelize = isPostgres
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: isProduction ? { ssl: { require: true, rejectUnauthorized: false } } : {},
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: path.join(__dirname, "alumni.sqlite"),
      logging: false,
    });

const Alumni = sequelize.define("Alumni", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fullName: { type: DataTypes.STRING(120), allowNull: false, validate: { len: [3, 120] } },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  gradYear: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1950, max: new Date().getFullYear() + 5 } },
  status: { type: DataTypes.ENUM("active", "inactive", "pending"), defaultValue: "active" },
}, { tableName: "alumni" });

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING(60), allowNull: false },
}, { tableName: "users" });

module.exports = { sequelize, Alumni, User };
