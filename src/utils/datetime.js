export const today = () => {
    return getDate(new Date());
};

export const getDate = (dateTime) => {
    return dateTime.toISOString().slice(0, 10);
};

export const getDateTime = (dateTimeObj) => {
    return dateTimeObj.toLocaleString();
};

export const dateTimeObjFromString = (dateTimeStr) => {
    return new Date(dateTimeStr);
};