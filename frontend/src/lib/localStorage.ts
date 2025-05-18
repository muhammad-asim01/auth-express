export const setAccessToken = (storage:any,token: string) => {
    storage.setItem("accessToken", token);
}

export const getAccessToken = (storage:any) => {
    return storage.getItem("accessToken");
}

export const removeAccessToken = (storage:any) => {
    storage.removeItem("accessToken");
}