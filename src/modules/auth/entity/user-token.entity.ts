import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserAuth } from './user-auth.entity';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sub: string;

  @Column()
  refreshToken: string;

  @Column()
  ipAddress: string;

  @Column()
  location: string;

  @Column()
  browser: string;

  @Column()
  osystem: string;

  @Column()
  device: string;

  @ManyToOne(() => UserAuth, (userAuth) => userAuth.refreshTokens, { eager: true })
  @JoinColumn({ name: 'userAuthId' })
  userAuth: UserAuth;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
