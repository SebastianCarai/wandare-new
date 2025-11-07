<script setup lang="ts">
defineProps<{
    activeNavItem: string
}>();
</script>


<template>
    <div class="navbar d-flex justify-content-between">
        <router-link to="/">
            <img :class="{hidden: activeNavItem === 'home'}" class="navbar-icon" src="@/assets/icons/home-icon-black.svg" alt="Homepage Icon">
            <img :class="{visible: activeNavItem === 'home'}" class="navbar-icon navbar-icon-active" src="@/assets/icons/home-icon-active.svg" alt="Homepage Icon Active">
        </router-link>
        <router-link to="/world-map">
            <img :class="{hidden: activeNavItem === 'search'}" class="navbar-icon" src="@/assets/icons/search-icon-black.svg" alt="Search Icon">
            <img :class="{visible: activeNavItem === 'search'}" class="navbar-icon navbar-icon-active" src="@/assets/icons/search-icon-active.svg" alt="Search Icon Active">
        </router-link>
        <router-link to="/create-post/step-1">
            <img :class="{hidden: activeNavItem === 'create-post'}" class="navbar-icon" src="@/assets/icons/create-post-icon-black.svg" alt="Create Profile Icon">
            <img :class="{visible: activeNavItem === 'create-post'}" class="navbar-icon navbar-icon-active" src="@/assets/icons/create-post-icon-active.svg" alt="Create Profile Icon Active">
        </router-link>
        <div>
            <img :class="{hidden: activeNavItem === 'friends'}" class="navbar-icon" src="@/assets/icons/friends-icon-black.svg" alt="Friends Icon">
            <img :class="{visible: activeNavItem === 'friends'}" class="navbar-icon navbar-icon-active" src="@/assets/icons/friends-icon-active.svg" alt="Friends Icon Active">
        </div>
        <router-link to="/profile">
            <img :class="{hidden: activeNavItem === 'profile'}" class="navbar-icon" src="@/assets/icons/profile-icon-black.svg" alt="Profile Icon">
            <img :class="{visible: activeNavItem === 'profile'}" class="navbar-icon navbar-icon-active" src="@/assets/icons/profile-icon-active.svg" alt="Profile Icon Active">
        </router-link>

    </div>
</template>

<style lang="scss" scoped>
.navbar{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    padding: 0 1rem;
    z-index: 100;
    box-shadow: 0px -4px 8px rgba($color: $black, $alpha: 0.3);
    background-color: $white;

    .navbar-icon{
        &.hidden{
            display: none;
        }
    }

    .navbar-icon-active{
        display: none;

        &.visible{
            display: block;
        }
    }

}
</style>