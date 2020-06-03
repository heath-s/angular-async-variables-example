import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { BaseApiService } from 'src/app/api/base-api.service';
import User from './user';

interface DeleteItemResponse {
  deleted: boolean;
}

@Injectable()
export class AdminUsersService extends BaseApiService {

  deleteItem(username: string) {
    return this.delete<{ data: DeleteItemResponse }>({ url: `/users/${username}` });
  }

  getItem(username: string) {
    return this.get<{ data: User }>({ url: `/users/${username}` })
      .pipe((map(({ data }) => ({ data: new User(data) }))));
  }

  getList() {
    return this.get<{ data: User[] }>({ url: '/users' })
      .pipe(map(({ data }) => ({ data: data.map((user) => new User(user)) })));
  }

  postItem(item: User) {
    return this.post<{ data: User }>({ url: '/users' }, item)
      .pipe(map(({ data }) => ({ data: new User(data) })));
  }

  putItem(username: string, item: User) {
    return this.put<{ data: User }>({ url: `/users/${username}` }, item)
      .pipe(map(({ data }) => ({ data: new User(data) })));
  }

}
