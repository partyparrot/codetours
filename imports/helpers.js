export const getTourLink = ({ repository }) => `/tour/${repository}`;

export const getTourUsernames = ({ repository, targetRepository }) => ({
  authorUsername: repository.split('/')[0],
  targetUsername: targetRepository.split('/')[0],
});
