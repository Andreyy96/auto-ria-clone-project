import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { IResPrivateBunk } from '../car/interfaces/res-private_bunk.interface';
import { LoggerService } from '../logger/logger.service';
import { CarRepository } from '../repository/services/car.repository';

@Injectable()
export class CronService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly httpService: HttpService,
    private readonly carRepository: CarRepository,
  ) {}
  @Cron('* * 4 * * *')
  async handleCron() {
    this.loggerService.log('update rate and price cars');
    const { data } = await this.httpService.axiosRef.get<IResPrivateBunk[]>(
      'https://api.privatbank.ua/p24api/pubinfo',
    );

    let price: number;
    let rate: string;

    const cars = await this.carRepository.findBy({ isActive: true });

    for (const car of cars) {
      const bankRate = data.find((element) => element.ccy === car.user_ccy);

      price = +car.user_price * bankRate.sale;
      rate = bankRate.sale.toString();

      await this.carRepository.save({
        ...car,
        price: price.toString(),
        rate,
      });
    }
  }
}
