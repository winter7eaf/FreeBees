export class Registration {
  constructor(
    public login: string,
    public firstName: string | null,
    public lastName: string | null,
    public email: string,
    public password: string,
    public langKey: string,
    public charityCheck: boolean,
    public charityName: string | null,
    public description: string | null,
    public logoURL: string | null,
    public website: string | null
  ) {}
}
