import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Contact } from '../entities/contact.entity';
import { ContactService } from '../service/contact.service';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @MessagePattern('findContactByUserId')
  async findContactByUserId(params: { userId: number } & Pagination) {
    return this.contactService.findContactByUserId(params);
  }

  @MessagePattern('createContact')
  async createContact(contact: Contact) {
    return this.contactService.createContact(contact);
  }
}
