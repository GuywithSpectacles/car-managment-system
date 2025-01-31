import { Navigate } from "react-router-dom";

function Protected({isAuth, children}) {
    //if isAuth is true user is logged in
    if(isAuth){
        return children
    }
    else {
        //if not logged in then we'll navigate the user to to login page
        return <Navigate to="/login" />
    }
}

export default Protected;