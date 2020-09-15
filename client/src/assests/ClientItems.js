class ClientItems {
    getItems() {
        const items = JSON.parse(localStorage.getItem('items'));
        return items;
    }

    getNumberOfItems() {
        const items = JSON.parse(localStorage.getItem('items'));

        if (items !== null) {
            return Object.keys(items).length;
        }

        return 0;
    }

    getTotalPrice() {
        const items = this.getItems();
        let totalPrice = 0;

        if (items !== null) {
            items.forEach(item => {
                totalPrice = totalPrice + parseFloat(item.price);
            });

            return totalPrice.toFixed(2);
        }

        return 0;
    }

    addItem(item) {
        let items = this.getItems();

        if (items !== null) {
            items.push(item)
            localStorage.setItem('items', JSON.stringify(items));
        } else {
            items = [];
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items));
        }

        return true;
    }

    deleteItem(index) {
        let items = this.getItems();

        if (items !== null) {
            items.splice(index, 1);
            localStorage.setItem('items', JSON.stringify(items));
            return true;
        }

        return false;

    }
}

export default new ClientItems();