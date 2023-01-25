export const StudentInterestModel = async (sequelize, DataTypes, referencesModel,LicenseTypeModel) => {
    const StudentInterest = await sequelize.define('StudentInterest', {
        InterestId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        StudentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: referencesModel,
                key: 'UserId'
            }
        },
        City: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CourseLicenseType: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: LicenseTypeModel,
                key: 'LicenseTypeId'
            }
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    );

    return StudentInterest;
}