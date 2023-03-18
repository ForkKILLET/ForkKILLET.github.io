<script setup lang="ts">
</script>

<template>
    <div class="sidebar-button">
        <span class="sidebar-button-dots">&middot;&middot;&middot;</span>
    </div>
</template>

<style scoped>
.sidebar-button {
    position: fixed;
    z-index: 3;
    top: 4em;
    right: 1em;

    display: flex;
    justify-content: center;

    width: 3em;
    height: 3em;

    border-radius: 1.5em;
    user-select: none;

    background: white;
    filter: drop-shadow(0 0 .3em #aaa);

	transition: filter .5s;
}
.sidebar-button:hover, .sidebar-button:focus {
    filter: drop-shadow(0 0 .3em #39C5BB);
}
.sidebar-button:active {
    animation: .5s bounce;
}

.sidebar-button-dots {
    align-self: center;
}

@media screen and (min-width: 601px) {
    .sidebar-button {
        display: none;
    }
}
</style>
