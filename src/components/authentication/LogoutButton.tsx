import Link from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import routes from 'constants/routes';
import AuthContext, { authContextDefaultValue } from 'contexts/AuthContext';
import React from 'react';
import { useHistory } from 'react-router';
import cognitoService from 'utils/CognitoService';


interface IProps {
    handleClose: Function
}

/**
 * LogoutButton component
 * This LogoutButton component implements
 * the UI for logout. This functional
 * component is used in the Header as a
 * child component
 * @param props 
 * @returns {JSX.Element}
 * 
 * @author Lim Her Huey
 */
const LogoutButton = (props: IProps) => {
    const history = useHistory();
    const { setAuthState } = React.useContext(AuthContext);
    
    const handleLogOut = () => {
        props.handleClose();

        cognitoService.logOut();
        setAuthState({...authContextDefaultValue.authState});
        history.push(routes.HOME);
    }
    return (
        <>
            <MenuItem onClick={handleLogOut} >Log Out</MenuItem>
        </>
    )
}

export default LogoutButton;