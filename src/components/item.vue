<template>
    <div class="item" style="padding:40px 0; font-size:25px">
       {{item.id}} {{item.value}}
    </div>
</template>
<script>
export default {
    props:{
        item:{}
    }
}
</script>

<style lang="stylus">
.item{
    border 1px solid red
}
</style>