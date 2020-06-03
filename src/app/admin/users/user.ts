export default class User {
  username = '';
  nickname = '';
  roles: string[] = [];

  constructor(user?: any) {
    if (user) {
      this.username = user.username;
      this.nickname = user.nickname;
      this.roles = user.roles;
    }
  }
}
