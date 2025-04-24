import { ApiProperty } from '@nestjs/swagger'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from '../base/base.model'



@Entity({
  name:  'customer'
})
export class CustomerEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 50, nullable: false })
  FirstName: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  LastName: string

  @Column({  nullable: false, default: 30 })
  DateOfBirth: Date

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string

  @Column({ type: 'varchar', nullable: true })
  email: string

  @Column({ type: 'uuid', nullable: true })
  bankAccountNumber: string
  //=============================== relations ==========================================================================

  // @OneToMany(() => PatientPlanEntity, (pp) => pp.patient)
  // patientPlans: PatientPlanEntity[]

}
