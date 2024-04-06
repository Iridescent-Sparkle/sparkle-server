import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactService {
  @InjectRepository(Contact)
  private contactRepository: Repository<Contact>;

  constructor() {}

  async findContactByUserId(userId: number) {
    const res = await this.contactRepository.find({
      where: {
        userId: userId,
      },
      relations: {
        profile: {
          eduction: true,
          experience: true,
          project: true,
          volunteer: true,
        },
      },
    });

    return res.map((item) => {
      return {
        ...item,
        eduction: item.profile.eduction,
        experience: item.profile.experience,
        project: item.profile.project,
        volunteer: item.profile.volunteer,
        address: item.profile.address,
        summary: item.profile.summary,
        id: item.profile.id,
      };
    });
  }

  async createContact(contact: Contact) {
    const foundContact = await this.contactRepository.findOne({
      where: {
        profileId: contact.profileId,
      },
    });
    if (foundContact) {
      return await this.contactRepository.update(
        {
          profileId: contact.profileId,
        },
        contact,
      );
    }
    const newContact = new Contact();
    newContact.userId = contact.userId;
    newContact.profileId = contact.profileId;
    return await this.contactRepository.save(contact);
  }
}
