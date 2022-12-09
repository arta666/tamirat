const app = require('../server/app')
const request = require('supertest')
const { INTERNAL } = require('sqlite3')

describe('register', () => {
    it('return status code 200 if pass', async () => {
        const res = await request(app).post('/customer')
        .send({ customer: 'jan'})

        expect(res.statusCode).toEqual(200)
    })

})