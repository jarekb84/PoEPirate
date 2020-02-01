import React from "react";
export default function TradeTable({ items }) {
  return (
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
        {items.map(
          ({
            card,
            tradeUrl,
            cardCost,
            outputItem,
            outputCost,
            profit,
            margin
          }) => {
            return (
              <tr>
                <td>
                  <a href={tradeUrl} target="_blank">
                    {card.name}
                  </a>
                </td>
                <td>{cardCost.text}</td>
                <td>{card.stackSize}</td>
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
          }
        )}
      </tbody>
    </table>
  );
}
