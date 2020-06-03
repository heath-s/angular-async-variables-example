export default class Session {
  username: string;
  nickname: string;
  roles: string[];

  constructor(user?: any) {
    if (user) {
      this.username = user.username;
      this.nickname = user.nickname;
      this.roles = user.roles;
    }
  }

  hasRole(role: string): boolean {
    if (this.roles) {
      return this.roles.includes(role);
    }
  }

  get isAdmin(): boolean {
    return this.hasRole('admin');
  }

  get isSignedIn(): boolean {
    return !!this.username;
  }

  get isUser(): boolean {
    return this.hasRole('user');
  }
}
