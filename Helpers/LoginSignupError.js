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


export const SignupErrorHelper = (ErrorObject, res, Body) => {
    let ErrorObj = {}, ReturnErr = false;

    if (!Body.Email) { ErrorObj.Email = "E-Mail is required"; ReturnErr = true; }
    if (!Body.UserName) { ErrorObj.UserName = "UserName is required."; ReturnErr = true; }
    if (!Body.FirstName) { ErrorObj.FirstName = "First Name is required"; ReturnErr = true; }
    if (!Body.LastName) { ErrorObj.LastName = "Last Name is required"; ReturnErr = true; }
    if (!Body.Password) { ErrorObj.Password = "Password is required"; ReturnErr = true; }
    if (!Body.ConfirmPassword) { ErrorObj.ConfirmPassword = "Confirm Password is required"; ReturnErr = true; }
     
    for (let [key, value] of Object.entries(ErrorObject)) {
        if (value) {

            if (key === 'Email') {
                ErrorObj.Email = "E-Mail is already taken.";
                ReturnErr = true;
            }
            if (key === 'UserName') {
                ErrorObj.UserName = "UserName is already taken.";
                ReturnErr = true;
            }
        }
    };



    if (ReturnErr) res.status(401).json(ErrorObj);

    return ReturnErr;
}