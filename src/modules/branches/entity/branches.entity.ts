import { EnStatus } from 'src/common/enum/status.enum';
import { Departments } from 'src/modules/departments/entity/departments.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BranchImage } from './branches-image.entity';

@Entity()
export class Branches {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EnStatus })
  status: EnStatus;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  alias: string;

  @Column({ unique: true })
  metrics: string;

  @Column()
  address: string;

  @OneToMany(() => Departments, (departments) => departments.branch)
  departments: Departments[];

  @OneToOne(() => BranchImage, (branchImage) => branchImage.branch, { eager: true })
  @JoinColumn({ name: 'branchImageId' })
  branchImage: BranchImage;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
