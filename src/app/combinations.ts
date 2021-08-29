function reverseRange(r: number) {
    const arr = [];

    for (let i = r - 1; i >= 0; arr.push(i--));

    return arr;
}

function getIndices(arr: any[], indices: number[]) {
    const result = [];

    for (const index of indices) {
        result.push(arr[index]);
    }

    return result;
}

export function* combinations(pool: any[], r: number) {
    const n = pool.length;
    if (r > n) return;
    const indices = pool.map((_, i) => i)
    const cycles = []
    for (let i = n; i > n - r; cycles.push(i--));
    yield getIndices(pool, indices.slice(0, r));

    while (n) {
        const reverseList = reverseRange(r);
        let completionFlag = true;

        for (const i of reverseList) {
            cycles[i] -= 1;

            if (cycles[i] == 0) {
                const temp = indices.slice(i + 1).concat(indices.slice(i, i + 1));
                indices.splice(i, indices.length, ...temp);
                cycles[i] = n - i;
            } else {
                const j = cycles[i];
                const temp = indices[i];
                indices[i] = indices[indices.length - j];
                indices[indices.length - j] = temp;
                yield getIndices(pool, indices.slice(0, r));
                completionFlag = false;
                break;
            }
        }

        if (completionFlag) return;
    }
}

export function unique(arr: any[][] | Generator<any[], void, unknown>) {
    const hashSet = new Map;

    for (const comb of arr) {
        comb.sort();

        if (!hashSet.has(comb.toString())) {
            hashSet.set(comb.toString(), comb);
        }
    }

    return [...hashSet.values()];
}

export function uniqueCombinations(pool: any[], r: number) {
    // return unique(combinations(pool, r));
    return combinations(pool, r);
}
