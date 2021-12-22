
import * as jwt from 'jsonwebtoken';

import { User } from '../../../entity/User';
import { getRepository } from "typeorm";

class RefreshToken {
	public static getToken(req): string {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
			return req.headers.authorization.split(' ')[1];
		} else if (req.query && req.query.token) {
			return req.query.token;
		}

		return '';
	}

	public async perform(req, res, next) {
		const _token = RefreshToken.getToken(req);
		if (_token === '') {
			return res.json({
				error: ['Invalid access token.']
			});
		}
		console.log(_token);
		const decode = jwt.decode(
			_token,
			res.locals.app.appSecret,
			{
				expiresIn: res.locals.app.jwtExpiresIn * 60
			}
		);
		console.log(decode);
		const userRepository = getRepository(User);
		let targetEntity = await userRepository.findOne({
			where: [{
				emailid: decode.email
			}]
		});
		if (targetEntity) {

			targetEntity.comparePasswords(decode.password, (err, isValid) => {

				if (err) {
					return res.json({
						error: err
					});
				}
				if (!isValid) {
					return res.json({
						error: ['invalid password']
					});
				}

				const token = jwt.sign(
					{ email: decode.emailId, password: decode.password },
					res.locals.app.appSecret,
					{
						expiresIn: res.locals.app.jwtExpiresIn * 60
					}
				);
				targetEntity.password = undefined;
				return res.json({
					userObject: targetEntity,
					accessToken: `Bearer ${token}`,
					tokenExpiration: res.locals.app.jwtExpiresIn * 60
				});

			});
		} else {
			return res.json({ failed: "user no longer exists" });
		}


	}
}

export default new RefreshToken;
