const OnlyForUpdateVehicle = (req, key, path) => {

    const Exp = /Image\d/i;

    req.body.Images.forEach((value, index) => {
        let ImageKey = Object.keys(value).filter((key) => Exp.test(key));
        if (key === ImageKey[0] && value[ImageKey[0]] === "Changed") {
            req.body.Images[index] = {
                ImagePath: req.files[ImageKey[0]][0].path,
                Vehicle_ImageId: value.Vehicle_ImageId
            }
        }
    })
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

            } else
                req.body[key] = path
 
        }

        next()
    } catch (error) {
        console.log("Error Occurred while parsing data: " + error);
        res.status(200).json(error)
    }
}