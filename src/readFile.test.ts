import readFile from './readFile';

describe('readFile', () => {
  test('reads a simple XML', () => {
    // arrange
    const expected: string = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE recipe>
<recipe name="хлеб" preptime="5min" cooktime="180min">
   <title>
      Простой хлеб
   </title>
   <composition>
      <ingredient amount="3" unit="стакан">Мука</ingredient>
      <ingredient amount="0.25" unit="грамм">Дрожжи</ingredient>
      <ingredient amount="1.5" unit="стакан">Тёплая вода</ingredient>
   </composition>
   <instructions>
     <step>
        Смешать все ингредиенты и тщательно замесить.
     </step>
     <step>
        Закрыть тканью и оставить на один час в тёплом помещении.
     </step>
     <!--
        <step>
           Почитать вчерашнюю газету.
        </step>
         - это сомнительный шаг...
      -->
     <step>
        Замесить ещё раз, положить на противень и поставить в духовку.
     </step>
   </instructions>
</recipe>`;
    // act
    const actual = readFile('./data/simple.xml');
    // assert
    expect(actual).toBe(expected);
  });
})
