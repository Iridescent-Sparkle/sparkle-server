import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ContactService {
  @InjectRepository(Contact)
  private contactRepository: Repository<Contact>;

  constructor() {}

  async findContactByUserId(params: { userId: number } & Pagination) {
    const { current = 1, pageSize = 10 } = params;

    const [data, total] = await this.contactRepository.findAndCount({
      where: {
        userId: params.userId,
      },
      relations: {
        profile: {
          education: true,
          experience: true,
          project: true,
          volunteer: true,
          user: true,
        },
      },
      skip: (current - 1) * pageSize,
      take: pageSize,
    });

    return {
      data: data.map((item) => {
        return {
          ...item,
          education: item.profile.education,
          experience: item.profile.experience,
          project: item.profile.project,
          volunteer: item.profile.volunteer,
          address: item.profile.address,
          summary: item.profile.summary,
          id: item.profile.id,
        };
      }),
      total,
      current,
      pageSize,
    };
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
