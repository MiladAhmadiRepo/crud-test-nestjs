import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  insertedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date

  @Column({
    nullable: true
  })
  modifiedAt: Date

  @Column({ nullable: true })
  modifiedBy?: number

  @Column({
    nullable: true
  })
  lockedAt: Date

  @Column({ nullable: true })
  lockedBy: number
}
