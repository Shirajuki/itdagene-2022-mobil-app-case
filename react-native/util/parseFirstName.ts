export default (name?: string) => {
    let firstName = name?.split(' ')[0] || "";
    if (firstName.includes('-')){
        firstName = firstName.split('-')[0] + firstName.split('-')[1];
    }
    return firstName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};