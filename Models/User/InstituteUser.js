
export const InstituteUsersModel = (sequelize, DataTypes, UserModel, InstituteModel) => {
    return sequelize.define('InstituteUser', {
        InstituteUserId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        InstituteUserType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        InstituteFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstituteModel,
                key: "InstituteId" 
            }
        },
        UserFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: "UserId"
            }
        },
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
}