import { Test, TestingModule } from '@nestjs/testing';
import { ZahlungService } from './zahlung.service';

describe('ZahlungService', () => {
  let service: ZahlungService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZahlungService],
    }).compile();

    service = module.get<ZahlungService>(ZahlungService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
