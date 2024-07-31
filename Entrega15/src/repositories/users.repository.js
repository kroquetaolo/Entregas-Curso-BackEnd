import UserDto from "../dto/users.dto.js";

export default class UsersRepository {
    constructor(usersDao) {
        this.usersDao = usersDao;
    }

    getUsers           = async () => await this.usersDao.getAll()
    createUser         = async (user) => await this.usersDao.create(new UserDto(user))
    getUserPopulate    = async (_id) => await this.usersDao.getPopulated(_id)
    getUserBy          = async (filter) => await this.usersDao.getBy(filter)
    changeUserPassword = async (user, password) => await this.usersDao.changePassword(user, password)
    switchUserRol      = async (uid) => await this.usersDao.switchRol(uid)
}