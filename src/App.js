import React, { useState, useEffect } from "react";
import "./App.css";
import { getDataMock as getData } from "./data/fetchData";
//import { getData } from "./data/fetchData";
import { generateTradeItems } from "./tradeItems";
import TradeTable from "./tradeTable/tradeTable";

function App() {
  const [divCards, setDivCards] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [skillGems, setSkillGems] = useState([]);
  const [prophecies, setProphecies] = useState([]);
  const [uniqueAccessories, setUniqueAccessories] = useState([]);
  const [uniqueArmours, setUniqueArmours] = useState([]);
  const [uniqueFlasks, setUniqueFlasks] = useState([]);
  const [uniqueWeapons, setUniqueWeapons] = useState([]);

  useEffect(() => {
    getData("DivinationCard").then(setDivCards);
    getData("SkillGem").then(setSkillGems);
    getData("Prophecy").then(setProphecies);
    getData("UniqueAccessory").then(setUniqueAccessories);
    getData("UniqueArmour").then(setUniqueArmours);
    getData("UniqueFlask").then(setUniqueFlasks);
    getData("UniqueWeapon").then(setUniqueWeapons);
    getData("Currency").then(setCurrency);
  }, []);

  const allItems = [
    ...divCards,
    ...currency,
    ...skillGems,
    ...prophecies,
    ...uniqueAccessories,
    ...uniqueArmours,
    ...uniqueFlasks,
    ...uniqueWeapons,
  ];

  let tradeItems = generateTradeItems(divCards, allItems)
    //.filter(item => item.profit.exalted > 1 || (item.margin > 10 && item.profit.chaos > 30))
    //.filter(item => item.card.name !== "Remembrance") // ring with multiple output types
    //.filter(item => !["normal", "whiteitem", "magicitem", "rareitem"].includes(item.outputItem.type))
    //.filter(item => !["uniqueitem", "divination"].includes(item.outputItem.type))
    //.filter(item => ["gemitem"].includes(item.outputItem.type))
    .sort((a, b) => b.profit.chaos - a.profit.chaos);

  return (
    <div className="App">
      <TradeTable items={tradeItems} />
    </div>
  );
}

export default App;
