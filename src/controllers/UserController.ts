import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken';
//import { ClientResponse } from "http";

export class UserController {

    private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.emailid);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    async Login(request: Request, response: Response, next: NextFunction) {
        const emailId = request.body.emailid.toLowerCase();
        const password = request.body.password;

        let targetEntity =  await this.userRepository.findOne({
            where: [{
                emailid: emailId
            }]
        });
        if (targetEntity && targetEntity.password == password) {

            const token = jwt.sign({ email: emailId},
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
            
            targetEntity.password=undefined;
            return response.json({
                targetEntity,
                token,
                tokenExpiration: 60
            });
        }
        
        return response.json({result:"unauthorized access"});
    }
    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

}