export const ProductModel = async (sequelize, DataTypes, LicenseTypeModel) => {

    const Product = await sequelize.define('Product', {
        ProductId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        ProductName: {
            type: DataTypes.STRING,
            allowNull: false
        },


        ProductType: {
            type: DataTypes.STRING,
            allowNull: false
        },

    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    )
    return Product;
}