import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Contact } from '../entities/contact.entity';
import { ContactService } from '../service/contact.service';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @MessagePattern('findContactByUserId')
  async findContactByUserId(userId: number) {
    return this.contactService.findContactByUserId(userId);
  }

  @MessagePattern('createContact')
  async createContact(contact: Contact) {
    return this.contactService.createContact(contact);
  }
}
