// note: this is a little too much. though fun! bouidj mou!

import { makeExecutableSchema } from 'graphql-tools';
import GraphQLDate from 'graphql-date';
import rp from 'request-promise';
import { loadFront } from 'yaml-front-matter';

const typeDefs = `
	scalar Date

  type Query {
    tour(tourRepository: String!): Tour
  }
  
  type Tour {
    targetRepository: String!
    description: String!
    steps: [Step!]
    repository: String!
    createdAt: Date!
    failed: Boolean
  }
  
  type Step {
    title: String!
    slug: String!
    codeUrl: String!
    index: Int!
    sections: [Section!]
    user: String!
    tour: Tour!
    fullRepoName: String!
    filePath: String!
    fileUrl: String!
    code: String!
    commit: String
    previous: Step
    next: Step
  }
  
  type Section {
    slug: String
    lineStart: Int
    lineEnd: Int 
    content: String!
  }
`;

const resolvers = {
  /*
   * Custom scalar
   */
  Date: GraphQLDate,

  /*
   * Root queries
   */
  Query: {
    async tour(root, { tourRepository }, context) {
      return await importTour(tourRepository, context);
    },
  }
};

async function importTour(tourRepository, context) {
  const connector = context.github;

  let content;
  try {
    content = await getFile(connector, tourRepository, '.codetour.json');
  } catch (e) {
    if (e.statusCode === 404) {
      throw new Error(
        'not-found',
        'Could not find a .codetour.json file in the repository.'
      );
    } else {
      console.log(e); // eslint-disable-line no-console
      throw new Error('error', 'Error fetching data from GitHub.');
    }
  }

  let tour;
  try {
    tour = JSON.parse(content);
  } catch (e) {
    throw new Error('json', '.codetour.json file is not a valid JSON file.');
  }

  /*
  if (
    !Match.test(tour, {
      targetRepository: String,
      description: String,
      steps: [String],
    })
  ) {
    throw new Error(
      'invalid-config',
      `Found an invalid configuration option in .codetour.json.`
    );
  }
	*/
  
  tour.repository = tourRepository;
  tour.createdAt = new Date();

  // update, or insert if needed, the tour
  // context.Tours.upsert({ repository: tourRepository }, tour);

  tour.steps = await Promise.all(
    tour.steps.map((stepPath, stepIndex) => {
      let step;

      return getFile(connector, tour.repository, stepPath)
        .then(content => {
          step = {
            ...parseMD(content),
            repository: tour.repository,
            slug: stepPath,
            index: stepIndex,
          };

          return getFile(connector, step.fullRepoName, step.filePath, step.commit);
        })
        .then(content => {
          return step = {
            ...step,
            code: content,
          };
        })
        .catch(e => {
          // Remove tour if it failed to import

          if (e.statusCode === 404) {
            throw new Error(
              'not-found',
              `Could not find file with path ${stepPath} in repository. Check your .codetour.json file.`
            );
          } else {
            console.log(e); // eslint-disable-line no-console
            throw new Error('error', 'Error fetching data from GitHub.');
          }
        });
    })
  );
  
  return tour;
};


function getFile(connector, repoFullName, path, ref) {
  let url = `/repos/${repoFullName}/contents/${path}`;

  if (ref) {
    url += `?ref=${ref}`;
  }

  return connector.get(url).then(data => {
    return new Buffer(data.content, 'base64').toString();
  });
}

function execRegexOrThrow(re, str) {
  const result = re.exec(str);
	
  if (!result) {
    throw new Error('format', `${str} didn't match required format: ${re}`);
  }
  
  return result;
}

function parseMD(md) {
  const {
    title,
    code,
    __content: step,
  } = loadFront(md);

  const metadata = parseGitHubURL(code);

  const sectionBlocks = parseSectionBlocks(step, metadata);
	
  // these lines have already been used to create the introduction step,
  // remove them from the step root
  const { lineStart, lineEnd, ...cleanMetadata } = metadata;

  return {
    title,
    codeUrl: code,
    sections: sectionBlocks,
    ...cleanMetadata,
  };
}

