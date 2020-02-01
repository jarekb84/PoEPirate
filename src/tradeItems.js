function extractDivCardOutput(card, allItems) {
  const modifierText =
    ((card || { explicitModifiers: [] }).explicitModifiers[0] || {}).text || "";
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

export function generateTradeItems(divCards, allItems) {
  return divCards.map(card => {
    const outputItem = extractDivCardOutput(card, allItems);
    const outputCost = getCost(outputItem.item);
    const cardCost = getCost(card);
    const profit = (outputCost.value - cardCost.stackCost).toFixed(1);

    return {
      card,
      tradeUrl: generateLink(card),
      outputItem,
      cardCost: getCost(card),
      outputCost,
      profit: (outputCost.value - cardCost.stackCost).toFixed(1),
      margin: ((profit / outputCost.value) * 100).toFixed(2)
    };
  });
}
