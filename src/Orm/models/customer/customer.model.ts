import { ApiProperty } from '@nestjs/swagger'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from '../base/base.model'



@Entity({
  name:  'customer'
})
export class CustomerEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName: string

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName: string

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  dateOfBirth: Date

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  email: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  bankAccountNumber: string
  //=============================== relations ==========================================================================

  // @OneToMany(() => PatientPlanEntity, (pp) => pp.patient)
  // patientPlans: PatientPlanEntity[]

}
