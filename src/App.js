import React from "react";
import "./App.css";
import divCards from "./sampleData/divinationCards";

function App() {
  const cardsToTrack = [
    "Beauty Through Death",
    "The World Eater",
    "The Queen",
    "The Damned",
    "Wealth and Power",
    "Pride of the First Ones",
    "Succor of the Sinless",
    `Hunter's Reward`
  ];

  const matchedItems = divCards.lines.filter(card =>
    cardsToTrack.includes(card.name)
  );

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
  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Card</th>
            <th>Chaos Cost</th>
            <th>Exalted Cost</th>
            <th>Stack</th>
            <th>Cost per stack</th>
          </tr>
        </thead>
        <tbody>
          {matchedItems.map(item => {
            return (
              <tr>
                <td>
                  <a href={generateLink(item)} target="_blank">
                    {item.name}
                  </a>
                </td>
                <td>{item.chaosValue}c</td>
                <td>{item.exaltedValue}ex</td>
                <td>{item.stackSize}</td>
                <td>{Math.round(item.chaosValue * item.stackSize, 0)}c</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
