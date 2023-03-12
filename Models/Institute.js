export const Institute = async (sequelize, DataTypes) => {
    const institute = await sequelize.define('Institute', {
        InstituteId: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },

        InstituteName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ApplicationStatus: {
            type: DataTypes.STRING,
            defaultValue: 'Pending',
            allowNull: false
        },
        InstituteStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Not Working"
        },
        TotalInstructors: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        TotalVehicles: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        Address: {
            type: DataTypes.STRING,
            // allowNull: false

        },
        Country: {
            type: DataTypes.STRING,
            // allowNull: false
            // 
        },
        State: {
            type: DataTypes.STRING,
            // allowNull: false

        },
        City: {
            type: DataTypes.STRING,
            // allowNull: false

        },
        MOTR_Slip: {
            type: DataTypes.STRING,
            allowNull: false

        },
        InstituteLogo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LR_Slip: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Institute_Banner: {
            type: DataTypes.STRING,
            allowNull: false

        },
        WebsiteUrl: {
            type: DataTypes.STRING,
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }

    )
    return institute;
}

export const ForwardedCourseModel = async (sequelize, DataTypes, CourseModel, InstituteModel) => {
    return await sequelize.define('ForwardedCourse', {
        ForwardedCourseId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        CourseFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: CourseModel,
                key: "CoursePK"
            }
        },
        InstituteFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstituteModel,
                key: "InstituteId"
            }
        },
        Status: {
            type: DataTypes.STRING,
            defaultValue: "Working"
        },
        ForwardedCourseNotes: {
            type: DataTypes.STRING,
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
}

