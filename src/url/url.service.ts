import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { Repository } from 'typeorm';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Url } from './url.entity';
  import { ShortenURLDto } from './dto/url.dto';
  import { nanoid } from 'nanoid';
  import { isURL } from 'class-validator';
  
  @Injectable()
  export class UrlService {
    constructor(
      @InjectRepository(Url)
      private repo: Repository<Url>,
    ) {}
  
    async shortenUrl(url: ShortenURLDto) {
      const { sentUrl } = url;
  
      if (!isURL(sentUrl)) {
        throw new BadRequestException('String Must be a Valid URL');
      }
  
      const urlCode = nanoid(10);
      const baseURL = 'http://localhost:3000';
  
      try {
        let url = await this.repo.findOneBy({ sentUrl });
        if (url) return url.shortUrl;
  
        const shortUrl = `${baseURL}/${urlCode}`;
  
        url = this.repo.create({
          urlCode,
          sentUrl,
          shortUrl,
        });
  
        this.repo.save(url);
        return url.shortUrl;
      } catch (error) {
        console.log(error);
        throw new UnprocessableEntityException('Server Error');
      }
    }
  
    async redirect(urlCode: string) {
      try {
        const url = await this.repo.findOneBy({ urlCode });
        if (url) return url;
      } catch (error) {
        console.log(error);
        throw new NotFoundException('Resource Not Found');
      }
    }
  }