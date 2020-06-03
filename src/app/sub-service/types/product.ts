import Category from './category';
import Channel from './channel';
import { UUID } from './uuid';

export default class Product {
  constructor(
    public uuid: UUID,
    public title: string,
    public metadata?: any,
    public channel?: Channel,
    public category?: Category
  ) { }
}
