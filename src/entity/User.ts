import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, BeforeInsert } from "typeorm";

import * as bcrypt from 'bcrypt-nodejs';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column()
    emailid: string;

    @Column()
    password: string;
//@BeforeInsert()
    // hashpassword() {
    //    bcrypt.genSalt(10, (_err, _salt) => {
    //         if (_err) {
    //             console.log(`error during salt generation${_err}`)
    //              //todo: log the error and return;
    //         }
    //         bcrypt.hash(this.password, _salt,null, (_err, _hash) => {
    //             if (_err) {
    //                 console.log(`error during hash generation${_err}`)
                    
    //             }
    //             this.password=_hash;
                
    //         });
    //     });
        
    // }

    comparePasswords(requestPasswordvalue: string, _cb: any) {
        bcrypt.compare(requestPasswordvalue, this.password, (_err, _isMatch) => {
            return _cb(_err, _isMatch);
        });
    }


}
