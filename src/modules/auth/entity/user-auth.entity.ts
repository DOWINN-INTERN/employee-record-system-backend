import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserAccess } from './user-access.entity';
import { UserInfo } from './user-info.entity';
import { UserStatus } from './user-status.entity';
import { UserToken } from './user-token.entity';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => UserAccess, (userAccess) => userAccess.userAuths, { eager: true })
  @JoinColumn({ name: 'userAccessId' })
  userAccess: UserAccess;

  @ManyToOne(() => UserStatus, (userStatus) => userStatus.userAuths, { eager: true })
  @JoinColumn({ name: 'userStatusId' })
  userStatus: UserStatus;

  @OneToOne(() => UserInfo, (userInfo) => userInfo.userAuth, { eager: true })
  @JoinColumn({ name: 'userInfoId' })
  userInfo: UserInfo;

  @OneToMany(() => UserToken, (userToken) => userToken.userAuth)
  refreshTokens: UserToken[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
