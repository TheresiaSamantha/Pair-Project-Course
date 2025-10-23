const { Student } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs') 

class UserController {
    static async registerForm(req, res) {
        try {
            res.render("register")
        } catch (err) {
            res.send(err)
        }
    }
    static async postRegister(req, res) {
        try {
            const {name,email,password} = req.body
            await Student.create({
                name,
                email,
                password
            })
            res.redirect('/login')
        } catch (err) {
            res.send(err)
        }
    }
    static async loginForm(req, res) {
        try {
            const {error} = req.query;
            res.render("login", {error})
        } catch (err) {
            res.send(err)
        }
    }
    static async postLogin(req, res) {
        try {
            const { name, password } = req.body
            const user = await Student.findOne({where: {name: name}})
            const error = 'invalid username/password'
            if (user) {
                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (isValidPassword) {
                    req.session.userId = user.id
                    req.session.role = user.role
                    const {userId, role} = req.session
                    return res.redirect('/')
                } else {
                    res.redirect(`/login?error=${error}`)
                }
            } else {
                res.redirect(`/login?error=${error}`)
            }
            // res.send(user)
        } catch (err) {
            res.send(err)
        }
    }
    static async getLogout(req, res) {
        try {
            await req.session.destroy()
            return res.redirect('/')
        } catch (err) {
            res.send(err)
        }
    }
}

module.exports = UserController