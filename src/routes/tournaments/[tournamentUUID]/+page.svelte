<script lang="ts">
    import type { PageData } from "./$types";
    
    export let data: PageData;

    $: ({ tournament } = data);
</script>

{JSON.stringify(tournament)}