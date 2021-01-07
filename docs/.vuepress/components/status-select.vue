<template>
  <div class="order-list">
    <lite-virtual-list type="fixed" :screen="[5, 5]" :size="size" :remain="5" :data="items" :interval="0">
      <div @click="change(item)" class="item" slot-scope="{ item }" :style="{ height: size - 10 + 'px' }">
        <div class="index">#{{ item.index + 1 }}</div>
        <img :src="getSrc(item.status)" />
      </div>
    </lite-virtual-list>
  </div>
</template>

<script>
let items = []
let count = 1000
for (let i = 0; i < count; i++) {
  items.push({ id: i, status: false })
}
export default {
  name: 'fixed-size',
  data() {
    return { items, size: 110 }
  },
  methods: {
    change(item) {
      item.status = !item.status
      this.$set(this.items, item.index, item)
    },
    getSrc(status) {
      return require(`./../assest/img/${status ? 'select' : 'no-select'}.png`)
    },
  },
}
</script>
<style scoped>
.order-list {
  background-color: #f9f9f9;
  padding-top: 10px;
  max-width: 375px;
  margin: 30px 0;
}
.item {
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #ffffff;
  margin: 0 auto;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  padding: 15px 19px;
  font-size: 18px;
  user-select: none;
}
.item img {
  width: 20px;
}
.index {
  font-weight: bold;
  margin-right: 2px;
  color: red;
}
</style>