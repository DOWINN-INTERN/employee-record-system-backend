import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RequirementType } from './requirement-type.entity';

@Entity()
export class Requirements {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  metrics: string;

  @ManyToOne(() => RequirementType, (requirementType) => requirementType.requirements, { eager: true })
  @JoinColumn({ name: 'requirementTypeId' })
  requirementType: RequirementType;
}
