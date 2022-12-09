const Subject = require('../model/Subject')

module.exports.onAddNewSubject = async (e, args) => {
  try {
    let subject = new Subject(args)
    const subjectSaved = await subject.save()
    e.reply('new-subject-saved',JSON.stringify(subjectSaved))
} catch (error) {
    e.reply('error',error.message)
}
}

module.exports.onGetSubjects = async (e, args) => {
    try {
        const subjects = await Subject.find()
        e.reply('get-subjects',JSON.stringify(subjects))
        
    } catch (error) {
        e.reply('error',error.message)
    }
}

module.exports.onDeleteSubjects = async (e, _id) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(_id)
        e.reply('delete-subject-success',JSON.stringify(deletedSubject))
    } catch (error) {
        console.log(error);
        e.reply('error',error.message)
    }
}

module.exports.onUpdateSubjects = async (e, args) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(args.idSubjectToUpdate,
            {title: args.title,description: args.description},{new: true})
        e.reply("update-subject-success",JSON.stringify(updatedSubject))
        
    } catch (error) {
        console.log(error);
        e.reply('error',error.message)
    }
}