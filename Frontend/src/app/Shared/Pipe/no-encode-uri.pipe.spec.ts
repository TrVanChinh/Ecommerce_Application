import { NoEncodeUriPipe } from './no-encode-uri.pipe';

describe('NoEncodeUriPipe', () => {
  it('create an instance', () => {
    const pipe = new NoEncodeUriPipe();
    expect(pipe).toBeTruthy();
  });
});
