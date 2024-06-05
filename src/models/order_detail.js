"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      order_detail.belongsTo(models.order, {
        foreignKey: "order_id",
        as: "order",
      });
      order_detail.belongsTo(models.book, {
        foreignKey: "book_id",
        as: "book",
      });
    }
  }
  order_detail.init(
    {
      order_id: DataTypes.INTEGER,
      book_id: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(10, 2),
      quantity: DataTypes.INTEGER,
      subtotal: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      modelName: "order_detail",
      underscored: true,
    }
  );
  return order_detail;
};
