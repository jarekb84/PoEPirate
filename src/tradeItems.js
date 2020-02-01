function extractDivCardOutput(card, allItems) {
  const modifierText = ((card || { explicitModifiers: [] }).explicitModifiers[0] || {}).text || "";
  const name = (modifierText.match(/(?<={)(.*)(?=})/) || [])[0];

  let result = {
    type: (modifierText.match(/(?<=<)(.*)(?=>)/) || [])[0],
    item: allItems.find(item => item.name === name && item.links === 0) || {}
  };

  return result;
}

function generateLink(item) {
  const basePath = "https://www.pathofexile.com/api/trade/search/Metamorph?redirect&source=";
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

function getNormalizedCurrency(chaos, exalted) {
  let output = { chaos, exalted, normalized: {} };
  if (Math.abs(exalted) >= 1) {
    output.normalized = {
      value: exalted,
      suffix: "ex",
      text: `${exalted.toFixed(2)}ex`
    };
  } else if (Math.abs(chaos) >= 0) {
    output.normalized = {
      value: chaos,
      suffix: "c",
      text: `${chaos.toFixed(0)}c`
    };
  }

  return output;
}

export function generateTradeItems(divCards, allItems) {
  return divCards.map(card => {
    const outputItem = extractDivCardOutput(card, allItems);
    const outputCost = getNormalizedCurrency(outputItem.item.chaosValue, outputItem.item.exaltedValue);
    const cardCost = getNormalizedCurrency(card.chaosValue, card.exaltedValue);
    const stackCost = getNormalizedCurrency(card.chaosValue * card.stackSize, card.exaltedValue * card.stackSize);
    const profit = getNormalizedCurrency(outputCost.chaos - stackCost.chaos, outputCost.exalted - stackCost.exalted);

    return {
      card,
      tradeUrl: generateLink(card),
      outputItem,
      cardCost,
      stackCost,
      outputCost,
      profit,
      margin: (profit.chaos / outputCost.chaos) * 100
    };
  });
}
