import { Meteor } from 'meteor/meteor';
import { loadFront } from 'yaml-front-matter';
import { GitHubConnector } from './github';
import { Tours, Steps } from '../collections';

function getFile(connector, repoFullName, path, ref) {
  let url = `/repos/${repoFullName}/contents/${path}`;

  if (ref) {
    url += `?ref=${ref}`;
  }

  return connector.get(url).then(data => {
    return new Buffer(data.content, 'base64').toString();
  });
}

Meteor.publish({
  tours() {
    // just publish all tours
    return Tours.find();
  },
  steps(tourName) {
    return Steps.find({ tourName });
  },
});

function execOrThrow(re, str) {
  const result = re.exec(str);

  if (!result) {
    throw new Meteor.Error('format', `${str} didn't match required format: ${re}`);
  }

  return result;
}

Meteor.methods({
  async importTour(tourRepository) {
    if (tourRepository.indexOf('github.com') !== -1) {
      // This is a URL, parse out repo name
      const [url, username, repo] = execOrThrow(/github\.com\/([^/]+)\/([^/]+)/, tourRepository);

      tourRepository = `${username}/${repo}`;
    }

    const connector = new GitHubConnector();

    let content;
    try {
      content = await getFile(connector, tourRepository, '.codetour.json');
    } catch (e) {
      if (e.statusCode === 404) {
        throw new Meteor.Error(
          'not-found',
          'Could not find a .codetour.json file in the repository.'
        );
      } else {
        console.log(e);
        throw new Meteor.Error('error', 'Error fetching data from GitHub.');
      }
    }

    try {
      tour = JSON.parse(content);
    } catch (e) {
      throw new Meteor.Error('json', '.codetour.json file is not a valid JSON file.');
    }

    if (
      !Match.test(tour, {
        targetRepository: String,
        description: String,
        steps: [String],
      })
    ) {
      throw new Meteor.Error(
        'invalid-config',
        `Found an invalid configuration option in .codetour.json.`
      );
    }

    tour.repository = tourRepository;

    const existingTour = Tours.findOne({ repository: tourRepository });
    if (existingTour && existingTour.createdAt) {
      tour.createdAt = existingTour.createdAt;
    } else {
      tour.createdAt = new Date();
    }

    Tours.remove({ repository: tourRepository });
    Steps.remove({ tourName: tourRepository });

    Tours.insert(tour);

    await Promise.all(
      tour.steps.map(stepPath => {
        let step;

        return getFile(connector, tour.repository, stepPath)
          .then(content => {
            step = {
              ...parseMD(content),
              tourName: tour.repository,
              slug: stepPath,
            };

            return getFile(connector, step.fullRepoName, step.filePath, step.commit);
          })
          .then(content => {
            step = {
              ...step,
              code: content,
            };

            Steps.insert(step);
          })
          .catch(e => {
            // Remove tour if it failed to import
            Tours.update({ repository: tourRepository, failed: true });

            if (e.statusCode === 404) {
              throw new Meteor.Error(
                'not-found',
                `Could not find file with path ${stepPath} in repository. Check your .codetour.json file.`
              );
            } else if (e instanceof Meteor.Error) {
              throw e;
            } else {
              console.log(e);
              throw new Meteor.Error('error', 'Error fetching data from GitHub.');
            }
          });
      })
    );

    return tourRepository;
  },
});

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
  const re = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)(#L(\d+)(-L(\d+))?)?/;
  const [str, user, repoName, commit, filePath, unused, lineStart, unused2, lineEnd] = execOrThrow(
    re,
    url
  );

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

  lines.forEach(line => {
    if (line.indexOf(metadata.fileUrl) === -1) {
      currSegment.content += line + '\n';
      return;
    }

    // Close off current segment
    segments.push(currSegment);

    const re = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)(#L(\d+)(-L(\d+))?)?/;

    // This line contains a GitHub URL that points to the same file
    let [str, user, repoName, commit, filePath, unused, lineStart, unused2, lineEnd] = execOrThrow(
      re,
      line
    );

    if (!lineEnd) {
      lineEnd = lineStart;
    }

    const anchorId = /id="([^"]+)"/.exec(line);
    const slug = (anchorId && anchorId[1]) || `section-${segments.length + 1}`;
    const contentWithoutAnchorTag = execOrThrow(/<a[^>]+>(.+)<\/a>/, line)[1] + '\n';

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
