import db from '../../Conn/connection.js'
const { Buying, BoughtCourse, CourseEnrollment } = db;
export const BuyCourse = async (req, res) => {
    try {
        const { CoursePackageId, TotalFee } = req.body.Package
        if (!req.body.PaidPrice)
            req.body.PaidPrice = TotalFee

        const BuyProduct = await Buying.create({
            BuyerId: req.UserId,
            TotalPrice: TotalFee
        })
        const AddBoughtCourse = await BoughtCourse.create({
            BuyingFK: BuyProduct.BuyingId,
            CoursePackageFK: CoursePackageId,
            RemainingPrice: TotalFee - req.body.PaidPrice
        })
        const EnrollCourse = await CourseEnrollment.create({
            CoursePackageFK: CoursePackageId,
            UserFK: req.UserId,
            BoughtCourseFK: AddBoughtCourse.BoughtCourseId
        });

        res.status(200).json(EnrollCourse);

    } catch (error) {
        console.log(`Error occured while  buying course: ${error}`);
        res.status(500).json(error)
    }
}