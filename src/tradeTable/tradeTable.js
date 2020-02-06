import React from "react";
import "./tradeTable.css";
import { Sparklines, SparklinesLine } from "react-sparklines";

function getSparkline({ data, totalChange } = {}) {
  return (
    <Sparklines data={data}>
      <SparklinesLine color={totalChange > 0 ? "green" : "red"} />
    </Sparklines>
  );
}

function getOutputItemName(outputItem, outputItemLink) {
  const { name, gemLevel, gemQuality, corrupted } = outputItem.item;
  let text = name;
  if (outputItem.type === "gemitem" && name) {
    text = `${name} ${corrupted ? "c" : ""}${gemLevel}/${gemQuality}`;
  }

  return (
    <a href={outputItemLink} target="_blank">
      {text}
    </a>
  );
}

export default function TradeTable({ items }) {
  return (
    <table className="tradeTable">
      <thead>
        <tr>
          <th>Card</th>
          <th>Trend</th>
          <th>Current</th>
          <th>Target</th>
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
        {items.map(
          ({
            card,
            tradeUrl,
            cardCost,
            targetPurchasePrice,
            stackCost,
            outputItem,
            outputItemLink,
            outputCost,
            profit,
            margin
          }) => {
            return (
              <tr key={card.id}>
                <td>
                  <a href={tradeUrl} target="_blank">
                    {card.name}
                  </a>
                </td>
                <td>{getSparkline(card.sparkline)}</td>
                <td>{cardCost.normalized.text}</td>
                <td>{targetPurchasePrice.normalized.text}</td>
                <td>{card.stackSize}</td>
                <td>{stackCost.normalized.text}</td>
                {/* <td>{outputItem.type}</td> */}
                <td>{getOutputItemName(outputItem, outputItemLink)}</td>
                <td>{getSparkline(outputItem.item.sparkline)}</td>
                <td>{outputCost.normalized.text}</td>
                <td>{profit.normalized.text}</td>
                <td>{isNaN(margin) ? "" : `${margin.toFixed(2)}%`}</td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
}
