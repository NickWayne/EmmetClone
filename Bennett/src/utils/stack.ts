export class Stack<T> {
    data: T[] = [];
    count = 0;

    clear() {
        this.data = [];
        this.count = 0;
    }

    push(element: T): void {
        this.data.push(element);
        this.count++;
    }

    pop(): T {
        if (!this.isEmpty()) {
            this.count--;
            return this.data.pop();
        }
    }

    peek(): T {
        if (!this.isEmpty()) {
            return this.data[this.count - 1];
        }
    }

    isEmpty() {
        return this.count === 0;
    }
}