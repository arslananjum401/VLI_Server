

export const Institute = async (sequelize, DataTypes, referencesModel) => {
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
        Country: {
            type: DataTypes.STRING,
            allowNull: false

        },
        State: {
            type: DataTypes.STRING,
            allowNull: false

        },
        City: {
            type: DataTypes.STRING,
            allowNull: false

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
                key: 'VehicleId'
            }
        },


        ShortDescription: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                max: 100
            }
        },
        LongDescription: {
            type: DataTypes.STRING,
            allowNull: false
        },
        CourseCurriculum: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        Possible_FAQs: {
            type: DataTypes.STRING,
            // allowNull: false
        },
        Publish: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            freezeTableName: true
        }

    )
}

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
                key: "InstituteCourseId"
            }
        },
        InstructorFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstructorModel,
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
export const VehicleModel = async (sequelize, DataTypes, InstituteModel) => {
    return await sequelize.define('Vehicle',
        {
            VehicleId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            InstituteFK: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: InstituteModel,
                    key: "InstituteId"
                }
            },
            ManufacturingCompany: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Model: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Year: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            VehicleDescription: {
                type: DataTypes.STRING,
                allowNull: false
            },
            IdentityNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            PlateNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            InsuranceNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            TrainerNumberPlate: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
            freezeTableName: true
        }
    )
}
export const VehicleImagesModel = async (sequelize, DataTypes, VehicleModel) => {
    return await sequelize.define('VehicleImages',
        {
            Vehicle_ImageId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            VehicleFK: {
                type: DataTypes.UUID,
                references: {
                    model: VehicleModel,
                    key: 'VehicleId',
                }
            },
            VehicleImageLink: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
}

export const ForwardedCourseModel = async (sequelize, DataTypes, InstituteModel, ProductModel, UserModel) => {
    return await sequelize.define('ForwardedCourse', {
        ForwardedCourseId: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        ProductFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: ProductModel,
                key: "ProductId"
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
        UserFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: "UserId"
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

