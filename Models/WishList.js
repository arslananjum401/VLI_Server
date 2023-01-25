export const WishListModel = async (sequelize, DataTypes, InstituteCourseModel, UserModel) => {
    const WishList = await sequelize.define('WishList', {
        WishId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        ProductFK: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: InstituteCourseModel,
                onDelete: 'CASCADE',
                key: 'InstituteCourseId'
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