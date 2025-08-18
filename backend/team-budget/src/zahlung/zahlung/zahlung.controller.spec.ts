import { Test, TestingModule } from '@nestjs/testing';
import { ZahlungController } from './zahlung.controller';
import { ZahlungService } from './zahlung.service';

describe('ZahlungController', () => {
  let controller: ZahlungController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZahlungController],
      providers: [ZahlungService],
    }).compile();

    controller = module.get<ZahlungController>(ZahlungController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
