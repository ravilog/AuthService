
import {User} from '../../../entity/User';
import { getRepository } from "typeorm";
import * as bcrypt from 'bcrypt-nodejs';
import { exists } from 'fs';
import { nextTick } from 'process';

class Register {
	public async perform (req, res) {
		req.assert('emailid', 'E-mail cannot be blank').notEmpty();
		req.assert('emailid', 'E-mail is not valid').isEmail();
		req.assert('password', 'Password cannot be blank').notEmpty();
		req.assert('password', 'Password length must be atleast 8 characters').isLength({ min: 8 });
		req.assert('confirmPassword', 'Confirmation Password cannot be blank').notEmpty();
		req.assert('confirmPassword', 'Password & Confirmation password does not match').equals(req.body.password);
		req.sanitize('emailid').normalizeEmail({ gmail_remove_dots: false });

		const errors = req.validationErrors();
		if (errors) {
			return res.json({
				error: errors
			});
		}

		const _emailId = req.body.emailid;
		const _password = req.body.password;
		const userRepository = getRepository(User);

		let targetEntity = await userRepository.findOne({
			where: [{
				emailid: _emailId
			}]
		});
		
		if (targetEntity) {
            return res.json({error: "email id is already associated with an existing account"});
		}

			bcrypt.genSalt(10, async(_err, _salt) => {
				 if (_err) {
					 console.log(`error during salt generation${_err}`)
					  //todo: log the error and return;
				 }
				 bcrypt.hash(_password, _salt,null, (_err, _hash) => {
					 if (_err) {
						 console.log(`error during hash generation${_err}`);
						
						 
					 }
					 console.log(_hash);
					  return userRepository.insert({
						emailid : _emailId,
						password:  _hash,
						age: req.body.age,
						firstName: req.body.firstName,
						lastName: req.body.lastName
			
					}).then( (result) => {
						return res.json({
							message: "User registered successfully"
						});
					});
					
				 });
			 })
			 
		 
		
		// const user = new User({
		// 	email: _email,
		// 	password: _password
		// });

		// User.findOne({ email: _email }, (err, existingUser) => {
		// 	if (err) {
		// 		return res.json({
		// 			error: err
		// 		});
		// 	}

		// 	if (existingUser) {
		// 		return res.json({
		// 			error: ['Account with the e-mail address already exists.']
		// 		});
		// 	}

		// 	user.save((err) => {
		// 		if (err) {
		// 			return res.json({
		// 				error: err
		// 			});
		// 		}

		// 		return res.json({
		// 			message: ['You have been successfully registered with us!']
		// 		});
		// 	});
		//});
	}
}

export default new Register;
