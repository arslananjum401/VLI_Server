export const WishListModel = async (sequelize, DataTypes, ProductModel, UserModel) => {
    const WishList = await sequelize.define('WishList', {
        WishId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        WishedProduct: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: ProductModel,
                key: 'ProductId',
            }
        },
        StudentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: 'UserId'
            }
        },
    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return WishList;
}