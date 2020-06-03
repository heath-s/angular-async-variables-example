import { format } from 'date-fns';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseApiService } from 'src/app/api/base-api.service';
import Category from './types/category';
import Channel from './types/channel';
import { DashboardData } from './types/dashboard-data';
import Product from './types/product';

@Injectable()
export class SubServiceService extends BaseApiService {

  getCategories() {
    return this.get<{ data: any[] }>({ url: `/sub-service/categories` })
      .pipe(
        map(({ data }) => data.map((category) =>
          new Category(category.uuid, category.title)
        ))
      );
  }

  getChannels() {
    return this.get<{ data: any[] }>({ url: '/sub-service/channels' })
      .pipe(
        map(({ data }) => data.map((channel) =>
          new Channel(channel.uuid, channel.title)
        ))
      );
  }

  getDashboardDataByProduct(product: Product, from: Date, to: Date) {
    const query = {
      channelUUID: product.channel.uuid,
      productUUID: product.uuid,
      from: format(from, 'yyyyMMdd'),
      to: format(to, 'yyyyMMdd')
    };
    return this.get<{ data: DashboardData }>({ url: '/sub-service/dashboard', query });
  }

  getProductsByCategory(channel: Channel, category: Category) {
    return this.get<{ data: any[] }>({ url: `/sub-service/categories/${category.uuid}/products` })
      .pipe(
        map(({ data }) => data.map((product) =>
          new Product(product.uuid, product.title, product.metadata, channel, category)
        ))
      );
  }

}
