// stores/useCustomerStore.js
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCustomerStore = defineStore('customer', () => {
    const customers = ref([
        { id: 1, name: "Ahmad", city: "Tehran" },
        { id: 2, name: "Mehran", city: "Shiraz" },
        { id: 3, name: "Ali", city: "Esfahan" },
    ]);

    const products = ref([
        { id: 101, name: "Laptop", category: "Electronics" },
        { id: 102, name: "Mouse", category: "Electronics" },
        { id: 103, name: "Monitor", category: "Electronics" },
        { id: 104, name: "Coffee Maker", category: "Home Appliances" },
        { id: 105, name: "Blender", category: "Home Appliances" },
        { id: 106, name: "Headphones", category: "Electronics" },
    ]);

    const purchases = ref([
        { customerId: 1, productId: 101, date: "2025-03-01" },
        { customerId: 1, productId: 102, date: "2025-02-02" },
        { customerId: 2, productId: 103, date: "2025-02-05" },
        { customerId: 2, productId: 104, date: "2025-02-06" },
        { customerId: 3, productId: 105, date: "2025-02-07" },
        { customerId: 3, productId: 106, date: "2025-02-08" },
        { customerId: 1, productId: 104, date: "2025-02-10" },
    ]);

    const getPurchasedProductsByCustomer = computed(() => {
        const map = {};
        customers.value.forEach(customer => {
            const purchased = purchases.value
                .filter(p => p.customerId === customer.id)
                .map(p => products.value.find(prod => prod.id === p.productId));
            map[customer.id] = purchased;
        });
        return map;
    });

    const mostPurchasedCategoryPerCustomer = computed(() => {
        const result = {};
        for (const customer of customers.value) {
            const productList = getPurchasedProductsByCustomer.value[customer.id];
            const categoryCount = {};
            productList.forEach(product => {
                if (product) {
                    categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
                }
            });
            const mostPurchased = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])[0]?.[0];
            result[customer.id] = mostPurchased || null;
        }
        return result;
    });

    const recommendedProducts = (customerId) => {
        const currentCustomer = customers.value.find(c => c.id === customerId);
        if (!currentCustomer) return [];

        const targetCategory = mostPurchasedCategoryPerCustomer.value[customerId];
        const currentProducts = getPurchasedProductsByCustomer.value[customerId] || [];

        const currentProductIds = new Set(currentProducts.map(p => p?.id));
        const similarCustomerIds = purchases.value
            .filter(p => {
                const product = products.value.find(prod => prod.id === p.productId);
                return product?.category === targetCategory && p.customerId !== customerId;
            })
            .map(p => p.customerId);

        const recommended = purchases.value
            .filter(p => similarCustomerIds.includes(p.customerId))
            .map(p => products.value.find(prod => prod.id === p.productId))
            .filter(prod =>
                prod &&
                prod.category === targetCategory &&
                !currentProductIds.has(prod.id)
            );

        const filteredByCity = recommended.filter(prod => {
            const buyers = purchases.value.filter(p => p.productId === prod.id);
            return buyers.some(b => {
                const buyer = customers.value.find(c => c.id === b.customerId);
                return buyer?.city === currentCustomer.city;
            });
        });

        return [...new Set(filteredByCity)];
    };

    return {
        customers,
        products,
        purchases,
        getPurchasedProductsByCustomer,
        mostPurchasedCategoryPerCustomer,
        recommendedProducts,
    };
});
