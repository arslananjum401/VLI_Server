


const OnlyForUpdateVehicle = (req, key, path) => {
    let NewImageRegex = /image/i
    let UpdateImageRegex = /UpdateImg/i

    if (key.match(UpdateImageRegex)) {
        req.body.Images.UpdateImages = req.body.Images.UpdateImages.map((value) => {
            if (path.indexOf(value.ImageName) > -1) {
                value.path = path
            }
            return value
        })
    } else if (key.match(NewImageRegex)) {
        if (!req.body.Images.NewImages) {
        req.body.Images.NewImages = []
        } 
        req.body.Images.NewImages.push(path);
    }

}

export const DataParser = (req, res, next) => {

    try {
        for (const [key, value] of Object.entries(req.body)) {
            try {
                req.body = JSON.parse(req.body[key])

            } catch (error) {
                null
            }
        }
 
        for (const [key, value] of Object.entries(req.files)) {
            const path = value[0].path.replaceAll(`\\`, '/');

            let regex = /Vehicle\/update/ig
            if (req.url.match(regex)) {
                OnlyForUpdateVehicle(req, key, path)
            } else {
                req.body[key] = path
            }
        }

        next()
    } catch (error) {
        console.log("Error Occurred while parsing data: " + error);
        res.status(200).json(error)
    }
}