export const statusMap = {
  Pending: 0,
  Destined: 1,
  'On Going': 2,
  Completed: 3,
};

export const tripDurationMap = {
  Pending: 0,
  Destined: 1,
  'On Going': 2,
  Completed: 3,
};
export const USER_ROLE = {
  ADMIN: 1,
  MANAGER: 2,
  SALESMAN: 3,
  CAPTAIN: 4
}
export const getMapKeysValue = (searchQuery, map) => {
  const lowerCaseSearchQuery = searchQuery.toLowerCase();
  const matchingKeys = Object.keys(map).filter((key) =>
    key.toLowerCase().includes(lowerCaseSearchQuery),
  );
  return matchingKeys.map((key) => map[key]);
};