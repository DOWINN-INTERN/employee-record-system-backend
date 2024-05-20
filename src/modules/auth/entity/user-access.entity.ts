import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EnUserAccess } from '../enum/user-access.enum';
import { UserAuth } from './user-auth.entity';

@Entity()
export class UserAccess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EnUserAccess, unique: true })
  name: EnUserAccess;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.userAccess)
  userAuths: UserAuth[];
}
