export default class Metadata {
  type = '';
  uuid = '';
  data: { [key: string]: any } = {};

  constructor(item?: any) {
    if (item) {
      this.type = item.type;
      this.uuid = item.uuid;
      this.data = item.data;
    }
  }
}
