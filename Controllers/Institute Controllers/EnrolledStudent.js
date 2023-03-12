import db from "../../Conn/connection.js"
import { randomUUID } from 'crypto'
const { User, CourseEnrollment, CoursePackages, InstituteCourses, Institute, StudentInfo, Course, ClassSchedule, CourseProgress, Instructor, TimeTable } = db;

export const GetEnrolledStudents = async (req, res) => {
    try {

        let GetStudents = await User.findAll({
            where: { User: "Student" },
            attributes: { exclude: ["Password", "PhoneNumber", "User", "createdAt"] },
            include: {
                model: CourseEnrollment,
                required: true,

                include: {
                    model: CoursePackages,
                    required: true,

                    include: {
                        model: InstituteCourses,
                        required: true,

                        include: [
                            {
                                model: Institute,
                                where: { InstituteId: req.User.Institute.InstituteId },
                                required: true
                            },
                        ]
                    }
                }
            }
        })

        GetStudents = await Promise.all(await GetStudents.map(async value => {
            const GotInstituteCourse = await value.CourseEnrollment.CoursePackage.getInstituteCourse({ attributes: ["InstituteCourseId"], })
            value.CourseEnrollment.CoursePackage.InstituteCourse.dataValues = GotInstituteCourse.dataValues
            value.CourseEnrollment.CoursePackage.InstituteCourse.dataValues.ClassSchedule = await GotInstituteCourse.getClassSchedules()

            return value
        }))

        res.status(200).json(GetStudents)
    } catch (error) {
        console.log(`Error occurred while Getting Enrolled Students:${error}`)
        res.status(500).json(error)
    }
}
export const GetEnrolledCourseForInstitute = async (req, res) => {
    try {

        let EnrolledCourse = await CourseEnrollment.findOne({
            where: { EnrollmentId: req.params.EnrollmentId },
            include: [{
                model: CoursePackages,
                // required: true,

                include: {
                    model: InstituteCourses,
                    // required: true,

                }

            },

            { model: User, where: { User: "Student" } }
            ]
        })
        // console.log(EnrolledCourse)
        const ClassSchedules = await EnrolledCourse.CoursePackage.InstituteCourse.getClassSchedules();
        const Course = await EnrolledCourse.CoursePackage.InstituteCourse.getCourse();

        EnrolledCourse.dataValues.CoursePackage.dataValues.InstituteCourse.dataValues.ClassSchedules = ClassSchedules
        EnrolledCourse.dataValues.CoursePackage.dataValues.InstituteCourse.dataValues.Course = Course

        res.status(200).json(EnrolledCourse)
    } catch (error) {
        console.log(`Error occurred while Getting Enrolled Students:${error}`)
        res.status(500).json(error)
    }
}
export const GetEnrolledStudentForInstitute = async (req, res) => {
    try {

        let EnrolledCourse = await CourseEnrollment.findOne({
            where: { EnrollmentId: req.params.EnrollmentId },
            attributes: ["EnrollmentId"],
            include: [
                {
                    model: User,
                    required: true,
                    attributes: ["FirstName", "LastName", "Email", "PhoneNumber"],
                    include: {
                        model: StudentInfo,
                        // required: true,
                        where: {
                            StudentInfoId: "4dc4a78a-0a7b-4235-83b9-cbc8c228ac8f"
                        }
                    }
                },
                {
                    model: CourseProgress
                },
                {
                    model: CoursePackages,
                    attributes: ["CoursePackageId", "DrivingHours", "InClassHours", "OnlineHours"]
                },
            ],
            order: [[User, StudentInfo, "createdAt", "DESC"],]
        })

        EnrolledCourse.User.StudentInfo.FreeHours = JSON.parse(EnrolledCourse.User.StudentInfo.FreeHours);
        EnrolledCourse.User.StudentInfo.Schedule = JSON.parse(EnrolledCourse.User.StudentInfo.Schedule);
        let Arr = { ...EnrolledCourse.User.StudentInfo.Schedule }



        const today = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Get the current day of the week (as a number)
        const currentDayOfWeek = today.getDay();
        // console.log(currentDayOfWeek)
        // Calculate the date of the Saturday at the start of the current week
        const saturday = new Date(today);
        saturday.setDate(today.getDate() - currentDayOfWeek + 6);

        // Create an array to hold the dates and days of the current week
        const week = [];

        // Loop through the week, adding each date and day to the array
        for (let i = 0; i < 7; i++) {
            const date = new Date(saturday);
            date.setDate(saturday.getDate() + i);
            const dayOfWeek = daysOfWeek[date.getDay()];
            week.push({ date: date.getDate(), month: date.getMonth(), year: date.getFullYear(), dayOfWeek: dayOfWeek });
        }

        // Log the dates and days of the current week
        // console.log(week)

        let ScheduleTimetable = [{}]
        let Index = 0
        for (let [key, value] of Object.entries(Arr)) {
            let SplitSlot = value.split(/[-,:,\s-\s]/)

            week.forEach((W_Value) => {
                if (W_Value?.dayOfWeek === key) {

                    let start = new Date();

                    start.setDate(W_Value?.date);
                    start.setMonth(W_Value?.month);
                    start.setFullYear(W_Value?.year);

                    if (SplitSlot[2] === "PM" && Number(SplitSlot[0]) < 12)
                        SplitSlot[0] = Number(SplitSlot[0]) + 12

                    start.setHours(SplitSlot[0]);
                    start.setMinutes(SplitSlot[1]);
                    start.setSeconds(0)
                    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };

                    // let EndPart = SplitSlot[SplitSlot.length - 1]
                    // let EndDate = EndPart.slice(0, EndPart.length / 2)
                    // let EndDate_AM_PM = EndPart.slice(EndPart.length / 2)
                    // console.log(SplitSlot)
                    let end = new Date();
                    end.setDate(W_Value?.date);
                    end.setMonth(W_Value?.month);
                    end.setFullYear(W_Value?.year);
                    end.setSeconds(0)
                    if (SplitSlot[7] === "PM" && Number(SplitSlot[5]) < 12)
                        SplitSlot[5] = Number(SplitSlot[5]) + 12

                    end.setHours(SplitSlot[5]);
                    end.setMinutes(SplitSlot[6]);


                    // console.log(start.toLocaleString('en-US', options), end.toLocaleString('en-US', options))
                    ScheduleTimetable[Index] = {}
                    ScheduleTimetable[Index] = { start, end, event_id: randomUUID() }
                    Index = ++Index
                }
            })

        }
        // console.log(ScheduleTimetable)
        EnrolledCourse.dataValues.ScheduleTimetable = ScheduleTimetable;
        // console.log(ScheduleTimetable)
        res.status(200).json(EnrolledCourse)
    } catch (error) {
        console.log(`Error occurred while Getting Enrolled Students:${error}`);
        res.status(500).json(error);
    }
}


export const GetEnrolledStudentForInstructor = async (req, res) => {
    try {

        let EnrolledStudents = await Instructor.findOne({
            where: { InstructorId: req.params.InstructorId },
            // attributes: ["InstructorId"],
            include: [
                {
                    model: CourseEnrollment,

                    attributes: ["EnrollmentId", "createdAt"],
                    include: [{
                        model: User,
                        where: { User: "Student" },
                        include: [{ model: StudentInfo }, { model: CourseEnrollment, include: { model: TimeTable } }]

                    },
                    {
                        model: TimeTable
                    },
                    ]
                },
                {
                    model: User,

                }
            ]
        })

        const Time = await TimeTable.findAll({
            where: { InstructorFK: req.params.InstructorId },
            include: {
                model: Instructor,
                include: { model: User }
            }

        })
        console.log(EnrolledStudents)
        res.status(200).json(EnrolledStudents?.CourseEnrollment)
    } catch (error) {
        console.log(`Error occurred while Getting Enrolled Students:${error}`)
        res.status(500).json(error)
    }
}