import { BoardUser } from "./boardUsers.entity";
import { Catalog } from "./catalog.entity"; 
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'boards',
})
export class Board {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'varchar', nullable: false })
    background_color: string;

    @Column({ type: 'varchar', nullable: false })
    description: string;

    @OneToMany(() => Catalog, (catalog) => catalog.board)
    catalog: Catalog;

    @OneToMany(() => BoardUser, (boardUser) => boardUser.board)
    boardUser: BoardUser;
}