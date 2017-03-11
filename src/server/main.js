import { Meteor } from 'meteor/meteor';
import './head';
import { GitHubConnector } from './github';
import { Tours, Steps } from '../collections';
import { parseMD } from './parse';
import execOrThrow from './execOrThrow';

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
            Tours.update(tour._id, { repository: tourRepository, failed: true });

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
