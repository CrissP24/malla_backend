const {Pool} = require('pg')
const pool =new  Pool({
    user: 'syllabus2025_owner',
    host: 'ep-royal-sound-acuhwauy-pooler.sa-east-1.aws.neon.tech',
    password: 'npg_9dZ3ouCacVhN',
    database: 'msyllabus2025',
    port: '5432'
})
module.exports = pool;
