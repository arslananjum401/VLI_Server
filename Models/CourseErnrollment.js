export const CourseEnrollmentModel = async (sequelize, DataTypes, CoursePackageModel, UserModel, BoughtCourseModel) => {
    const CourseEnrollment = await sequelize.define('CourseEnrollment', {
        EnrollmentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        CoursePackageFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: CoursePackageModel,
                key: 'IC_PackagesId'
            }
        },

        UserFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'UserId' 
            }
        },
        BoughtCourseFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: BoughtCourseModel,
                key: "BoughtCourseId"
            }
        },



         

        EnrollmentPeriod: {
            type: DataTypes.STRING,
            // allowNull: false, 
        },
        EnrollmentDescription: {
            type: DataTypes.STRING(2134),
        },
     
     




        CourseRating: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        Rated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        Completion: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        CompletionMark: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        RunningMarked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return CourseEnrollment;
}