"use strict";
const { INTEGER } = require("sequelize");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.Comment.belongsTo(models.Post, {
                foreignKey: "postId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.Comment.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
        }
    }
    Comment.init(
        {
            commentId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            userId: DataTypes.INTEGER,
            postId: DataTypes.INTEGER,
            content: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Comment",
        }
    );
    return Comment;
};
