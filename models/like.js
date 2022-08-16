"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.Like.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.Like.belongsTo(models.Post, {
                foreignKey: "postId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
        }
    }
    Like.init(
        {
            likeId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            postId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Like",
        }
    );
    return Like;
};
