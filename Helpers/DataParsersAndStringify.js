export const StringifyFQAs = (req) => {
    if (req.body.Possible_FAQs && req.body.Possible_FAQs.length > 0) {
        req.body.Possible_FAQs = JSON.stringify(req.body.Possible_FAQs)
    }
}
export const ParseFAQs = (CourseData) => {
    console.log(CourseData.Possible_FAQs)
    if (CourseData.Possible_FAQs) {
        CourseData.Possible_FAQs = JSON.parse(CourseData.Possible_FAQs)
    }
}