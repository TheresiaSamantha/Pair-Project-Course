const { Student, StudentDetail, Course, Category } = require('../models')
const { Op } = require('sequelize')
const { toTitleCase } = require('../helpers/helper')
const easyinvoice = require('easyinvoice')


class Controller {
    static landingPage(req, res) {
        try {
            const {error} = req.query;
            res.render("landingPage", {error})
        } catch (err) {
            res.send(err)
        }
        }

    static async studentDetail(req, res) {
        try {
            const {userId} = req.session

            const data = await Student.findByPk(userId, {
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
            const {userId} = req.session

            const data = await Student.findByPk(userId, {
            include: [StudentDetail]
            })

            res.render('studentEdit', { data })
        } catch (err) {
            res.send(err)
        }
        }

        static async postEdit(req, res) {
        try {
            const {userId} = req.session
            const id = userId
            console.log(id, "<---- student id");
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

            res.redirect(`/students`)
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

    static async invoiceCourse(req, res) {
        try {
        const { courseId } = req.params
        const {userId} = req.session
        const student = await Student.findByPk(userId, { include: [StudentDetail] })
        const course = await Course.findByPk(courseId)

        if (!student || !course) {
            return res.send('Data tidak ditemukan')
        }

        const RATE = 50000
        const qty = Number(course.duration) || 0
        const today = new Date().toISOString().split('T')[0]

        const data = {
            sender: {
            company: 'LeMusik Academy',
            address: 'Jl. Melodi No. 88',
            zip: '40222',
            city: 'Bandung',
            country: 'Indonesia',
            email: 'support@lemusik.id'
            },
            client: {
            company: student.name,
            address: student.StudentDetail ? student.StudentDetail.address : '-',
            zip: student.StudentDetail ? String(student.StudentDetail.ktm) : '-',
            city: '—',
            country: 'Indonesia',
            },
            information: {
            number: `INV-${student.id}-${course.id}`,
            date: today,
            'due-date': today
            },
            products: [
            {
                quantity: qty,
                description: `${course.name}`,
                price: RATE
            }
            ],
            settings: { currency: 'IDR' },
            'bottom-notice': 'Terima kasih telah belajar di LeMusik Academy!'
        }

        const result = await easyinvoice.createInvoice(data)
        const pdfBuffer = Buffer.from(result.pdf, 'base64')

        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'inline; filename=invoice.pdf')
        res.end(pdfBuffer)
        } catch (err) {
        res.send(err)
        }
    }
    
}

module.exports = Controller