import mongoose  from "mongoose";
const DB_NAME ="onlinecourse"
async function ConectDb() {
    try {
        const connectionInstance = await mongoose .connect(`${process.env.MONGOODB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connecting ...`);
        
        console.log(`\nMongoDB connection established! DB Host: ${connectionInstance.connection.name}`);
    } catch (error) {
        console.log("server Not Connect..",error);
    }
}
export default ConectDb;