import db from '../../Conn/connection.js'


const { WishList, Course, InstituteCourses, CoursePackages } = db;


const IncludeQuery = {
    // attributes: ["WishId", "StudentId"],
    include: {
        model: InstituteCourses,
        attributes: ["InstituteCourseId", "ShortDescription"],
        required: true,

        include: [
            { model: Course, attributes: ["CoursePK", "CourseThumbnail", "Description", "CourseName"] },
            { model: CoursePackages, attributes: ["TotalFee"] }
        ]

    },
}
export const GetWishlist = async (req, res) => {
    try {
        let GetWishes = await WishList.findAll({
            where: { StudentId: req.UserId },

            order: [['createdAt', 'ASC'],],

            ...IncludeQuery
        });


        res.status(200).json(GetWishes)
    } catch (error) {
        console.log(`error occurred while Getting Wish list: ${error}`);
        return res.status(500).json(error);
    }
}
export const CreateWish = async (req, res) => {
    req.body.StudentId = req.UserId;
    try {
        const FindWish = await WishList.findOne({
            where: {
                ProductFK: req.body.InstitutetCourseId,
                StudentId: req.body.StudentId
            }
        });

        if (FindWish) {
            const GetAllWished = await WishList.findAll({
                where: { StudentId: req.UserId },
                order: [['createdAt', 'ASC'],],
                ...IncludeQuery
            })
            return res.status(201).json(GetAllWished);
        }

        const CreateWish = await WishList.create({
            ProductFK: req.body.InstitutetCourseId,
            StudentId: req.body.StudentId
        });

        let GetWishes = await WishList.findAll({
            where: { StudentId: req.UserId },
            order: [['createdAt', 'ASC'],],
            ...IncludeQuery

        });

        res.status(201).json(GetWishes)
    } catch (error) {
        console.log(`error occurred while Creating Wish list: ${error}`);
        return res.status(500).json(error);
    }
}

export const DeleteWish = async (req, res) => {

    try {
        const FindWish = await WishList.findOne({ where: { WishId: req.body.WishId } });

        if (!FindWish)
            return res.status(200).json({ message: "Wish already deleted" })

        const Delete = await WishList.destroy({ where: { WishId: req.body.WishId } });

        let GetWishes = await WishList.findAll({
            where: { StudentId: req.UserId },

            order: [['createdAt', 'ASC']],

            ...IncludeQuery
        });


        res.status(200).json(GetWishes)
    } catch (error) {
        console.log(`error occurred while Deleting Wish: ${error}`);
        return res.status(500).json(error);
    }
}
