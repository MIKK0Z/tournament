<script lang="ts">
    import { BracketsManager } from "brackets-manager";
    import { InMemoryDatabase } from "brackets-memory-db";

    const storage = new InMemoryDatabase();
    const manager = new BracketsManager(storage);
</script>

{JSON.stringify(storage)}