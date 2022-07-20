// TODO: add paramaterization
export const treasuryDataQuery = `
query {
  protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
    id
    timestamp
    ohmCirculatingSupply
    sOhmCirculatingSupply
    totalSupply
    ohmPrice
    marketCap
    totalValueLocked
    treasuryRiskFreeValue
    treasuryMarketValue
    nextEpochRebase
    nextDistributedOhm
    treasuryDaiRiskFreeValue
    treasuryFraxMarketValue
    treasuryDaiMarketValue
    treasuryFraxRiskFreeValue
    treasuryXsushiMarketValue
    treasuryWETHMarketValue
    treasuryLusdRiskFreeValue
    treasuryLusdMarketValue
    treasuryOtherMarketValue
    treasuryWBTCMarketValue
    treasuryUstMarketValue
    currentAPY
    runway10k
    runway20k
    runway50k
    runway7dot5k
    runway5k
    runway2dot5k
    runwayCurrent
    treasuryOhmDaiPOL
    treasuryOhmFraxPOL
  }
}
`;

export const rebasesDataQuery = `
query {
  rebases(where: {contract: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a"}, orderBy: timestamp, first: 1000, orderDirection: desc) {
    percentage
    timestamp
  }
}
`;

// tootip样式配置
export const bulletpoints = {
  one: [
    {
      right: 20,
      top: -12,
      background: "#0031FF",
    },
  ],
  two: [
    {
      right: 20,
      top: -12,
      background: "#3D72FD",
    },
  ],
  three: [
    {
      right: 15,
      top: -12,
      background: "#3D72FD",
    },
    {
      right: 25,
      top: -12,
      background: "#F200FF",
    },
  ],
  four: [
    {
      right: 20,
      top: -12,
      background: "#D257FF",
    },
  ],
  five: [
    {
      right: 20,
      top: -12,
      background: "#26E6C5",
    },
  ],
  six: [
    {
      right: 20,
      top: -12,
      background: "#EC6EFF",
    },
  ],
  seven: [
    {
      right: 20,
      top: -12,
      background: "#DF741A",
    },
  ],
  eight: [
    {
      right: 15,
      top: -12,
      background: "#3D72FD",
    },
    {
      right: 25,
      top: -12,
      background: "#F200FF",
    },
  ],
  nine: [
    {
      right: 20,
      top: -12,
      background: "#FF3FF7",
    },
  ],
  ten: [
    {
      right: 20,
      top: -12,
      background: "#FF3FF7",
    },
  ],
  eleven: [
    {
      right: 20,
      top: -12,
      background: "#FB0158",
    },
  ],
  twelve: [
    {
      right: 20,
      top: -12,
      background: "#DF741A",
    },
  ],
  thirteen: [
    {
      right: 20,
      top: -12,
      background: "#1C6CFF",
    },
  ],
  coin: [
    {
      right: 15,
      top: -12,
      background: "#F5AC37",
    },
    {
      right: 25,
      top: -12,
      background: "#768299",
    },
  ],
  rfv: [
    {
      right: 15,
      top: -12,
      background: "#F5AC37",
    },
    {
      right: 25,
      top: -12,
      background: "#768299",
    },
    {
      right: 29,
      top: -12,
      background: "#c9184a",
    },
    {
      right: 29,
      top: -12,
      background: "#4E1F71",
    },
  ],
  holder: [
    {
      right: 40,
      top: -12,
      background: "#A3A3A3",
    },
  ],
  apy: [
    {
      right: 20,
      top: -12,
      background: "#49A1F2",
    },
  ],
  runway: [
    {
      right: 45,
      top: -12,
      background: "#000000",
    },
    {
      right: 48,
      top: -12,
      background: "#2EC608",
    },
    {
      right: 48,
      top: -12,
      background: "#49A1F2",
    },
    {
      right: 48,
      top: -12,
      background: "#c9184a",
    },
  ],
  staked: [
    {
      right: 45,
      top: -11,
      background: "linear-gradient(180deg, #55EBC7 -10%, rgba(71, 172, 235, 0) 100%)",
    },
    {
      right: 68,
      top: -12,
      background: "rgba(151, 196, 224, 0.2)",
      border: "1px solid rgba(54, 56, 64, 0.5)",
    },
  ],
  pol: [
    {
      right: 15,
      top: -12,
      background: "linear-gradient(180deg, rgba(56, 223, 63, 1) -10%, rgba(182, 233, 152, 1) 100%)",
    },
    {
      right: 25,
      top: -12,
      background: "rgba(219, 242, 170, 1)",
      border: "1px solid rgba(118, 130, 153, 1)",
    },
  ],
};

