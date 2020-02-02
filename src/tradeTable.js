import React from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

function getSparkline({ data, totalChange } = {}) {
  return (
    <Sparklines data={data}>
      <SparklinesLine color={totalChange > 0 ? "green" : "red"} />
    </Sparklines>
  );
}

export default function TradeTable({ items }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Card</th>
          <th>Trend</th>
          <th>Cost</th>
          <th>Stack</th>
          <th>Stack Cost</th>
          {/* <th>OutputType</th> */}
          <th>Output</th>
          <th>Trend</th>
          <th>Revenue</th>
          <th>Profit</th>
          <th>Margin</th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ card, tradeUrl, cardCost, stackCost, outputItem, outputCost, profit, margin }) => {
          return (
            <tr key={card.id}>
              <td>
                <a href={tradeUrl} target="_blank">
                  {card.name}
                </a>
              </td>
              <td>{getSparkline(card.sparkline)}</td>
              <td>{cardCost.normalized.text}</td>
              <td>{card.stackSize}</td>
              <td>{stackCost.normalized.text}</td>
              {/* <td>{outputItem.type}</td> */}
              <td>{outputItem.item.name}</td>
              <td>{getSparkline(outputItem.item.sparkline)}</td>
              <td>{outputCost.normalized.text}</td>
              <td>{profit.normalized.text}</td>
              <td>{isNaN(margin) ? "" : `${margin.toFixed(2)}%`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
