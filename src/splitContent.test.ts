import readFile from './readFile';
import splitContent from './splitContent';

describe('splitContent', () => {
  test('splits on text, images, and video', () => {
    // arrange
    const content = readFile('./data/post.html');
    // act
    const result = splitContent(content);
    // assert
    expect(result.length).toBe(15);
    expect(result[0]).toBe('<p></p>');
    expect(result[1].startsWith('<img')).toBe(true);
    expect(result[3].startsWith('<img')).toBe(true);
    expect(result[5].startsWith('<img')).toBe(true);
    expect(result[7].startsWith('<iframe')).toBe(true);
    expect(result[9].startsWith('<img')).toBe(true);
    expect(result[11].startsWith('<img')).toBe(true);
    expect(result[13].startsWith('<img')).toBe(true);
  });
});