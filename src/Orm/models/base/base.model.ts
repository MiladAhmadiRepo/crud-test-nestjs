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
  deletedAt : Date | null

  @Column({
    type: 'timestamp',
    nullable: true
  })
  modifiedAt: Date | null

  @Column({ nullable: true })
  modifiedBy?: number

  @Column({
    type: 'timestamp',
    nullable: true
  })
  lockedAt : Date | null

  @Column({ nullable: true })
  lockedBy?: number
}
