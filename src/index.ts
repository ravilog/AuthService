// import "reflect-metadata";
// import {createConnection} from "typeorm";
// import * as express from "express";
// import * as bodyParser from "body-parser";
// import {Request, Response} from "express";
// import {Routes} from "./routes/routes";
// import {User} from "./entity/User";

// createConnection().then(async connection => {

//     // create express app
//     const app = express();
//     app.use(bodyParser.json());

//     // register express routes from defined application routes
//     Routes.forEach(route => {
//         (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
//             const result = (new (route.controller as any))[route.action](req, res, next);
//             if (result instanceof Promise) {
//                 result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

//             } else if (result !== null && result !== undefined) {
//                 res.json(result);
//             }
//         });
//     });

//     // setup express app here
//     // ...

//     // start express server
//     app.listen(3000);

//     //insert new users for test
//     await connection.manager.save(connection.manager.create(User, {
//         firstName: "test",
//         lastName: "user1",
//         age: 27,
//         emailid: "test@test.com",
//         password: "test123"
//     }));
//     await connection.manager.save(connection.manager.create(User, {
//         firstName: "test",
//         lastName: "user2",
//         age: 24,
//         emailid:"test2@test.com",
//         password:"test124"
//     }));

//     console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

// }).catch(error => console.log(error));

import * as os from 'os';
import * as cluster from 'cluster';

import App from './providers/App';
import locals from './providers/Locals';
import NativeEvent from './exception/NativeEvent';
if (locals.config().clusterEnabled &&  cluster.isMaster) {
	/**
	 * Catches the process events
	 */
	NativeEvent.process();

	/**
	 * Clear the console before the app runs
	 */
	App.clearConsole();

	/**
	 * Load Configuration
	 */
	App.loadConfiguration();

	/**
	 * Find the number of available CPUS
	 */
	const CPUS: any = os.cpus();

	/**
	 * Fork the process, the number of times we have CPUs available
	 */
	CPUS.forEach(() => cluster.fork());

	/**
	 * Catches the cluster events
	 */
	NativeEvent.cluster(cluster);

	/**
	 * Loads the Queue Monitor iff enabled
	 */
	App.loadQueue();

	/**
	 * Run the Worker every minute
	 * Note: we normally start worker after
	 * the entire app is loaded
	 */
	setTimeout(() => App.loadWorker(), 1000 * 60);

} else {

	/**
	 * Run the Database pool
	 */
	
	App.loadDatabase();

	/**
	 * Run the Server on Clusters
	 */
	App.loadServer();
}
