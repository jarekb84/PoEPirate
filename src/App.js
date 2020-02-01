import React, { useState, useEffect } from "react";
import "./App.css";
import { getDataMock as getData } from "./data/fetchData";

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

  function extractDivCardOutput(card) {
    const modifierText =
      ((card || { explicitModifiers: [] }).explicitModifiers[0] || {}).text ||
      "";
    const name = (modifierText.match(/(?<={)(.*)(?=})/) || [])[0];

    let result = {
      type: (modifierText.match(/(?<=<)(.*)(?=>)/) || [])[0],
      item: allItems.find(item => item.name === name && item.links === 0) || {}
    };

    return result;
  }

  function generateLink(item) {
    const basePath =
      "https://www.pathofexile.com/api/trade/search/Metamorph?redirect&source=";
    const query = {
      query: {
        //status: { option: "any" },
        type: item.name,
        //stats: [{ type: "and", filters: [], disabled: false }],
        filters: {
          trade_filters: { filters: { price: { max: item.chaosValue } } },
          type_filters: { filters: { category: { option: "card" } } }
        }
      },
      sort: { price: "asc" }
    };

    return basePath + JSON.stringify(query);
  }

  function getCost({ exaltedValue, chaosValue, stackSize }) {
    let output = {};
    if (exaltedValue >= 1) {
      output = {
        value: exaltedValue,
        suffix: "ex",
        text: `${exaltedValue}ex`
      };
    } else if (chaosValue > 0) {
      output = {
        value: chaosValue,
        suffix: "c",
        text: `${chaosValue}c`
      };
    }

    const stackCostInEx = exaltedValue * stackSize;
    const stackCostInChaos = chaosValue * stackSize;
    if (stackCostInEx > 1) {
      output.stackCost = stackCostInEx;
      output.stackSuffix = "ex";
      output.stackText = `${stackCostInEx.toFixed(1)}ex`;
    } else {
      output.stackCost = stackCostInChaos;
      output.stackSuffix = "c";
      output.stackText = `${Math.round(stackCostInChaos)}c`;
    }

    return output;
  }

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Card</th>
            <th>Cost</th>
            <th>Stack</th>
            <th>Stack Cost</th>
            <th>OutputType</th>
            <th>Output</th>
            <th>Revenue</th>
            <th>Profit</th>
            <th>Margin</th>
          </tr>
        </thead>
        <tbody>
          {divCards.map(item => {
            const outputItem = extractDivCardOutput(item);
            const cardCost = getCost(item);
            const outputCost = getCost(outputItem.item);
            const profit = (outputCost.value - cardCost.stackCost).toFixed(1);
            const margin = ((profit / outputCost.value) * 100).toFixed(2);

            return (
              <tr>
                <td>
                  <a href={generateLink(item)} target="_blank">
                    {item.name}
                  </a>
                </td>
                <td>{cardCost.text}</td>
                <td>{item.stackSize}</td>
                <td>{cardCost.stackText}</td>
                <td>{outputItem.type}</td>
                <td>{outputItem.item.name}</td>
                <td>{outputCost.text}</td>
                <td>
                  {profit}
                  {outputCost.suffix}
                </td>
                <td>{margin}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
