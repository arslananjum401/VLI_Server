
export const CartModel = async (sequelize, Datatypes, UserModel,ProductModel) => {
    const Cart = await sequelize.define('Cart', {
        AddToCartId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },

        AddedById: {
            type: Datatypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'UserId'
            }
        },
        CartedProductId: {
            type: Datatypes.UUID,
            // allowNull: false,
            references: {
                model: ProductModel,
                key: 'ProductId'
            }
        },


    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        })
    return Cart
}

export const CartIdAndProductsModel = async (sequelize, Datatypes, CartModel, BookModel) => {
    const Cart = await sequelize.define('CartProduct'
        , {

        },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return Cart
}
export const CartIdAndCourseModel = async (sequelize, Datatypes, CartModel, CourseModel) => {
    const Cart = await sequelize.define('CartCourse'
        , {
            //     CartId: {
            //         type: Datatypes.UUID,
            //         allowNull: false,
            //         references: {
            //             model: CartModel,
            //             key: 'AddToCartId'
            //         }
            //     },
            //     CourseId: {
            //         type: Datatypes.UUID,
            //         allowNull: false,
            //         references: {
            //             model: CourseModel,
            //             key: 'CoursePK'
            //         }
            //     },

        },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }

    )
    return Cart
}