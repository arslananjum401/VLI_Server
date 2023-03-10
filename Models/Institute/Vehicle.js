
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
            Manufacturer: {
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
            Color: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Seats: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            EngineCapacity: {
                type: DataTypes.STRING,
                allowNull: false
            },
            GearType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Description: {
                type: DataTypes.STRING(500),
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
