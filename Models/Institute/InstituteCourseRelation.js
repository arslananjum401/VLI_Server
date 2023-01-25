export const CourseInstructorsModel = async (sequelize, DataTypes, InstituteCoursesModel, InstructorModel) => {
    return await sequelize.define("CourseInstructor", {
        CourseInstructorId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        InstituteCourseFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstituteCoursesModel,
                onDelete: 'CASCADE',
                key: "InstituteCourseId"
            }
        },
        InstructorFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstructorModel,
                onDelete: 'CASCADE',
                key: "InstructorId"
            }
        },
    }, {
        timestamps: true,
        createdAt: true,
        updatedAt: false,
    }
    )
}
