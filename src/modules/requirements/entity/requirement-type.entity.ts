import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EnRequirementType } from '../enum/requirements.enum';
import { Requirements } from './requirements.entity';

@Entity()
export class RequirementType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: EnRequirementType, unique: true })
  name: EnRequirementType;

  @OneToMany(() => Requirements, (requirements) => requirements.requirementType)
  requirements: Requirements[];
}
