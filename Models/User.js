export const UserModel = async (sequelize, Datatypes) => {
    const User = await sequelize.define('User', {
        UserId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            allowNull: false, 
            primaryKey: true
        },

        FirstName: {
            type: Datatypes.STRING,
            allowNull: false,

        },
        LastName: {
            type: Datatypes.STRING,
            allowNull: false,

        },
        UserName: {
            type: Datatypes.STRING,
            allowNull: false

        },
        Email: {
            type: Datatypes.STRING,
            // allowNull: false
        },
        Password: {
            type: Datatypes.STRING,
            // allowNull: false
        },

        PhoneNumber: {
            type: Datatypes.STRING,
            // allowNull: false
        },
        User: {
            type: Datatypes.STRING,
            allowNull: false
        },

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }

    );
    return User;
}

export const UserEmailValidationModel = (sequelize, Datatypes, UserModel) => {
    return sequelize.define('UserEmailValidation', {
        UserValidationId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        UserFK: {
            type: Datatypes.UUID,
            // allowNull: false,
            references: {
                model: UserModel,
                key: "UserId"
            }
        },
        IsVerified: {
            type: Datatypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        EmailToken: {
            type: Datatypes.STRING,
            allowNull: false
        },

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })

}



export const UserResetPasswordModel = (sequelize, Datatypes, UserModel,) => {
    return sequelize.define('UserResetPassword', {
        UserResetPasswordId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        UserFK: {
            type: Datatypes.UUID,
            // allowNull: false,
            references: {
                model: UserModel,
                key: "UserId"
            }
        },
        ResetPasswordToken: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        ResetPasswordExpire: {
            type: Datatypes.DATE
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            freezeTableName: true
        })
}
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
        Institute_UserFK: {
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