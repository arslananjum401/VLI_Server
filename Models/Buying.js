
export const BuyingModel = async (sequelize, Datatypes, UserModel) => {
    const Buying = await sequelize.define('Buying', {
        BuyingId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },

        BuyerId: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'UserId'
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
    return Buying
}

export const BoughtModel = async (sequelize, Datatypes, ProductModel, UserModel) => {
    const OrderProduct = await sequelize.define('BoughtProduct', {

        BoughtId: {
            type: Datatypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Datatypes.UUIDV4
        },
        // ProductFK: {
        //     type: Datatypes.UUID,
        //     allowNull: false,
        //     references: {
        //         model: ProductModel,
        //         key: 'ProductId'
        //     }
        // },
        UserFK: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: "UserId"
            }
        },
        TotalPrice: {
            type: Datatypes.FLOAT,
            allowNull: false,
           
        },

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
    return OrderProduct
}

export const BoughtCourseModel = async (sequelize, Datatypes, BoughtModel, CoursePackagesModel) => {
    const OrderProduct = await sequelize.define('BoughtCourse', {
        BoughtCourseId: {
            type: Datatypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Datatypes.UUIDV4
        },
        BoughtFK: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: BoughtModel,
                key: "BoughtId"
            }
        },
        CoursePackageFK: {
            type: Datatypes.UUID,
            allowNull: false, 
            references: {
                model: CoursePackagesModel,
                key: "IC_PackagesId"
            }
        },


    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
    return OrderProduct
}

export const BoughtBookModel = async (sequelize, Datatypes, BoughtModel, BookModel) => {
    const OrderProduct = await sequelize.define('BoughtBook', {
        BoughtBookId: {
            type: Datatypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Datatypes.UUIDV4
        },
        BoughtFK: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: BoughtModel,
                key: "BoughtId"
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


    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
    return OrderProduct
}

