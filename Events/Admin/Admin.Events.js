import db from "../../Conn/connection.js";
import { FindUserId } from "../Helpers/SaveUser.js";

const { Book, ForwardedCourse, Notification, User, Institute, InstituteUser } = db;


const checkval = (order, Key, VALUE) => {
    let Check = false
    order.forEach((value, index) => {
        if (value[0] === Key) {
            Check = index
        }
    })
    if (!Check) {

        return order.push([Key, VALUE])
    } else if (Check)
        order[Check][1] = VALUE
}
export const SortBooks = async (Props, socket, Arr, io) => {

    let order = [];
    let where
    const User = FindUserId(Arr, socket.id);
    try {
        if (Props.BookType)
            where = { where: { BookType: Props.BookType } }

        if (Props.E_BookCategory)
            order.push(["E_BookCategory"]) = ""

        if (Props.createdAt?.toLocaleLowerCase() === "new to old")
            checkval(order, "createdAt", "asc")
        else if (Props.createdAt?.toLocaleLowerCase() === "old to new")
            checkval(order, "createdAt", "desc")


        if (Props.BookTitle?.toLocaleLowerCase() === "A to Z"?.toLocaleLowerCase())
            checkval(order, "BookTitle", "desc")
        else if (Props.BookTitle?.toLocaleLowerCase() === "Z to A"?.toLocaleLowerCase())
            checkval(order, "BookTitle", "asc")



        if (Props.BookRating?.toLocaleLowerCase() === "Ascending"?.toLocaleLowerCase())
            checkval(order, "BookRating", "asc")
        else if (Props.BookRating?.toLocaleLowerCase() === "Descending"?.toLocaleLowerCase())
            checkval(order, "BookRating", "desc")



        if (Props.Price?.toLocaleLowerCase() === "high to low"?.toLocaleLowerCase())
            checkval(order, "Price", "asc")
        else if (Props.Price?.toLocaleLowerCase() === "low to high"?.toLocaleLowerCase())
            checkval(order, "Price", "desc")



        const Books = await Book.findAll({
            ...where,
            order: [...order]

        });


        // await io.to(User.SocketId).emit("ReceiveSortedCourse", AllCatgories)
        await socket.emit("FilteredBooks", Books);
    }
    catch (err) {
        console.log(`Error occurrred while sorting books: ${err}`)
    }
}

