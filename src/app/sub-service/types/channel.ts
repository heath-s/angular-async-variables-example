import { UUID } from './uuid';

export default class Channel {
  constructor(
    public uuid: UUID,
    public title: string
  ) { }
}
