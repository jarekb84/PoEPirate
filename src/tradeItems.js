const prophecyMap = {
  "Queen's Sacrifice": { name: "Atziri's Reflection" },
  "Ancient Doom": { name: "Doomfletch's Prism" },
  "A Master Seeks Help (Niko)": { name: "A Master Seeks Help", variant: "Niko" },
  "The King's Path": { name: "Kaom's Way" }
  //"Akil's Prophecy": {}, // random fated unique prophecy,
  //"A Master Seeks Help": {} // random master mission prophecy
};

function extractDivCardOutput(card, allItems) {
  const modifierText = ((card || { explicitModifiers: [] }).explicitModifiers[0] || {}).text || "";
  const type = (modifierText.match(/(?<=<)(.*)(?=>)/) || [])[0];
  let name = (modifierText.match(/(?<={)(.*)(?=})/) || [])[0];
  let variant = null;
  let item;

  if (type === "prophecy" && prophecyMap[name]) {
    const mapped = prophecyMap[name];
    name = mapped.name;
    variant = mapped.variant;
    item = allItems.find(item => item.name === name && item.variant == variant && item.links === 0) || {};
  }

  if (type === "gemitem") {
    const corrupted = modifierText.includes("corrupted");
    const gemLevel = parseInt((name.match(/\d+/) || [])[0] || 1);

    const gemQuality = parseInt((modifierText.match(/(?<={Quality:} <augmented>{+)(.*)(?=%})/) || [])[0]);
    let gemQualitiesToCheck;

    if (isNaN(gemQuality)) {
      if (gemLevel === 3) {
        gemQualitiesToCheck = [0, 13, 15, 20, 23];
      } else if (gemLevel === 4) {
        gemQualitiesToCheck = [0, 20];
      } else {
        gemQualitiesToCheck = [0];
      }
    } else {
      gemQualitiesToCheck = [gemQuality];
    }

    const gemName = name
      .replace(/[0-9]/g, "")
      .replace("Level", "")
      .replace("Superior", "")
      .trim();

    item = allItems.find(
      i =>
        (i.name === gemName || i.name === `${gemName} Support`) &&
        i.gemLevel === gemLevel &&
        gemQualitiesToCheck.includes(i.gemQuality) &&
        i.corrupted === corrupted
    );
  }

  if (!item) {
    item = allItems.find(i => i.name === name && i.links === 0) || {};
  }

  let result = {
    type,
    name,
    item
  };

  return result;
}

function generateLink(item, { normalized }) {
  const basePath = "https://www.pathofexile.com/api/trade/search/Metamorph?redirect&source=";
  const query = {
    query: {
      type: item.name,

      filters: {
        trade_filters: {
          filters: { price: { max: normalized.value, option: normalized.tradeCostTerm } }
        },
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
      tradeCostTerm: "exa",
      text: `${exalted.toFixed(2)}ex`
    };
  } else if (Math.abs(chaos) >= 0) {
    output.normalized = {
      value: chaos,
      suffix: "c",
      tradeCostTerm: undefined,
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
    const targetPurchasePrice = getNormalizedCurrency(card.chaosValue - 1, card.exaltedValue - 0.1);

    return {
      card,
      tradeUrl: generateLink(card, targetPurchasePrice),
      outputItem,
      cardCost,
      targetPurchasePrice,
      stackCost,
      outputCost,
      profit,
      margin: (profit.chaos / outputCost.chaos) * 100
    };
  });
}
