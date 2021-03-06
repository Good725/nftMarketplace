export const EMPTY_ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
export const DECIMALS = (10**18)

export const ether = (wei) => {
  if (wei) {
    return wei / DECIMALS;
  }
};

export const tokens = (n) => ether(n);
