import ApolloClient from 'apollo-client';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import typeDefs from '../../imports/server/schema';
import mockedData from './mockedData';

const schema = makeExecutableSchema({ typeDefs });
addMockFunctionsToSchema({ schema, mockedData });

const mockNetworkInterface = mockNetworkInterfaceWithSchema({ schema });

const client = new ApolloClient({
  networkInterface: mockNetworkInterface,
});

export default client;
