const typeDefs = [
  `
  scalar Date
  
  type Query {
    # implement cursor style pagination?
    tours(search: String, limit: Float): [Tour]
    tour(tourRepository: String!): Tour
    steps(tourRepository: String!): [Step]
    step(tourRepository: String!, slug: String!): Step
  }
  
  type Mutation {
    importTour(tourRepository: String!): Tour
  }
  
  type Tour {
    _id: String!
    targetRepository: String!
    description: String!
    # slugs in Mongo, list of markdown filenames
    steps: [Step!]
    repository: String!
    createdAt: Date!
    failed: Boolean
  }
  
  type Step {
    _id: String!
    title: String!
    slug: String!
    codeUrl: String!
    # aka content
    sections: [Section!]
    user: String!
    # = tour repository, aka repoName
    tour: Tour!
    fullRepoName: String!
    filePath: String!
    fileUrl: String!
    code: String!
    # do we care about this one?
    commit: String
  }
  
  type Section {
    slug: String
    lineStart: Float!
    lineEnd: Float!
    content: String!
  }
`,
];

export default typeDefs;
