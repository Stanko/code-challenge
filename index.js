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

const html = ['<div class="current-week-label">Current week:</div>'];

Object.keys(weeks)
  .sort((a, b) => b.localeCompare(a))
  .forEach((week, i) => {
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

    const weekIndex = parseInt(week, 10);
    const isExpanded = i === 0;

    html.push(`
      <div class="week" id="week-${weekIndex}">
        <h2 class="week-title">
          <button 
            type="button"
            aria-expanded="${isExpanded.toString()}"
            aria-controls="submissions-${weekIndex}" 
          >
            ${week}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </h2>
        <ul class="submissions" id="submissions-${weekIndex}" style="${
      isExpanded ? '' : 'display: none'
    }">
          ${items.join('\n')}
        </ul>
      </div>`);
  });

const index = htmlTemplate.replace(
  '<!-- CONTENT GOES HERE -->',
  html.join('\n')
);

const BUILD_DIR = './build';

if (!fs.existsSync(BUILD_DIR)) {
  fs.mkdirSync(BUILD_DIR);
}

fs.writeFileSync(`${BUILD_DIR}/index.html`, index, { encoding: 'utf-8' });
fs.copyFileSync('index.css', `${BUILD_DIR}/index.css`);
