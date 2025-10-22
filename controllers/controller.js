const { Student, StudentDetail, Course, Category } = require('../models')

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

    
}

module.exports = Controller