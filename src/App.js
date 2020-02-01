import React, { useState, useEffect } from "react";
import "./App.css";
import { getDataMock as getData } from "./data/fetchData";
import { generateTradeItems } from "./tradeItems";
import TradeTable from "./tradeTable";

function App() {
  const [divCards, setDivCards] = useState([]);
  const [skillGems, setSkillGems] = useState([]);
  const [uniqueAccessories, setUniqueAccessories] = useState([]);
  const [uniqueArmours, setUniqueArmours] = useState([]);
  const [uniqueFlasks, setUniqueFlasks] = useState([]);
  const [uniqueWeapons, setUniqueWeapons] = useState([]);

  useEffect(() => {
    getData("DivinationCard").then(setDivCards);
    getData("SkillGem").then(setSkillGems);
    getData("UniqueAccessory").then(setUniqueAccessories);
    getData("UniqueArmour").then(setUniqueArmours);
    getData("UniqueFlask").then(setUniqueFlasks);
    getData("UniqueWeapon").then(setUniqueWeapons);
  }, []);

  const allItems = [
    ...divCards,
    ...skillGems,
    ...uniqueAccessories,
    ...uniqueArmours,
    ...uniqueFlasks,
    ...uniqueWeapons
  ];

  let tradeItems = generateTradeItems(divCards, allItems);

  return (
    <div className="App">
      <TradeTable items={tradeItems} />
    </div>
  );
}

export default App;
