export const StudentModel = async (sequelize, Datatypes) => {
    return await sequelize.define('Student', {
        StudentId: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },
        FristName: {
            type: Datatypes.STRING,
            allowNull: false
        },
        LastName: {
            type: Datatypes.STRING,
            allowNull: false
        },
        Address: {
            type: Datatypes.STRING,
            allowNull: false
        },
        PostalCode: {
            type: Datatypes.INTEGER,
            allowNull: false
        },
        Province: {
            type: Datatypes.INTEGER,
            allowNull: false
        },
        City: {
            type: Datatypes.INTEGER,
            allowNull: false
        },
        PhoneNumber: {
            type: Datatypes.INTEGER,
            allowNull: false
        },
        DOB: {
            type: Datatypes.INTEGER,
            allowNull: false
        },
        Gender: {
            type: Datatypes.INTEGER,
            allowNull: false
        },
        FreeHours: {
            type: Datatypes.INTEGER,
            allowNull: false
        }
    })
}