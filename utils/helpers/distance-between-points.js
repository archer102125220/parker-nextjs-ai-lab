export function getDistanceBetweenPoints(
  latitude1,
  longitude1,
  latitude2,
  longitude2,
  unit = 'km'
) {
  // https://zh-tw.martech.zone/calculate-great-circle-distance/
  const theta = longitude1 - longitude2;
  const distance =
    60 *
    1.1515 *
    (180 / Math.PI) *
    Math.acos(
      Math.sin(latitude1 * (Math.PI / 180)) *
        Math.sin(latitude2 * (Math.PI / 180)) +
        Math.cos(latitude1 * (Math.PI / 180)) *
          Math.cos(latitude2 * (Math.PI / 180)) *
          Math.cos(theta * (Math.PI / 180))
    );
  if (unit === 'miles') {
    return distance;
    // return Math.round(distance, 2);
  } else if (unit === 'km') {
    return distance * 1.609344;
    // return Math.round(distance * 1.609344, 2);
  }
  return distance;
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

export function distanceCalculation(distance, speed = 40) {
  if (typeof distance !== 'number') return null;
  return distance / speed;
}

export function handleDistanceCalculation(
  latitude1,
  longitude1,
  latitude2,
  longitude2,
  speed = 50
) {
  const distance = getDistanceBetweenPoints(
    latitude1,
    longitude1,
    latitude2,
    longitude2
  );
  return distance / speed;
}

export async function handleCurrentCalculation(
  latitude2,
  longitude2,
  speed = 50
) {
  const position = await getCurrentPosition();
  const distance = getDistanceBetweenPoints(
    position.coords.latitude,
    position.coords.longitude,
    latitude2,
    longitude2
  );
  return distance / speed;
}