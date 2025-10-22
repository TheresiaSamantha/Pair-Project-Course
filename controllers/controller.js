const { Student, StudentDetail, Course, Category } = require('../models')
const { Op } = require('sequelize')
const { toTitleCase } = require('../helpers/helper')


class Controller {
    static landingPage(req, res) {
        try {
            res.render("landingPage")
        } catch (err) {
            res.send(err)
        }
        }

    static async studentDetail(req, res) {
        try {
            const { id } = req.params

            const data = await Student.findByPk(id, {
                include: [
                { model: StudentDetail },
                { model: Course, include: [Category] }
                ]
            })

            res.render('studentDetails', { data })
        } catch (err) {
            res.send(err)
        }
    }

    static async getEdit(req, res) {
        try {
            const { id } = req.params

            const data = await Student.findByPk(id, {
            include: [StudentDetail]
            })

            res.render('studentEdit', { data })
        } catch (err) {
            res.send(err)
        }
        }

        static async postEdit(req, res) {
        try {
            const { id } = req.params
            const { name, address, ktm, grade, dateOfBirth } = req.body

            await Student.update({ name }, { where: { id } })

            const detail = await StudentDetail.findOne({ where: { StudentId: id } })
            if (detail) {
            await StudentDetail.update(
                { address, ktm, grade, dateOfBirth },
                { where: { StudentId: id } }
            )
            } else {
            await StudentDetail.create({ address, ktm, grade, dateOfBirth, StudentId: id })
            }

            res.redirect(`/students/${id}`)
        } catch (err) {
            res.send(err)
        }
    }

    static async readCourse(req, res) {
        try {
            const { search, notif } = req.query

            const options = {
            include: [
                { model: Category },
                { model: Student }
            ],
            order: [['name', 'ASC']]
            }

            if (search) {
            options.where = { name: { [Op.iLike]: `%${search}%` } }
            }

            const courses = await Course.findAll(options)
            const info = await Course.notif()

            res.render('courses', { courses, search, info: info[0].dataValues, notif, toTitleCase })
        } catch (err) {
            res.send(err)
        }
        }

    static async getAdd(req, res) {
        try {
            const categories = await Category.findAll()
            res.render("courseAdd", { categories })
        } catch (err) {
            res.send(err)
        }
    }

    static async postAdd(req, res) {
        try {
            const { name, description, duration, CategoryId } = req.body
            await Course.create({ name, description, duration, CategoryId })
            res.redirect("/courses")
        } catch (err) {
            if (err.name === "SequelizeValidationError") {
                const categories = await Category.findAll()
                const errors = err.errors.map(e => e.message)
                return res.render("courseAdd", { categories, errors })
            }
            res.send(err)
        }
    }
    

    static async delete(req, res) {
        try {
            const { id } = req.params

            const course = await Course.findByPk(id)
            const courseName = course.name

            await Course.destroy({ where: { id } })

            const notif = `Course ${courseName} berhasil dihapus!`

            res.redirect(`/courses?notif=${notif}`)
        } catch (err) {
            res.send(err)
        }
    }
    
}

module.exports = Controller