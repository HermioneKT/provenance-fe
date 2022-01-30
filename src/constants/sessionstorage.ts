interface Constants {
    ACCESS_TOKEN: string
    ID_TOKEN: string
    REFRESH_TOKEN: string
    EMAIL: string
};

const SESSION_STORAGE_KEY: Constants = {
    ACCESS_TOKEN: "accessToken",
    ID_TOKEN: "idToken",
    REFRESH_TOKEN: "refreshToken",
    EMAIL: "email"
};

export default SESSION_STORAGE_KEY;