import { Meteor } from 'meteor/meteor';
import { loadFront } from 'yaml-front-matter';
import { GitHubConnector } from './github';
import { Tours, Steps } from '../collections';

function getFile(connector, repoFullName, path, ref) {
  let url = `/repos/${repoFullName}/contents/${path}`;

  if (ref) {
    url += `?ref=${ref}`;
  }

  return connector.get(url).then((data) => {
    return new Buffer(data.content, 'base64').toString();
  });
}

Meteor.methods({
  async importTour(tourRepository) {
    Tours.remove({ repository: tourRepository });
    Steps.remove({ tourName: tourRepository });

    const connector = new GitHubConnector();

    const content = await getFile(connector, tourRepository, '.codetour.json');

    tour = JSON.parse(content);
    tour.repository = tourRepository;

    Tours.insert(tour);

    tour.steps.forEach((stepPath) => {
      let step;

      getFile(connector, tour.repository, stepPath).then((content) => {
        step = {
          ...parseMD(content),
          tourName: tour.repository,
          slug: stepPath,
        };

        return getFile(connector, step.fullRepoName, step.filePath, step.commit);
      }).then((content) => {

        step = {
          ...step,
          code: content,
        };

        Steps.insert(step);
      }).catch((e) => {
        console.log(step);
        console.error(e, e.stack);
      });
    });
  }
})

function parseMD(md) {
  const {
    title,
    code,
    __content: content,
  } = loadFront(md);

  const metadata = parseGitHubURL(code);

  const contentBlocks = parseContentBlocks(content, metadata);

  return {
    title,
    codeUrl: code,
    content: contentBlocks,
    ...metadata,
  };
}

function parseGitHubURL(url) {
  // XXX this regex fails when there is only one line selected
  const re = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)(#L(\d+)-L(\d+))?$/;
  const [
    str,
    user,
    repoName,
    commit,
    filePath,
    unused,
    lineStart,
    lineEnd,
  ] = re.exec(url);

  const fileUrl = url.split('#')[0];

  return {
    user,
    repoName,
    fullRepoName: user + '/' + repoName,
    commit,
    filePath,
    lineStart,
    lineEnd,
    fileUrl,
  };
}

function parseContentBlocks(content, metadata) {
  const lines = content.split('\n');

  const segments = [];

  let currSegment = {
    slug: null,
    lineStart: parseInt(metadata.lineStart, 10),
    lineEnd: parseInt(metadata.lineEnd, 10),
    content: '',
  };

  lines.forEach((line) => {
    if (line.indexOf(metadata.fileUrl) === -1) {
      currSegment.content += line + '\n';
      return;
    }

    // Close off current segment
    segments.push(currSegment);

    const re = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)#L(\d+)(-L(\d+))?/;

    // This line contains a GitHub URL that points to the same file
    let [
      url,
      user,
      repoName,
      hash,
      path,
      lineStart,
      unused,
      lineEnd,
    ] = re.exec(line);

    if (!lineEnd) {
      lineEnd = lineStart;
    }

    const slug = /id="([^"]+)"/.exec(line)[1];
    const contentWithoutAnchorTag = /<a[^>]+>(.+)<\/a>/.exec(line)[1];

    currSegment = {
      slug,
      lineStart: parseInt(lineStart, 10) || undefined,
      lineEnd: parseInt(lineEnd, 10) || undefined,
      content: contentWithoutAnchorTag,
    };
  });

  segments.push(currSegment);

  return segments;
}
