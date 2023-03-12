import db from '../../Conn/connection.js'
const { Buying, BoughtCourse, CourseEnrollment, CoursePackages } = db;
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

export const PaymentStatus = async (req, res) => {
    try {

        const GetBoughtCourse = await CourseEnrollment.findOne({
            where: { EnrollmentId: req.params.EnrollmentId },
            include: [{
                model: BoughtCourse,
            },
            { model: CoursePackages, }
            ]
        })

        const { CoursePackage: GotCoursePackage, BoughtCourse: GotBoughtCourse } = GetBoughtCourse
        let NextPeriod
        if (GotCoursePackage?.InstallmentSchedule === "Monthly")
            NextPeriod = 1000 * 60 * 60 * 24 * 30
        else if (GotCoursePackage?.InstallmentSchedule === "Weekly")
            NextPeriod = 1000 * 60 * 60 * 24 * 7
        else if (GotCoursePackage?.InstallmentSchedule === "Bi-Weekly")
            NextPeriod = 1000 * 60 * 60 * 24 * 15



        GetBoughtCourse.dataValues.TotalPaid = GotBoughtCourse.InstallmentsPaid * (GotCoursePackage?.TotalFee / GotCoursePackage?.Installments)


        GetBoughtCourse.dataValues.TotalFee = GotCoursePackage?.TotalFee
        GetBoughtCourse.dataValues.InstallmentsPaid = GetBoughtCourse.InstallmentsPaid
        GetBoughtCourse.dataValues.RemainingAmount = GotCoursePackage?.TotalFee - GetBoughtCourse.dataValues.TotalPaid;
        GetBoughtCourse.dataValues.NextInstallmentDate = new Date(new Date(GetBoughtCourse.createdAt).getTime() + NextPeriod).toLocaleDateString()
        delete GetBoughtCourse.dataValues.BoughtCourse
        delete GetBoughtCourse.dataValues.CoursePackage;

        if (GetBoughtCourse.dataValues.TotalFee === GetBoughtCourse.dataValues.TotalPaid)
            GetBoughtCourse.dataValues.NextInstallmentDate = "No Installment left";


        res.status(200).json(GetBoughtCourse);


    } catch (error) {
        console.log(`Error occured while  buying course: ${error}`);
        res.status(500).json(error)
    }
}