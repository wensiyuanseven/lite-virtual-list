<template>
  <div class="waterfall-fixed">
    <lite-virtual-list type="waterfall"  :screen="[2, 2]" :marginBottom="12" :remain="8" virtualHieght="500px"  :data="items" :distance="100">
      <div class="item" slot-scope="{ item }">
       #{{ item.id + 1 }}
      </div>
    </lite-virtual-list>
    </div>
  </div>
</template>
<script>
import Mock from 'mockjs'
let items = []
for (let i = 0; i < 10000; i++) {
  items.push({
    id: i, //必须设置id
    height: 250, //必须设置height
  })
}
Object.freeze(items)
export default {
  name: 'waterfall-fixed',
  data() {
    return { items }
  },
}
</script>
<style  scoped>
.waterfall-fixed {
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
  font-size: 18px;
  font-weight: bold;
  color: red;
  text-align: center;
  line-height: 250px;
}
</style>

