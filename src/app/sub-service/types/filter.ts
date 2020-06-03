import Condition from './condition';

export default class Filter {
  constructor(
    public from: Date,
    public to: Date,
    public conditions: Condition[]
  ) { }
}
