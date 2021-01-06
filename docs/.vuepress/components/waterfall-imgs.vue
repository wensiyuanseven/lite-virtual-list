<template>
  <div class="waterfall-imgs">
    <lite-virtual-list ref="virtualList" type="waterfall" :marginBottom="16" :screen="[1, 1]" custom :remain="8" :virtualHieght="virtualHieght" :data="items" @scroll="lazyLoad" @loadMore="loadMore" :distance="200">
      <template slot-scope="{ item }">
        <div class="item">
          <img class="imgs" @error="imgError" :vid="item.id" @load="imgLoad(item, $event)" :_src="item.url" :style="{ opacity: item.visible ? 1 : 0, height: item.imgHeight + 'px' }" />
          <div class="info" :style="{ height: item.contentHeight + 'px', lineHeight: item.contentHeight + 'px' }">#{{ item.id }}</div>
        </div>
      </template>
      <loading slot="bottom" class="loading" color="red" v-if="isLoad"></loading>
    </lite-virtual-list>
  </div>
</template>
<script>
import Mock from 'mockjs'
import loading from './loading'
let count = 30
const random = (arr) => {
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  const num = Math.random() * (max - min) + min
  return Math.round(num)
}
export default {
  name: 'waterfall-imgs',
  data() {
    return {
      virtualHieght: '500px',
      items: [],
      isLoad: false,
      loadindex: 0,
      itemWidth: 200,
      cacheImgIndex: [],
    }
  },
  components: {
    loading,
  },
  mounted() {
    this.items = this.getImg()
    this.$on('abc', (data) => {
      console.log(data)
    })
    this.$nextTick(() => {
      this.lazyLoad()
    })
  },
  // DOM 元素还在请求网络的时候就被删除了；（比如图片在加载的过程中）ajax会出现canceled的状态
  // 做了一些操作使加载变得不必要的；（如你改变了正在加载的iframe 的src）；
  methods: {
    lazyLoad(event = {}) {
      let leftImgs = document.querySelectorAll('.left-item .imgs')
      let rightImgs = document.querySelectorAll('.right-item .imgs')
      this.replaceUrl(leftImgs, event.renderLeftScrollTop || 0)
      this.replaceUrl(rightImgs, event.renderRightScrollTop || 0)
    },
    replaceUrl(imgs, scrollTop) {
      for (let i = 0; i < imgs.length; i++) {
        // 可视区
        if (scrollTop < imgs[i].offsetTop + imgs[i].offsetHeight && imgs[i].offsetTop < scrollTop + parseInt(this.virtualHieght)) {
          imgs[i].src = imgs[i].getAttribute('_src')
        } else {
          let vid = +imgs[i].getAttribute('vid')
          // 处理重复切换url时闪烁问题
          if (!this.cacheImgIndex.includes(vid)) {
            imgs[i].src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='1' y2='0'%3E%3Cstop offset='0' stop-color='%230FF'/%3E%3Cstop offset='1' stop-color='%23CF6'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23F00'/%3E%3Cstop offset='1' stop-color='%23FC0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23FFF' fill-opacity='0' stroke-miterlimit='10'%3E%3Cg stroke='url(%23a)' stroke-width='2'%3E%3Cpath transform='translate(0 0)' d='M1409 581 1450.35 511 1490 581z'/%3E%3Ccircle stroke-width='4' transform='rotate(0 800 450)' cx='500' cy='100' r='40'/%3E%3Cpath transform='translate(0 0)' d='M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z'/%3E%3C/g%3E%3Cg stroke='url(%23b)' stroke-width='4'%3E%3Cpath transform='translate(0 0)' d='M149.8 345.2 118.4 389.8 149.8 434.4 181.2 389.8z'/%3E%3Crect stroke-width='8' transform='rotate(0 1089 759)' x='1039' y='709' width='100' height='100'/%3E%3Cpath transform='rotate(0 1400 132)' d='M1426.8 132.4 1405.7 168.8 1363.7 168.8 1342.7 132.4 1363.7 96 1405.7 96z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
          }
        }
      }
    },
    imgLoad(item, event) {
      //即使图片和占位图已经加载完毕 再次切换src时也会触发load回调
      if (event.target.src.indexOf('http') === 0) {
        if (!item.visible) {
          // 说明当前资源已经被加载过
          item.visible = true
          this.cacheImgIndex.push(item.id)
          this.$set(this.items, item.id, item)
        }
      }
    },
    imgError(event) {
      console.log(event, 'err')
    },

    loadMore() {
      if (this.isLoad) return
      this.isLoad = true
      setTimeout(() => {
        this.loadindex++
        let items = []
        for (let i = this.loadindex * count; i < this.loadindex * count + count; i++) {
          let width = random([200, 500])
          let height = random([200, 500])
          let url = Mock.Random.image(`${width}x${height}`, `${Mock.Random.color()}`)
          let imgHeight = this.setImgHeight(width, height)
          let contentHeight = random([80, 120])
          items.push({
            id: i,
            url: url,
            contentHeight: contentHeight,
            imgHeight: imgHeight,
            height: imgHeight + contentHeight,
          })
        }
        this.items = [...this.items, ...items]
        this.isLoad = false
      }, 300)
    },
    setImgHeight(originW, originH) {
      return parseInt((this.itemWidth * originH) / originW)
    },
    getImg() {
      let items = []
      for (let i = 0; i < count; i++) {
        let width = random([200, 500])
        let height = random([200, 500])
        let url = Mock.Random.image(`${width}x${height}`, `${Mock.Random.color()}`)
        let imgHeight = this.setImgHeight(width, height)
        let contentHeight = random([80, 120])
        items.push({
          id: i,
          url: url,
          visible: false,
          contentHeight: contentHeight,
          imgHeight: imgHeight,
          height: imgHeight + contentHeight,
        })
      }
      return items
    },
  },
}
</script>
<style  scoped>
.waterfall-imgs {
  background-color: #f9f9f9;
  width: 375px;
  margin: 30px 0;
  padding-top: 10px;
}
/deep/ .waterfall-list {
  padding: 6px;
}
.item {
  height: 100%;
  /* background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='1' y2='0'%3E%3Cstop offset='0' stop-color='%230FF'/%3E%3Cstop offset='1' stop-color='%23CF6'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0' stop-color='%23F00'/%3E%3Cstop offset='1' stop-color='%23FC0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23FFF' fill-opacity='0' stroke-miterlimit='10'%3E%3Cg stroke='url(%23a)' stroke-width='2'%3E%3Cpath transform='translate(0 0)' d='M1409 581 1450.35 511 1490 581z'/%3E%3Ccircle stroke-width='4' transform='rotate(0 800 450)' cx='500' cy='100' r='40'/%3E%3Cpath transform='translate(0 0)' d='M400.86 735.5h-83.73c0-23.12 18.74-41.87 41.87-41.87S400.86 712.38 400.86 735.5z'/%3E%3C/g%3E%3Cg stroke='url(%23b)' stroke-width='4'%3E%3Cpath transform='translate(0 0)' d='M149.8 345.2 118.4 389.8 149.8 434.4 181.2 389.8z'/%3E%3Crect stroke-width='8' transform='rotate(0 1089 759)' x='1039' y='709' width='100' height='100'/%3E%3Cpath transform='rotate(0 1400 132)' d='M1426.8 132.4 1405.7 168.8 1363.7 168.8 1342.7 132.4 1363.7 96 1405.7 96z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); */
  /* background-size: cover; */
  background-color: #ffffff;
  width: 95%;
  height: 100%;
  margin: 0 auto;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}
.item > img {
  transition: opacity 0.12s ease-in;
}
img {
  border-radius: 2px;
}
img:not([src]) {
  clip: rect(0, 0, 0, 0);
}
.loading {
  margin-top: 10px;
  height: 70px;
}
.info {
  text-align: center;
  font-weight: bold;
  /* color: #3d3d3d; */
  color: #7c7c7c;
  font-size: 16px;
}
</style>

