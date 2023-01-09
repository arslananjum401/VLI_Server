export const CourseProgressModel = async (sequelize, DataTypes, CourseEnrollmentModel, ClassScheduleModel) => {
    const CourseProgress = await sequelize.define('CourseProgress', {
        CourseProgressId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        EnrollmentFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: CourseEnrollmentModel,
                key: 'EnrollmentId'
            }
        },

        ClassScheduleFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: ClassScheduleModel,
                key: 'ClassScheduleId'
            }
        },


    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return CourseProgress;
}