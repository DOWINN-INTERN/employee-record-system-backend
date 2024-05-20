import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Branches } from './branches.entity';

@Entity()
export class BranchImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageId: string;

  @Column()
  thumbnail: string;

  @Column()
  original: string;

  @Column()
  public: string;

  @OneToOne(() => Branches, (branches) => branches.branchImage)
  branch: Branches;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
