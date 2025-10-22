const { Student } = require('../models')
const { Op } = require('sequelize')

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
            res.render("login")
        } catch (err) {
            res.send(err)
        }
    }
    static async postLogin(req, res) {
        try {
            res.send("test")
        } catch (err) {
            res.send(err)
        }
    }
}

module.exports = UserController