export function makeLightColor(number: number) {
    const hue = number * 137.508;
    return `hsl(${hue},50%,75%)`;
}