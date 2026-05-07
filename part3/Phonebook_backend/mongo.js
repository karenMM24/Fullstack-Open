const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://karen:${password}@ac-ptjle7m-shard-00-00.xbmomae.mongodb.net:27017,ac-ptjle7m-shard-00-01.xbmomae.mongodb.net:27017,ac-ptjle7m-shard-00-02.xbmomae.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-ss3ppp-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const phoneSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', phoneSchema)

if(process.argv.length === 5){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}

if(process.argv.length === 3){
    console.log('phonebook:')
    Person.find({}).then(result => {
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    })
}

