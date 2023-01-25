import db from '../../Conn/connection.js';
import { CheckUUID } from '../../Helpers/CheckUUID.js';



const { Book, Product, BookReputationInfo } = db;

export const CreateBook = async (req, res) => {
    try {
        req.body.ProductType = "Book"
        const FindBook = await Product.findOne({ where: { ProductName: req.body.BookTitle } });
        if (FindBook) {
            return res.status(401).json({ message: "Book with same Name already exists" })
        }


        req.body.ProductName = req.body.BookTitle;
        const NewProduct = await Product.create(req.body);
        req.body.ProductFK = NewProduct.ProductId;
        req.body.CreatedBy = req.UserId
        const NewBook = await Book.create(req.body);

        const FindNewBook = await Product.findOne({
            where: { ProductId: NewProduct.ProductId },
            include: [{ model: Book, include: { model: BookReputationInfo } }]

        });

        res.status(201).json(FindNewBook);
    } catch (error) {
        console.log(`Error occurred while creating Book ${error.message}`);
        res.status(500).json(error);
    }
}

export const GetAllBooks = async (req, res) => {
    try {
        const FindNewBook = await Product.findAll({
            where: { ProductType: "Book" },
            include: [{ model: Book, include: { model: BookReputationInfo } }]
        });
        res.status(200).json(FindNewBook);
    } catch (error) {
        console.log(`Error occurred while Getting All Book ${error.message}`);
        res.status(500).json(error);
    }
}


export const GetSingleBook = async (req, res) => {
    try {
        if (!CheckUUID(req.params.ProductId)) {
            return res.status(404).json({ message: "Invalid UUID" })
        }
        const SingleBook = await Product.findOne({
            where: {
                ProductId: req.params.ProductId,
                ProductType: "Book"
            },
            include: [
                {
                    model: Book,
                    attributes: { exclude: ["ProductFK"] },
                    include: { model: BookReputationInfo }
                }
            ]
        });

        if (!SingleBook) {
            return res.status(404).json({ message: "Book Not found" })
        }
        res.status(200).json(SingleBook);
    } catch (error) {
        console.log(`Error occurred while Getting Single Book ${error.message}`);
        res.status(500).json(error);
    }
}


export const DeleteBook = async (req, res) => {
    try {
        const FindBook = await Product.findOne({ where: { ProductId: req.params.ProductId } })
        if (FindBook)
            return req.status(404).json({ message: "Book Not found" });

        const DeleteBook = await Product.destroy({ where: { ProductId: req.body.ProductId } })
        if (DeleteBook.length <= 0)
            return res.status(404).json({ message: "Product coudn't be deleted" })

        return res.status(200).json({ message: "Book Deleted Successfully" })
    } catch (error) {
        console.log(`Error occurred while Deleting Book ${error}`);
        res.status(500).json(error);
    }
}

export const UpdateBook = async (req, res) => {
    try {
        const FindBook = await Product.findOne({ where: { ProductId: req.params.ProductId } });
        if (FindBook)
            return req.status(404).json({ message: "Book Not found" });

        const UpdateBook = await Product.update(req.body, { where: { ProductId: req.body.ProductId } })
        const FindUpdatedBook = await Product.findOne({ where: { ProductId: req.params.ProductId } });

        res.status(200).json(FindUpdatedBook);
    } catch (error) {
        console.log(`Error occurred while Deleting Book ${error}`);
        res.status(500).json(error);
    }
}