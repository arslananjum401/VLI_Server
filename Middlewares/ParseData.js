


const OnlyForUpdateVehicle = (req, key, path) => {
    let NewImageRegex = /image/i
    // let UpdateImageRegex = /UpdateImg/i
    req.body[key] = path;
    if (key.match(NewImageRegex)) {
        req.body.NewImages.push(req.body[key])
        delete req.body[key]
    }
}

export const DataParser = (req, res, next) => {

    try {
        // JSON.parse(req.body.VehicleInfo)
        for (const [key, value] of Object.entries(req.body)) {
            try {
                req.body = JSON.parse(req.body[key])

            } catch (error) {
                null
            }
        }

        req.body.NewImages = []
        for (const [key, value] of Object.entries(req.files)) {
            const path = value[0].path.replaceAll(`\\`, '/');
            let regex = /Vehicle\/update/ig
            if (req.url.match(regex)) {
                // OnlyForUpdateVehicle(req, key, path)
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