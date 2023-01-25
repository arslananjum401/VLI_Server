
export const InstructorModel = async (sequelize, DataTypes, InstituteMId, LicenseTypesModel, UserModel) => {

    const Instructor = await sequelize.define('Instructor', {
        InstructorId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        UserFK: {
            type: DataTypes.UUID,
            references: {
                model: UserModel,
                key: "UserId"
            },
            allowNull: false
        },

        Address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PostalCode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Province: {
            type: DataTypes.STRING,
            allowNull: false
        },
        City: {
            type: DataTypes.STRING,
            allowNull: false
        },
        DOB: {
            type: DataTypes.STRING,
            allowNull: false
        },
        PhoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        GuardianPhoneNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        Gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Speciality: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: LicenseTypesModel,
                key: 'LicenseTypeId',
            }
        },
        LicenseNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LicenseExpiry: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        SpecialLicenseNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        SpecialLicenseExpiry: {
            type: DataTypes.STRING,
            allowNull: false
        },
        TrainingArea: {
            type: DataTypes.STRING,
            allowNull: false
        },

        Suspend: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        FromInstitute: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstituteMId,
                key: 'InstituteId'
            }
        }

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return Instructor;
}
