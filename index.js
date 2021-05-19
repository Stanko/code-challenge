const yaml = require('js-yaml');
const fs = require('fs');

let data;

try {
  data = yaml.load(fs.readFileSync('./data.yaml', 'utf8'));
} catch (e) {
  console.log(e);
  process.exit();
}

const htmlTemplate = fs.readFileSync('./template.html', 'utf8');

const weeks = {};

data.submissions.forEach((submission) => {
  if (!weeks[submission.week]) {
    weeks[submission.week] = [];
  }

  weeks[submission.week].push(submission);
});

const html = [];

Object.keys(weeks)
  .sort((a, b) => b.localeCompare(a))
  .forEach((week, weekIndex) => {
    const items = [];

    weeks[week]
      .sort((a, b) => a.author.localeCompare(b.author))
      .map((submission) => {
        /*
        {
          author: 'Vojin',
          week: '1. Scroll animation',
          link: 'https://codepen.io/voja1/full/NWdvMBQ',
          'link-to-source-code': null,
          notes: null
        }
        */
        const sourceCodeLink = submission['link-to-source-code']
          ? `<span class="separator" aria-hidden>&bull;</span>
          <a href="${submission['link-to-source-code']}">Source code</a>`
          : '';
        const notes = submission.notes
          ? `<p class="notes">${submission.notes}</p>`
          : '';

        const winner = submission.winner
          ? ` <span class="winner" title="Winning submission!" aria-label="Winning submission!">🍫</pan>`
          : '';

        const star = submission.star
          ? ` <span class="star" title="Submission with the most reactions on Slack!" aria-label="Submission with the most reactions on Slack!">⭐</pan>`
          : '';

        items.push(`
          <li class="submission">
            <h3 class="author">${submission.author}${winner}${star}</h3>
            <div class="links">
              <a href="${submission.link}">Demo</a>
              ${sourceCodeLink}
            </div>
            ${notes}
          </li>`);
      });

    html.push(`
      <div class="week">
        <h2 class="week-title" id="week-${weekIndex + 1}">${week}</h2>
        <ul class="submissions">
          ${items.join('\n')}
        </ul>
      </div>`);
  });

const index = htmlTemplate.replace(
  '<!-- CONTENT GOES HERE -->',
  html.join('\n')
);

fs.writeFileSync('./docs/index.html', index, { encoding: 'utf-8' });
