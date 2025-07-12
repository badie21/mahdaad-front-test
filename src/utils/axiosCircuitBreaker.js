import axios from 'axios';

let failureCount = 0;
let isCircuitOpen = false;
let circuitTimer = null;

const FAILURE_THRESHOLD = 3;
const OPEN_DURATION = 60000;

const notifyUser = () => {
    console.warn('Service temporarily unavailable due to repeated failures.');
};

const resetCircuit = () => {
    failureCount = 0;
    isCircuitOpen = false;
    console.log('Circuit breaker closed. Retrying API requests.');
};

const circuitBreakerAxios = axios.create();

circuitBreakerAxios.interceptors.request.use(config => {
    if (isCircuitOpen) {
        notifyUser();
        return Promise.reject(new Error('Circuit breaker is open.'));
    }
    return config;
});

circuitBreakerAxios.interceptors.response.use(
    response => {
        failureCount = 0;
        return response;
    },
    error => {
        failureCount++;

        if (failureCount >= FAILURE_THRESHOLD && !isCircuitOpen) {
            isCircuitOpen = true;
            notifyUser();
            console.warn(`Circuit opened for ${OPEN_DURATION / 1000} seconds.`);
            circuitTimer = setTimeout(() => {
                resetCircuit();
            }, OPEN_DURATION);
        }

        return Promise.reject(error);
    }
);

export default circuitBreakerAxios;
