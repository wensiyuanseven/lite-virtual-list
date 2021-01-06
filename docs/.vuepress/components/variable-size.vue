<template>
  <div class="variable">
    <lite-virtual-list type="variable" :screen="[3, 3]" :data="items" virtualHieght="500px" :size="100" :remain="8" :distance="100">
      <div class="item" slot-scope="{ item }">
        <span class="index"> #{{ item.index + 1 }} </span>
        <span> {{ item.value }}</span>
      </div>
    </lite-virtual-list>
  </div>
</template>
<script>
import Mock from 'mockjs'
let count = 10000
let items = []
for (let i = 0; i < count; i++) {
  items.push({ id: i, value: Mock.Random.cparagraph(1, 5) })
}
Object.freeze(items)
export default {
  name: 'variable-size',
  data() {
    return { items }
  },
}
</script>
<style  scoped>
.variable {
  margin-top: 30px;
  max-width: 375px;
  margin: 30px 0;
  border: 1px solid #efefef;
}
.item {
  border-bottom: 1px solid #efefef;
  padding: 15px;
  font-size: 14px;
  color: #262626;
}
.index {
  font-weight: bold;
  margin-right: 4px;
  color: red;
}
</style>

