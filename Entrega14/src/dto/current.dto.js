export default class CurrentDTO {
    constructor(user) {
        this.email = user.email
        this.age = user.age
        this.cart = user.cart
        this.fullname = `${user.first_name} ${user.last_name}`
    }
}