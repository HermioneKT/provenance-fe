import React, {Dispatch, SetStateAction} from 'react';

export interface AuthContextState {
    isAuthenticated: boolean,
    email: null | string
}

export interface AuthStateProperties {
    authState: AuthContextState,
    setAuthState: Dispatch<SetStateAction<AuthContextState>>
}

export const authContextDefaultValue: AuthStateProperties = {
    authState: {
        isAuthenticated: false,
        email: null
    },
    setAuthState: (state) => {}
}

const AuthContext = React.createContext<AuthStateProperties>(authContextDefaultValue);


export default AuthContext;