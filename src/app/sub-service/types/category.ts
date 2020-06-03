import { UUID } from './uuid';

export default class Category {
  constructor(
    public uuid: UUID,
    public title: string
  ) { }
}
