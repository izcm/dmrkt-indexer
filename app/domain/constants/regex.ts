const bytesN = (n: number) => `^0x[a-fA-F0-9]{${n * 2}}$`

export const ADDR_REGEX = bytesN(20)
export const BYTES32_REGEX = bytesN(32)
