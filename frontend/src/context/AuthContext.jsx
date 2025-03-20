import { createContext, useEffect, useReducer } from "react";
import { getToken, setToken as saveToken, removeToken } from "../utils/auth";

const initialState = {
    user: localStorage.getItem('user') != undefined ? JSON.parse(localStorage.getItem('user')) : null,
    role: localStorage.getItem('role') || null,
    token: getToken() || null,
};
export const authContext = createContext(initialState);

const authReducer = (state, action) => {

    switch (action.type) {
        case 'LOGIN_START':

            return {
                user: null,
                role: null,
                token: null,
            };

        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: {
                    ...action.payload.user,
                    photo: action.payload.user?.photo || null
                },
                token: action.payload.token,
                role: action.payload.role
            };

        case 'LOGOUT':

            return {
                user: null,
                role: null,
                token: null,
            };

        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (state.token) {
            saveToken(state.token);
            localStorage.setItem("role", state.role);
        } else {
            removeToken();
            localStorage.removeItem("role");
        }
    }, [state.token, state.role]);

    return (
        <authContext.Provider
            value={{
                user: state.user,
                token: state.token,
                role: state.role,
                dispatch
            }}
        >
            {children}
        </authContext.Provider>
    );
};