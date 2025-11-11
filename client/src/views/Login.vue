<script lang="ts" setup>
</script>

<template>
    <div class="view-container">
        <div class="centered-container">
            <div class="d-flex flex-column justify-content-center align-items-center gap-16">
                <div class="form-title text-centered">
                    To access the Wandare App <br>
                    you need to be logged in
                </div>
        
                <a href="/api/login" class="common-button">Login</a>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.centered-container{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
}
</style>