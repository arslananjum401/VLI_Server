export const InsCheckErrorHelper = (obj, res) => {
    let ErrorObj = {}, ReturnErr = false;

    for (let [key, value] of Object.entries(obj)) {
        if (value) {
            if (key === 'InsNameErr') {
                ErrorObj.InsNameErr = true;
                ReturnErr = true;
            }
            if (key === 'EmailErr') {
                ErrorObj.EmailErr = true;
                ReturnErr = true;
            }
            if (key === 'UserNameErr') {
                ErrorObj.UserNameErr = true;
                ReturnErr = true;
            }
        }
    };

    if (ReturnErr) {
        res.status(401).json(ErrorObj);
    }
    return ReturnErr;
}


export const SignupErrorHelper = (obj, res) => {
    let ErrorObj = {}, ReturnErr = false;

    for (let [key, value] of Object.entries(obj)) {
        if (value) {

            if (key === 'EmailErr') {
                ErrorObj.EmailErr = true;
                ReturnErr = true;
            }
            if (key === 'UserNameErr') {
                ErrorObj.UserNameErr = true;
                ReturnErr = true;
            }
        }
    };
    if (ReturnErr) {
        res.status(401).json(ErrorObj);
    }
    return ReturnErr;
}