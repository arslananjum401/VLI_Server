import db from "../../../../Conn/connection.js"
const { VehicleTypes } = db
export const GetVehicleTypes = async (props, StafftArr, socket, io) => {
    try {
        const GotVehicleTypes = await VehicleTypes.findAll()
        socket.emit("GetVehicleTypes")

    } catch (error) {

    }
}