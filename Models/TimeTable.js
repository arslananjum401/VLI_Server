export const TimeTableModel = async (sequelize, DataTypes, EnrolmentModel, InstructorModel) => {
    const TimeTable = await sequelize.define('TimeTable', {
        event_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        EnrollmentFK: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: EnrolmentModel,
                key: 'EnrollmentId'
            }
        },
        InstructorFK: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: InstructorModel,
                key: 'InstructorId'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        ClassNo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ClassType: {
            type: DataTypes.STRING,
            allowNull: false,
        }


    },
        {
            timestamps: true,
            createdAt: true,
            updatedAt: false,
        }
    );

    return TimeTable;
}