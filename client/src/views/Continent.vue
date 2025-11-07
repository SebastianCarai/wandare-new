<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const continent = route.params.id;

</script>

<template>
    <div>
        <button type="button" @click="$router.go(-1)" class="go-back-button" aria-label="Go back to the previous page">
            <img src="@/assets/icons/go-back-icon.svg" aria-hidden="true">
        </button>

        <div class="view-container min-full-height d-flex justify-content-center align-items-center">
            <h1 class="main title text-centered">
                You clicked on: <br>
                {{ continent }}
            </h1>
        </div>

    </div>
</template>