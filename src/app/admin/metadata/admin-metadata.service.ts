import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseApiService } from 'src/app/api/base-api.service';
import Metadata from './metadata';

interface DeleteItemResponse {
  deleted: boolean;
}

@Injectable()
export class AdminMetadataService extends BaseApiService {

  deleteItem(type: string, uuid: string) {
    return this.delete<{ data: DeleteItemResponse }>({ url: `/metadata/${type}/${uuid}` });
  }

  getItem(type: string, uuid: string) {
    return this.get<{ data: Metadata }>({ url: `/metadata/${type}/${uuid}` })
      .pipe((map(({ data }) => ({ data: new Metadata(data) }))));
  }

  getList(type: string) {
    return this.get<{ data: Metadata[] }>({ url: `/metadata/${type}` })
      .pipe(map(({ data }) => ({ data: data.map((user) => new Metadata(user)) })));
  }

  postItem(item: Metadata) {
    return this.post<{ data: Metadata }>({ url: '/metadata' }, item)
      .pipe(map(({ data }) => ({ data: new Metadata(data) })));
  }

  putItem(type: string, uuid: string, item: Metadata) {
    return this.put<{ data: Metadata }>({ url: `/metadata/${type}/${uuid}` }, item)
      .pipe(map(({ data }) => ({ data: new Metadata(data) })));
  }

}
