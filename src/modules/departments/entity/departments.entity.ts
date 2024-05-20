import { EnStatus } from 'src/common/enum/status.enum';
import { Branches } from 'src/modules/branches/entity/branches.entity';
import { Positions } from 'src/modules/positions/entity/positions.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Departments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EnStatus })
  status: EnStatus;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  alias: string;

  @Column()
  metrics: string;

  @ManyToOne(() => Branches, (branches) => branches.departments, { eager: true })
  @JoinColumn({ name: 'branchId' })
  branch: Branches;

  @OneToMany(() => Positions, (positions) => positions.department)
  positions: Positions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
