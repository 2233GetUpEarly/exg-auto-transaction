(function(){

    class Queue
    {
        enqueue(element)
        {
            this.#items.push(element);
        }

        dequeue()
        {
            if (this.isEmpty())
            {
                return undefined;
            }
            return this.#items.shift();
        }

        pop(index)
        {
            this.#items.splice(index, 1);
        }

        front()
        {
            if (this.isEmpty())
            {
                return undefined;
            }
            return this.#items[0];
        }

        size()
        {
            return this.#items.length;
        }

        isEmpty()
        {
            return this.#items.length === 0;
        }

        getItems()
        {
            return this.#items;
        }

        #items = [];
    }

    window.eatwi = window.eatwi || {};
    window.eatwi.Queue = Queue;     // 把类的类型挂出去，不是实体
})();
