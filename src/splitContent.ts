const splitHtml = require('split-html');

const splitContent = (content: string) => {
  const fragments = [];

  const fragmentsByImg = splitHtml(content, 'img');

  fragmentsByImg.forEach(fragment => {
    fragments.push(...splitHtml(fragment, 'iframe'));
  });

  return fragments;
};

export default splitContent;
