
export const InstituteCourseModel = async (sequelize, DataTypes, InstituteModel, VehicleModel, CourseModel) => {
    return await sequelize.define('InstituteCourse', {
        InstituteCourseId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        InstituteFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstituteModel,
                key: 'InstituteId'
            }
        },
        CourseFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: CourseModel,
                key: 'CoursePK'
            }
        },

        VehicleFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: VehicleModel,
                onDelete: 'SET NULL',
                key: 'VehicleId'
            }
        },


        ShortDescription: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                max: 500
            }
        },
        LongDescription: {
            type: DataTypes.STRING(1500),
            allowNull: false
        },
        CourseCurriculum: {
            type: DataTypes.STRING(1500),
        },
        Possible_FAQs: {
            type: DataTypes.STRING(250),
        },
        Publish: {
            type: DataTypes.STRING,
            defaultValue: "IN PROGRESS"
        },
        PublishResponse: {
            type: DataTypes.STRING
        },
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            freezeTableName: true
        }

    )
}

export const CoursePackagesModel = async (sequelize, DataTypes, InstituteCoursesModel) => {
    return await sequelize.define('CoursePackage', {
        CoursePackageId: {
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
        DrivingHours: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        InClassHours: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        OnlineHours: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        DiscountType: {
            type: DataTypes.STRING,
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Viewable"
        },

        TotalFee: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        Installments: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        InstallmentSchedule: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
}


export const CourseSyllabusModel = async (sequelize, DataTypes, InstituteCoursesModel) => {
    return sequelize.define("CourseSyllabuse", {
        CourseSyllabusId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        CourseDescription: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        InstituteCourseFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                key: "InstituteCourseId",
                onDelete: 'CASCADE',
                model: InstituteCoursesModel,
            }
        },

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
}


export const ClassScheduleModel = async (sequelize, DataTypes, InstituteCoursesModel) => {
    return sequelize.define("ClassSchedule", {
        ClassScheduleId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        ClassDescription: {
            type: DataTypes.STRING(1000),
            allowNull: false,
        },
        InstituteCourseFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                key: "InstituteCourseId",
                onDelete: 'CASCADE',
                model: InstituteCoursesModel
            }
        },

        ClassNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        WeekNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
}