import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum'; // 🏗️ Import correct

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, default: Role.USER }) // 🎭 Utilisation de l'enum
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()  
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}