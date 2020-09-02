<template>
  <div id="app">
    <!-- 只显示可视区 -->
    <!-- 需要知道每一项有多高(size)，并且有多少数据(remain)，才能计算出一个滚动条 -->
    <virtual-list
      :size="80"
      :remain="8"
      :items="items"
      :variable="true"
    >
      <Item
        slot-scope="{item}"
        :item="item"
      />
    </virtual-list>
  </div>
</template>
<script>
import VirtualList from './components/virtual-list'
import Item from './components/item'
import Mock from 'mockjs'
let items = []
//循环出
for (let i = 0; i < 1000; i++) {
  items.push({ id: i, value: Mock.Random.sentence() })
}
export default {
  name: 'App',
  data() {
    return { items }
  },
  components: {
    VirtualList,
    Item
  }
}
</script>
<style lang="stylus">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
