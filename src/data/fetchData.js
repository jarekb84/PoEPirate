import sampleData from "./sampleData/sampleData";

const proxy = (url) => {
  return `https://cors-anywhere.herokuapp.com/${url}`;
};

export const getData = async (type) => {
  const response = await fetch(
    proxy(`https://poe.ninja/api/data/itemoverview?league=Harvest&type=${type}&language=en`)
  );

  const data = await response.json();

  return data.lines;
};

export const getDataMock = async (type) => {
  return Promise.resolve(sampleData[type].lines || []);
};
