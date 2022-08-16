"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.User.hasMany(models.Post, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.hasMany(models.Like, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.hasMany(models.Comment, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.hasMany(models.Like, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
        }
    }
    User.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            email: DataTypes.STRING,
            nickname: DataTypes.STRING,
            password: DataTypes.STRING,
            MBTI: DataTypes.STRING,
            profilePicture: DataTypes.STRING,
            refreshToken: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
