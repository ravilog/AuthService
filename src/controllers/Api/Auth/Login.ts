import * as jwt from 'jsonwebtoken';

import { User } from "../../../entity/User";
import { getRepository } from "typeorm";

class Login {
	//private  userRepository = getRepository(User);
	public async perform(request, res) {
		console.log(request);
		const emailId = request.body.emailid.toLowerCase();
		const password = request.body.password;
		const userRepository = getRepository(User);
		let targetEntity = await userRepository.findOne({
			where: [{
				emailid: emailId
			}] 
		});

		if (targetEntity) {

			targetEntity.comparePasswords(password, (err, isValid) => {

				if (err) {
					return res.json({
						error: err
					});
				}
				if (!isValid) {
					return res.json({
						error: ['Invalid password.']
					});
				}

				const token = jwt.sign(
					{ email: emailId, password: password },
					res.locals.app.appSecret,
					{ 
						expiresIn: res.locals.app.jwtExpiresIn * 60 }
				);
				targetEntity.password = undefined;
				return res.json({
					userObject: targetEntity,
					accessToken: `Bearer ${token}`,
					tokenExpiration: res.locals.app.jwtExpiresIn * 60
				});

			});


		} else {
			return res.json({ error: "Uauthorized access" });
		}


	}
}

export default new Login;