function parseGitHubURL(url) {
  // XXX this regex fails when there is only one line selected
  const re = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)(#L(\d+)(-L(\d+))?)?/;
  const [
    _str,
    user,
    repoName,
    commit,
    filePath,
    _unused,
    lineStart,
    _unused2,
    lineEnd,
  ] = execRegexOrThrow(re, url);

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

const parseSectionBlocks = (step, metadata) => step
		// split the step on line breaks
		.split('\n')
		// remove empty lines
		.filter(line => line)
		// create section blocks
		.reduce((sections, currentLine) => {
	    // return true if the current line 
			const isSectionBeginning = currentLine.includes(metadata.fileUrl);
			
			// create a new section with the current line (beginning of the section)!
			if (isSectionBeginning || !sections.length) {
				return [
					...sections,
					[ currentLine ],
				];
			}
			
			// separate previous sections from the current section
			const lastSectionIndex = sections.length - 1;
			const previousSections = sections.slice(0, lastSectionIndex);
			const currentSection = sections[lastSectionIndex];
			
			return [
				...previousSections,
				[
					...currentSection,
					currentLine
				]
			];
			
			// return [...sections, currentLine];
		}, [])
	// transform the list of sections arrays in a list of objects with data about the section
	.map(section => {
		const [ sectionHead, ...rawContent ] = section;
		
		const re = /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/([^#]+)(#L(\d+)(-L(\d+))?)?/;

    // This line contains a GitHub URL that points to the same file
    let [
      _str,
      _user,
      _repoName,
      _commit,
      _filePath,
      _unused,
      lineStart,
      _unused2,
      lineEnd,
    ] = execRegexOrThrow(re, sectionHead);

    if (!lineEnd) {
      lineEnd = lineStart;
    }
    const sectionTitle = execRegexOrThrow(/<a[^>]+><h4>(.+)<\/h4><\/a>/, sectionHead)[1];
		
		return {
			slug: sectionTitle,
			lineStart: parseInt(lineStart, 10) || null,
			lineEnd: parseInt(lineEnd, 10) || null,
			content: rawContent.join('\n')
		}
	});

// Keys are GitHub API URLs, values are { etag, result } objects
const eTagCache = {};

const GITHUB_API_ROOT = 'https://api.github.com';

class GitHubConnector {
  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    // Allow mocking request promise for tests
    this.rp = rp;
    if (GitHubConnector.mockRequestPromise) {
      this.rp = GitHubConnector.mockRequestPromise;
    }
  }

  get(path) {
    const url = GITHUB_API_ROOT + path;

    const options = {
      json: true,
      resolveWithFullResponse: true,
      headers: {
        'user-agent': 'CodeTours',
      },
    };

    if (this.clientId) {
      options.qs = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
      };
    }

    const cachedRes = eTagCache[url];

    if (cachedRes && cachedRes.eTag) {
      options.headers['If-None-Match'] = cachedRes.eTag;
    }
    return new Promise((resolve, reject) => {
      this.rp({
        uri: url,
        ...options,
      })
        .then(response => {
          const body = response.body;
          eTagCache[url] = {
            result: body,
            eTag: response.headers.etag,
          };
          resolve(body);
        })
        .catch(err => {
          if (err.statusCode === 304) {
            resolve(cachedRes.result);
          } else {
            reject(err);
          }
        });
    });
  }
}

export function context(headers, secrets) {
  return {
    secrets,
    github: new GitHubConnector(secrets.GITHUB_CLIENT_ID, secrets.GITHUB_CLIENT_SECRET),
  };
};

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Optional: Export a root value to be passed during execution
// export const rootValue = {};

// Optional: Export a root function, that returns root to be passed
// during execution, accepting headers and secrets. It can return a
// promise. rootFunction takes precedence over rootValue.
// export function rootFunction(headers, secrets) {
//   return {
//     headers,
//     secrets,
//   };
// };
