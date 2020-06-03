import Channel from './channel';
import Product from './product';

export default class Condition {
  constructor(
    public channel: Channel,
    public product: Product
  ) { }
}
