import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'combinations';
  persons = ["t1", "t2", "t3"]
  teamsize = 2;

  constructor() {
    for (const iterator of this.combinations(this.persons, this.teamsize)) {
      console.log(iterator);
    }
  }

  isSame(list1: any[], list2: any[]) {

  }

  reverseRange(r: number) {
    const arr = [];

    for (let i = r - 1; i >= 0; arr.push(i--));

    return arr;
  }

  getIndices(arr: any[], indices: number[]) {
    const result = [];

    for (const index of indices) {
      result.push(arr[index]);
    }

    return result;
  }

  *combinations(pool: any[], r: number) {
    const n = pool.length;
    if (r > n) return;
    const indices = pool.map((_, i) => i)
    const cycles = []
    for (let i = n; i > n - r; cycles.push(i--));
    yield this.getIndices(pool, indices.slice(0, r));

    while (n) {
      const reverseList = this.reverseRange(r);
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
          yield this.getIndices(pool, indices.slice(0, r));
          completionFlag = false;
          break;
        }
      }

      if (completionFlag) return;
    }
  }
}
