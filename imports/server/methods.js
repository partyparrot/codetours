import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';
import { GitHubConnector } from './github';
import { Tours, Steps } from '../collections';
import { parseMD } from './parse';
import execRegexOrThrow from './execRegexOrThrow';

function getFile(connector, repoFullName, path, ref) {
  let url = `/repos/${repoFullName}/contents/${path}`;

  if (ref) {
    url += `?ref=${ref}`;
  }

  return connector.get(url).then(data => {
    return new Buffer(data.content, 'base64').toString();
  });
}

// TODO collections used here should come from the context (connectors)

const importTour = async tourRepository => {
  if (tourRepository.indexOf('github.com') !== -1) {
    // This is a URL, parse out repo name
    const [_url, username, repo] = execRegexOrThrow(
      /github\.com\/([^/]+)\/([^/]+)/,
      tourRepository
    );

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
      console.log(e); // eslint-disable-line no-console
      throw new Meteor.Error('error', 'Error fetching data from GitHub.');
    }
  }

  let tour;
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
          Tours.update(tour._id, { repository: tourRepository, failed: true });

          if (e.statusCode === 404) {
            throw new Meteor.Error(
              'not-found',
              `Could not find file with path ${stepPath} in repository. Check your .codetour.json file.`
            );
          } else if (e instanceof Meteor.Error) {
            throw e;
          } else {
            console.log(e); // eslint-disable-line no-console
            throw new Meteor.Error('error', 'Error fetching data from GitHub.');
          }
        });
    })
  );

  return tourRepository;
};

export default importTour;
