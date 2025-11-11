<script lang="ts" setup>
defineProps<{
    errorCode?: number,
    errorMessage?: string
}>()

const refreshPage = () => { window.location.reload() };
</script>

<template>
    <div v-if="errorCode === 500" class="p-absolute-centered width-100 d-flex flex-column align-items-center justify-content-center gap-16">
        <div class="common-text">{{ errorMessage }}</div>

        <button class="common-button" @click="refreshPage">Try again</button>
    </div>

    <div v-if="errorCode === 404" class="p-absolute-centered width-100 d-flex flex-column align-items-center justify-content-center gap-16">
        <div class="common-text">{{ errorMessage }}</div>

        <router-link to="/" class="common-button">Go back to Homepage</router-link>
    </div>
</template>