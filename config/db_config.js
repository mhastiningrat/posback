const pg = require('pg');
const {Client} = pg;
// pg_host_staging     =52.220.159.114
// pg_db               =db_boss
// pg_user             =lontarindo
// pg_port             =5432
// pg_password_staging =tok0p1ntar!!staging!!
const config = {
    host: process.env.DB_GP_HOST,
    port: process.env.DB_GP_PORT,
    database: process.env.DB_GP_NAME,
    user: process.env.DB_GP_USER,
    password: process.env.DB_GP_PASSWORD,
    idleTimeoutMillis: 800
}

const config_gateway = {
    host: process.env.DB_GP_HOST,
    port: process.env.DB_GP_PORT,
    database: process.env.DB_GATEWAY_NAME,
    user: process.env.DB_GP_USER,
    password: process.env.DB_GP_PASSWORD,
    idleTimeoutMillis: 800
}

const sqlCon = async(query)=>{
    const client = new Client(config)
    try {
        let data;
        await client.connect();

        data = await client.query(query);

        client.end();
        return data
    } catch (error) {
        console.log('--- ERR CONNECTION ---');
        console.log(error.message)
        setTimeout(()=>{
            healthCheck()
        },3000);
    }
}

const sqlConGateway = async(query)=>{
    const client = new Client(config_gateway)
    try {
        let data;
        await client.connect();

        data = await client.query(query);

        // console.log(data)
        // await client.release();
        client.end();
        return data
    } catch (error) {
        console.log('--- ERR CONNECTION ---')
        console.log(error.message)
        setTimeout(()=>{
            healthCheck()
        },3000)
        // await client.end();
    }
}

const healthCheck = async() => {
    const client = new Client(config)
    try {
        await client.connect();
        console.log("========== DB CONNECTION ==========");
        console.log("=== HOST "+ process.env.DB_GP_HOST+"  OK")
        console.log("-----------------------------------");
        // (await client.connect()).release();
        client.end();
        // console.log(ends)
    } catch (error) {
        let e = error.message || error.code
        console.log("========== DB CONNECTIONS ==========");
        console.log("=== HOST "+ process.env.DB_GP_HOST+"  "+ e)
        console.log("-----------------------------------");
        // console.log(error)
        setTimeout(()=>{
            healthCheck()
        },3000)
    }
}


module.exports = {
    sqlCon,
    sqlConGateway,
    healthCheck
}