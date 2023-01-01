import db from "../../../Conn/connection.js"

const { Course, InstituteCourses, CoursePackages, Institute } = db;

export const IncludeQuery = {
    include: {
        model: Course,
        attributes: ["CourseName", "Description", "CourseThumbnail"],
        include: {
            model: InstituteCourses,
            attributes: ["InstituteCourseId", "ShortDescription"],
            include: [
                { model: CoursePackages, attributes: ["CoursePackageId", "TotalFee", "InstallmentSchedule"] },

                { model: Institute, attributes: ["InstituteName", "InstituteId", "Country", "State", "City"] },

            ]
        }
    },
    order: []
}
