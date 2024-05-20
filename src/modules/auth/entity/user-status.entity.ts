import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EnUserStatus } from '../enum/user-status.enum';
import { UserAuth } from './user-auth.entity';

@Entity()
export class UserStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EnUserStatus, unique: true })
  name: EnUserStatus;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.userStatus)
  userAuths: UserAuth[];
}
