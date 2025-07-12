import { ref, watch, onMounted } from 'vue';

export function usePreferences() {
    const theme = ref('light');
    const fontSize = ref('medium');

    onMounted(() => {
        const storedTheme = localStorage.getItem('theme');
        const storedFontSize = localStorage.getItem('fontSize');

        if (storedTheme === 'light' || storedTheme === 'dark') {
            theme.value = storedTheme;
        }

        if (['small', 'medium', 'large'].includes(storedFontSize)) {
            fontSize.value = storedFontSize;
        }
    });

    watch(theme, (newVal) => {
        localStorage.setItem('theme', newVal);
    });

    watch(fontSize, (newVal) => {
        localStorage.setItem('fontSize', newVal);
    });

    return {
        theme,
        fontSize,
    };
}
