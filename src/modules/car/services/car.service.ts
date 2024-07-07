import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRoleEnum } from '../../../common/enums/user-role.enum';
import { CarEntity } from '../../../database/entities/car.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { ContentType } from '../../file-storage/models/enums/content-type.enum';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { LoggerService } from '../../logger/logger.service';
import { CarRepository } from '../../repository/services/car.repository';
import { SoldCarRepository } from '../../repository/services/sold-car.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { ViewRepository } from '../../repository/services/view.repository';
import { TypeUserAccountEnum } from '../../user/enums/type-user-account.enum';
import { CarListReqDto } from '../dto/req/car-list.req.dto';
import { CreateCarReqDto } from '../dto/req/create-car.req.dto';
import { CarResDto } from '../dto/res/car.res.dto';
import { CarListResDto } from '../dto/res/car-list.res.dto';
import { StatisticCarResDto } from '../dto/res/statistic-car.res.dto';
import { TypeCurrency } from '../enums/TypeCurrency';
import { IResPrivateBunk } from '../interfaces/res-private_bunk.interface';
import { listBadWords } from '../lib/array_badwords';
import { CarMapper } from './car.mapper';

@Injectable()
export class CarService {
  constructor(
    private readonly logger: LoggerService,
    private readonly carRepository: CarRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
    private readonly soldCarRepository: SoldCarRepository,
    private readonly viewRepository: ViewRepository,
  ) {}

  public async getList(query: CarListReqDto): Promise<CarListResDto> {
    const [entities, total] = await this.carRepository.getList(query);
    return CarMapper.toListResponseDTO(entities, total, query);
  }

  public async getNoActiveList(
    userData: IUserData,
    query: CarListReqDto,
  ): Promise<CarListResDto> {
    if (
      userData.role !== UserRoleEnum.ADMIN &&
      userData.role !== UserRoleEnum.MANAGER
    ) {
      throw new ForbiddenException();
    }
    const [entities, total] = await this.carRepository.getNoActiveList(query);
    return CarMapper.toListResponseDTO(entities, total, query);
  }

  public async create(
    userData: IUserData,
    dto: CreateCarReqDto,
  ): Promise<CarResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });

    if (!user) {
      throw new NotFoundException();
    }

    const cars = await this.carRepository.findBy({ user_id: userData.userId });

    if (user.account === TypeUserAccountEnum.BASE && cars.length >= 1) {
      throw new ForbiddenException();
    }

    let price: number;
    let rate: string;
    if (dto.user_ccy !== TypeCurrency.UAH) {
      const { data } = await this.httpService.axiosRef.get<IResPrivateBunk[]>(
        'https://api.privatbank.ua/p24api/pubinfo',
      );
      const [findCurrency] = await Promise.all([
        data.find((value) => value.ccy === dto.user_ccy),
      ]);

      if (!findCurrency) {
        throw new NotFoundException();
      }

      price = +dto.user_price * findCurrency.sale;
      rate = findCurrency.sale.toString();
    }

    if (dto.user_ccy === TypeCurrency.UAH) {
      price = +dto.user_price;
    }
    let car;

    if (
      listBadWords.includes(dto.brand.toLowerCase()) ||
      listBadWords.includes(dto.model.toLowerCase())
    ) {
      car = await this.carRepository.save(
        this.carRepository.create({
          ...dto,
          price: price.toString(),
          rate,
          user_id: userData.userId,
        }),
      );
    } else {
      car = await this.carRepository.save(
        this.carRepository.create({
          ...dto,
          price: price.toString(),
          rate,
          isActive: true,
          user_id: userData.userId,
        }),
      );
    }
    return CarMapper.toResponseDTO(car);
  }

  public async getById(carId: string): Promise<CarResDto> {
    const car = await this.carRepository.findCarById(carId);
    if (!car) {
      throw new NotFoundException('Car not found');
    }
    await this.viewRepository.save(
      this.viewRepository.create({
        car_id: car.id,
      }),
    );

    return CarMapper.toResponseDTO(car);
  }

  public async deleteById(userData: IUserData, carId: string): Promise<void> {
    const car = await this.findCarByIdOrThrow(userData.userId, carId);
    await this.carRepository.remove(car);
  }

  public async uploadImage(
    userData: IUserData,
    car_image: Express.Multer.File,
    carId: string,
  ): Promise<void> {
    const car = await this.findCarByIdOrThrow(userData.userId, carId);

    const image = await this.fileStorageService.uploadFile(
      car_image,
      ContentType.CAR_IMAGE,
      car.id,
    );

    await this.carRepository.update(car.id, { image });
  }

  public async deleteImage(userData: IUserData, carId: string): Promise<void> {
    const car = await this.findCarByIdOrThrow(userData.userId, carId);

    if (car.image) {
      await this.fileStorageService.deleteFile(car.image);
      await this.carRepository.save(
        this.carRepository.merge(car, { image: null }),
      );
    }
  }

  public async sellById(userData: IUserData, carId: string): Promise<void> {
    const car = await this.findCarByIdOrThrow(userData.userId, carId);

    await Promise.all([
      await this.soldCarRepository.save(
        this.soldCarRepository.create({
          brand: car.brand,
          model: car.model,
          price: car.price,
          region: car.region,
          user_id: userData.userId,
        }),
      ),
      await this.carRepository.remove(car),
    ]);
  }

  private async findCarByIdOrThrow(
    userId: string,
    carId: string,
  ): Promise<CarEntity> {
    const car = await this.carRepository.findOneBy({ id: carId });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (car.user_id !== userId) {
      throw new ForbiddenException();
    }
    return car;
  }

  public async getStatistic(
    userData: IUserData,
    carId: string,
  ): Promise<StatisticCarResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });

    if (!user) {
      throw new NotFoundException();
    }

    if (user.account !== TypeUserAccountEnum.PREMIUM) {
      throw new ForbiddenException();
    }

    const car = await this.carRepository.findCarById(carId);

    if (!car) {
      throw new NotFoundException('Car not found');
    }
    const views = await this.viewRepository.getViews(car.id);
    const viewsForWeek = await this.viewRepository.getViewsByWeek(car.id);
    const viewsForMonth = await this.viewRepository.getViewsByMonth(car.id);
    const viewsForYear = await this.viewRepository.getViewsByYear(car.id);
    return CarMapper.toResponseStatistic(
      views.length,
      viewsForWeek.length,
      viewsForMonth.length,
      viewsForYear.length,
    );
  }
}
