export const helpers = { 
    equals: (first, second) => first === second,
    equals_url: (first, second) => first.split('/')[1].includes(second)
    ,
    getAge: (birthdate) => {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },
    isEmpty: (array) => array.length === 0,
    compareFirst: (first, second) => first > second
    
}