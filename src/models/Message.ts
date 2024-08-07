import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./Chat";
import { User } from "./User";

@Entity("messages")
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column('text', { nullable: true })
  content: string

  @Column('text', { nullable: true })
  chatId: string;

  @Column('text', { nullable: true })
  senderId: string;
  
  @Column('text', { nullable: true })
  receiverId: string;

  @Column({ type: "boolean", default: false })
  seen: boolean;

  @ManyToOne(() => User)
  sender: User

  @ManyToOne(() => User)
  receiver: User

  @ManyToOne(() => Chat)
  chat: Chat

  @CreateDateColumn("")
  createdAt: string
}

export class MessagePayload {
  id: string
  
  chatId: string

  content: string

  senderId: string;
  
  senderName: string;
  
  senderProfilePicture: string;
  
  receiverId: string;

  createdAt: string
}