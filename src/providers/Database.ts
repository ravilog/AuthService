
import * as bluebird from 'bluebird';
import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "../entity/User";
import Locals from './Locals';
import Log from '../middlewares/Log';

export class Database {

	public static init(): any {
		createConnection().then(async connection => {
			//insert new users for test
			await connection.manager.save(connection.manager.create(User, {
				firstName: "ravi",
				lastName: "user1",
				age: 27,
				emailid: "test@test.com",
				password:  "test123"
			}));
			await connection.manager.save(connection.manager.create(User, {
				firstName: "ravitest",
				lastName: "user2",
				age: 24,
				emailid: "test2@test.com",
				password: "test124"
			}));
		})
	}
	// Initialize your database pool

	// const dsn = Locals.config().mongooseUrl;
	// const options = { useNewUrlParser: true, useUnifiedTopology: true };

	// (<any>mongoose).Promise = bluebird;

	// mongoose.set('useCreateIndex', true);

	//mongoose.connect(dsn, options, (error: MongoError) => {
	// handle the error case
	//if (error) {
	//Log.info('Failed to connect to the Mongo server!!');
	//console.log(error);
	//throw error;
	//} else {
	//	Log.info('connected to mongo server at: ' + dsn);
	//}
	//});

}
export default Database;

