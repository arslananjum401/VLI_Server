
export const BuyingModel = async (sequelize, Datatypes, UserModel) => {
    const Buying = await sequelize.define('Buying', {
        BuyingId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },

        UserFK: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'UserId'
            }
        },

        TotalPrice: {
            type: Datatypes.FLOAT,
            allowNull: false,

        }

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
    return Buying
}


export const BoughtCourseModel = async (sequelize, Datatypes, CoursePackagesModel, BuyingModel) => {
    return await sequelize.define('BoughtCourse', {
        BoughtCourseId: {
            type: Datatypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Datatypes.UUIDV4
        },
        BuyingFK: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: BuyingModel,
                key: "BuyingId"
            }
        },
       
        InstallmentsPaid: {
            type: Datatypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        CoursePackageFK: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: CoursePackagesModel,
                key: "CoursePackageId"
            }
        }
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })

}

export const BoughtBookModel = async (sequelize, Datatypes, BookModel, BuyingModel) => {
    return await sequelize.define('BoughtBook', {
        BoughtBookId: {
            type: Datatypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Datatypes.UUIDV4
        },
        BuyingFK: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: BuyingModel,
                key: "BuyingId"
            }
        },
        BookFK: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: BookModel,
                key: "BookId"
            }
        },
        Address: {
            type: Datatypes.STRING,
        },
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })

}