// 悬浮charts后的文字显示
export const tooltipItems = {
  one: [`Tvl`],
  two: [`Tvl`],
  three: ["Reserve fund size", "FRAX"],
  four: [`Tvl`],
  five: [`Tvl`],
  six: [`Tvl`],
  seven: [`Tvl`],
  eight: ["DAI", "FRAX"],
  nine: [`Tvl`],
  ten: [`Tvl`],
  eleven: [`Tvl`],
  twelve: [`Tvl`],
  thirteen: [`Tvl`],
  coin: ["DAI", "FRAX"],
  rfv: ["DAI", "FRAX", "LUSD", "UST"],
  holder: ["OHMies"],
  apy: ["APY"],
  runway: [`Current`, "7.5K APY", "5K APY", "2.5K APY"],
  pol: [`SLP Treasury`, `Market SLP`],
};

// 数据字段
export const dataKey = () => {
  return {
    one: ["one"],
    two: ["two"],
    three: ["three1", "three2"],
    four: ["four"],
    five: ["five"],
    six: ["six"],
    seven: ["seven"],
    eight: ["eight1", "eight2"],
    nine: ["nine"],
    ten: ["ten"],
    eleven: ["eleven"],
    twelve: ["twelve"],
    thirteen: ["thirteen"],
    coin: ["treasuryDaiMarketValue", "treasuryFraxMarketValue"],
    runway: ["runwayCurrent"],
  };
};

export const headerText = () => {
  return {
    one: `TVL`,
    two: `Single currency intertemporal inflation`,
    three: `Savings reserve`,
    four: `Total circulation`,
    five: `Factors of attention`,
    six: `Total circulation`,
    seven: `Call factor`,
    eight: `Single currency reserves`,
    nine: `Current inflation rate target`,
    ten: `DSGE suitability`,
    eleven: `Debt ratio`,
    twelve: `Household savings rate`,
    thirteen: `Liquidity capacity of agreement`,
    coin: `Market`,
    runway: `Runway Available`,
  };
};

export const tooltipInfoMessages = () => {
  return {
    one: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    two: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    three: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    four: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    five: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    six: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    seven: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    eight: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    nine: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    ten: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    eleven: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    twelve: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    thirteen: `Total Value Deposited, is the dollar amount of all OHM staked in the protocol. This metric is often used as growth or health indicator in DeFi projects.`,
    mvt: `Market Value of Treasury Assets, is the sum of the value (in dollars) of all assets held by the treasury (Excluding pTokens and Vested tokens).`,
    rfv: `Risk Free Value, is the amount of funds the treasury guarantees to use for backing OHM.`,
    pol: `Protocol Owned Liquidity, is the amount of LP the treasury owns and controls. The more POL the better for the protocol and its users.`,
    holder: `Holders, represents the total number of Ohmies (sOHM holders)`,
    staked: `OHM Staked is the ratio of sOHM to circulating supply of OHM (staked vs total)`,
    apy: `Annual Percentage Yield, is the normalized representation of an interest rate, based on a compounding period over one year. Note that APYs provided are rather ballpark level indicators and not so much precise future results.`,
    runway: `Runway, is the number of days sOHM emissions can be sustained at a given rate. Lower APY = longer runway`,
  };
};

export const itemType = {
  dollar: "$",
  percentage: "%",
};
