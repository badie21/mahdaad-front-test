import { ref, watchEffect } from 'vue';
import axios from 'axios';

export function useUserData(userId) {
    const userData = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const cache = new Map();
    let abortController = null;

    watchEffect(() => {
        const id = userId.value;
        if (!id) return;

        if (cache.has(id)) {
            userData.value = cache.get(id);
            return;
        }

        if (abortController) {
            abortController.abort(); // Cancel previous request
        }

        abortController = new AbortController();
        loading.value = true;
        error.value = null;

        axios.get(`/api/users/${id}`, {
            signal: abortController.signal,
        })
            .then(res => {
                cache.set(id, res.data);
                userData.value = res.data;
            })
            .catch(err => {
                if (err.name !== 'CanceledError') {
                    error.value = err;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    });

    return {
        userData,
        loading,
        error,
    };
}
