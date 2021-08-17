const { Model } = require("objection")
const bcrypt = require("bcryptjs")
const database = require("./database-connection")
Model.knex(database)

class User extends Model {
  static tableName = "user"
  static signup(user){
    return bcrypt.hash(user.password, 12).then(hashedPassword => {
      delete user.password
      user.password_hash = hashedPassword
      return this.query().insert(user)
    })
  }
  static async authenticate(suppliedUser){
    const retrievedUser = await this.query().where("username", suppliedUser.username).first()
    const isAuthenticated = await bcrypt.compare(suppliedUser.password, retrievedUser.password_hash)
    if (!isAuthenticated){
      throw new Error("Bad password")
    }

    return retrievedUser
  }
}

module.exports = User
