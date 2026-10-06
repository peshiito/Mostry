// "1 producto" / "3 productos".
export const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
