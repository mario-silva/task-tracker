export const today = () => {
    return getDate(new Date);
};

export const getDate = (dateTime) => {
    return dateTime.toISOString().slice(0, 10);
};