import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm'

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
}
