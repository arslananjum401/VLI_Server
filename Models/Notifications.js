export const NotificationModel = async (sequelize, DataTypes, UserModel) => {
    const Notification = await sequelize.define('Notification', {
        NotificationId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },

        NotificationType: {
            type: DataTypes.STRING(100),
        },
        RelatedFK: {
            type: DataTypes.UUID,
        },

        Message: {
            type: DataTypes.STRING(1234),
        },
 
        FromUserId: {
            type: DataTypes.UUID,
            references: {
                model: UserModel,
                key: 'UserId'
            }
        },

        FromUserType: {
            type: DataTypes.STRING,

        },

        ToUserId: {
            type: DataTypes.UUID,
            references: {
                model: UserModel,
                key: 'UserId'
            }
        },
        ToUserType: {
            type: DataTypes.STRING,

        },

        MarkAsRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    );

    return Notification;
}


/*
FirstName
LastName
Address
Postal Code
Province
City
DOB
EmailAddress
PhoneNumber
GuardianPhoneNumber
Gender
Speciality
LicenseNumber
LicenseExpiry
SpecialLicenseNumber
SpecialLicenseExpiry
TrainingArea
*/ 