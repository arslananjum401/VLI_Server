
export const StudentInfoModel = (sequelize, DataTypes, UserModel) => {
    return sequelize.define('StudentInfo', {
        StudentInfoId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        UserFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: "UserId"
            }
        },
        Address: {
            type: DataTypes.STRING,
        },
        PostalCode: {
            type: DataTypes.INTEGER,
        },
        Province: {
            type: DataTypes.STRING,
        },
        City: { 
            type: DataTypes.STRING,
        },
        DOB: {
            type: DataTypes.DATE,
        },
        Gender: {
            type: DataTypes.STRING,
        },
        FreeHours: {
            type: DataTypes.STRING,
        },
        Schedule: {
            type: DataTypes.STRING,
        },
        
    },
        { 
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
}