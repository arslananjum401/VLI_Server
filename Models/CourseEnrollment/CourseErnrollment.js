export const CourseEnrollmentModel = async (sequelize, DataTypes, CoursePackageModel, UserModel, BoughtCoureModel) => {
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
                key: 'CoursePackageId'
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
                model: BoughtCoureModel,
                key: "BoughtCourseId"
            }
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


export const InstructorEnrollmentRelationModel = async (sequelize, DataTypes, CourseEnrollmentModel, InstructorModel) => {
    const IE_Relation = await sequelize.define('IE_Relation', {
        EnrollmentFK: {
            type: DataTypes.UUID,
            references: {
                model: CourseEnrollmentModel,
                key: "EnrollmentId"
            }
        },
        
        InstructorFK: {
            type: DataTypes.UUID,
            references: {
                model: InstructorModel,
                key: "InstructorId"
            }
        },

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return IE_Relation;
}