## 优化

  当数据量过大时，可使用`Object.freeze()`冻结对象，提高性能,减少白屏问题

初始化二十万条数据

```vue
<template>
  <div class="fixed">
    <lite-virtual-list type="fixed"  :size="80" :remain="8" :data="items">
      <div class="item" slot-scope="{ item }" style="height: 80px">
        {{ item.index + 1 }}
      </div>
    </lite-virtual-list>
  </div>
</template>

<script>
let items = []
let count = 200000
for (let i = 0; i < count; i++) {
  items.push({ id: i, value: i })
}
Object.freeze(items) // 冻结对象
export default {
  data() {
    return { items }
  }
}
</script>
<style scoped>
.fixed {
  border: 1px solid red;
}
.item {
  border-bottom: 1px solid red;
  text-align: center;
  line-height: 80px;
}
</style>

```
