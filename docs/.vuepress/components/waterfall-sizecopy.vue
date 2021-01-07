<template>
  <div class="waterfall">
    <lite-virtual-list type="waterfall" :screen="[2, 2]" :marginBottom="15" :remain="8" virtualHieght="500px" :size="100" :data="items" :distance="100">
      <div class="item" slot-scope="{ item }">{{ item.id }} {{ item.value }}{{ item.height }}</div>
    </lite-virtual-list>
  </div>
</template>
<script>
import Mock from 'mockjs'
let count = 1000
let items = []
function getHeight(value) {

  return 200
}
for (let i = 0; i < count; i++) {
  let value = Mock.Random.cparagraph(1, 3)
  items.push({
    id: i,
    value: value,
    height: getHeight(value),
  })
}
export default {
  name: 'copy',
  data() {
    return { items, isLoad: false, loadindex: 0 }
  },
  methods: {},
}
</script>
<style  scoped>
.waterfall {
  background-color: #f9f9f9;
  padding: 10px 0;
  max-width: 375px;
  margin: 30px 0;
}
/deep/ .waterfall-list {
  padding: 6px;
}
.item {
  width: 95%;
  height: 100%;
  background-color: #ffffff;
  margin: 0 auto;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>

