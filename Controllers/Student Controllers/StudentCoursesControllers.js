import db from "../../Conn/connection.js"

const { Course, Product, CProductToInstitute, Institute, InstituteCoursePackage: CoursePackages, LicenseTypes, VehicleTypes, Bought, BoughtCourse, CourseEnrollment } = db;



const modefier = (req, InstituteCourse) => {
    if (req.UserId) {
        InstituteCourse.dataValues.CProductToInstitutes = InstituteCourse.dataValues.CProductToInstitutes.map((value, index) => {
            value.dataValues.CoursePackages.forEach((element, i) => {

                let x = element.dataValues.CourseEnrollment.dataValues;
                if (element.dataValues.CourseEnrollment === undefined) {

                    x.EnrollmentId = x.Enrollment;
                    x.CoursePackage = x.CoursePack;
                    x.BoughtCourse = x.BoughtCour
                    x.CourseRating = x.CourseRati;
                    x.RunningMark = x.RunningMar;

                    delete x?.RunningMar; delete x?.CourseRati; delete x?.BoughtCour; delete x?.CoursePack; delete x?.Enrollment;

                    element.dataValues.CourseEnrollment = { ...x }
                    value.dataValues.CoursePackages[index] = element
                }

            });
            return value

        });
        return InstituteCourse
    }
    return InstituteCourse
}
export const ViewCourses = async (req, res) => {
    try {
        let BoughtQuery = {}
        if (req.UserId) {
            BoughtQuery = {
                include: [
                    {
                        model: BoughtCourse,
                        include: {
                            model: Bought,
                            where: { UserFK: req.UserId },
                        }
                    },
                    {
                        model: CourseEnrollment,
                        where: { UserFK: req.UserId },
                        required: false
                    }
                ]
            }
        }




        let InstituteCourse = await Product.findOne({
            where: { ProductId: req.params.ProductId },
            attributes: { exclude: ["createdAt", "CourseId"] },
            include: [
                {
                    model: CProductToInstitute,
                    attributes: ["ShortDescription", "LongDescription", "Possible_FAQs", "cProductInstituteId"],
                    include: [
                        {
                            model: Institute,
                            required: true,
                            attributes: ["InstituteName", "Country", "State", "City"]
                        },
                        {
                            model: CoursePackages,
                            required: true,
                            attributes: { exclude: ["cPI_Id", "createdAt", "Status"] },

                            ...BoughtQuery
                        },

                    ]
                },
                {
                    model: Course,
                    required: true,
                    attributes: { exclude: ["CourseProductId", "Cancel", "Status", "createdAt"] },
                    include: [
                        { model: LicenseTypes, attributes: ["LicenseTypeName"] },
                        { model: VehicleTypes, attributes: ["VehicleTypeName"] },
                    ]
                }
            ]
        }
        )


        InstituteCourse = modefier(req, InstituteCourse)

        return res.status(200).json(InstituteCourse);
    } catch (error) {
        console.log(`Error occurred while Getting Course ${error}`)
        res.status(500).json(error)
    }
}
