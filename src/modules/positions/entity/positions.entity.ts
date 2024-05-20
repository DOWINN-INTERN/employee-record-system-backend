import { Departments } from 'src/modules/departments/entity/departments.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Positions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  hierarchy: number;

  @Column()
  metrics: string;

  @ManyToOne(() => Departments, (departments) => departments.positions, { eager: true })
  @JoinColumn({ name: 'departmentId' })
  department: Departments;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
