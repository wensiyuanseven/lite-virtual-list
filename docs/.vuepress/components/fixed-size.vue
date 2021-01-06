<template>
  <div class="order-list">
    <lite-virtual-list type="fixed" :screen="[3, 3]" :size="size" :remain="5" :data="items" :interval="0">
      <div class="item" slot-scope="{ item }" :style="{ height: size - 10 + 'px' }">
        <div class="address">
          <span>{{ item.address }}</span>
          <div>
            <span class="index">#{{ item.index + 1 }}</span>
            <span>{{ item.status }}</span>
          </div>
        </div>
        <div class="time">
          <img src="./../assest/img/time.png" />
          <span>{{ item.time }}</span>
        </div>
        <div class="price">
          <img src="./../assest/img/price.png" />
          <span>{{ item.price }}</span>
          <span></span>
        </div>
      </div>
    </lite-virtual-list>
  </div>
</template>

<script>
let status = ['充电中', '待支付', '已完成']
let price = ['25元', '30元', '16元']
let time = ['2017年7月26日 17:04', '2019年5月23日 19:28', '2020年12月25日 10:57']
let address = ['中南物业居然之家商都路店服务点', '北四环天桥海航路店服务点', '南二环东亭路机场新天地店服务点']
let items = []
let count = 10000
for (let i = 0; i < count; i++) {
  items.push({ id: i, address: address[i % 3], status: status[i % 3], price: price[i % 3], time: time[i % 3] })
}
Object.freeze(items)
export default {
  name: 'fixed-size',
  data() {
    return { items, size: 110 }
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
  background-color: #ffffff;
  margin: 0 auto;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  padding: 15px 19px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.item > div {
  display: flex;
  white-space: nowrap;
}
.address {
  width: 100%;
  justify-content: space-between;
  color: #3d3d3d;
  font-size: 14px;
}
.address span:first-child {
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.time,
.price {
  align-items: center;
  font-size: 13px;
  color: #7c7c7c;
}
.time > img {
  padding-top: 2px;
  width: 20px;
}
.price > img {
  width: 12px;
  height: 13px;
  margin: 4px;
}
.index {
  font-weight: bold;
  margin-right: 2px;
  color: red;
}
</style>
