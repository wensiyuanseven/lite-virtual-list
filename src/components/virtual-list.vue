<template>
  <!-- 图片怎么处理？？？ -->
  <!-- 最外层是一个容器，能滚动的盒子,【高度=可视区内容的高度=可视区的数量*每一项的高度=remain*size】 -->
  <div
    class="viewport"
    ref="viewport"
    @scroll.passive="scrollFn"
  >
    <!-- 自定义滚动条，因为可渲染的数据可能只有五六条，但是要计算总长度 【高度=总高度*每一项的高度=items.length*size-->
    <div
      class="scrollBar"
      ref="scrollBar"
    ></div>
    <!-- 真实渲染的内容即可视区，相对于视口绝对定位 ,必须一直定位在顶部，动态计算-->
    <div
      class="scroll-list"
      :style="{transform:`translate3d(0,${offset}px,0)`}"
    >
      <!-- 当前可视内容渲染的数据 -->
      <div
        v-for="item in visibleData"
        :key="item.id"
        :vid="item.id"
        ref="items"
      >
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import throttle from 'lodash/throttle'
export default {
  props: {
    items: Array, //总数据【长列表数据很多，自动渲染可视区域】
    size: Number, //当前每一项的高度
    remain: Number, //可见多少条数据
    variable: Boolean
  },
  data() {
    return {
      start: 0, //开始数据
      end: null, //结尾数据
      offset: 0
    }
  },
  computed: {
    formatData() {
      return this.items.map((item, index) => ({ ...item, index }))
    },
    // 渲染可见的数据【需要有定义开头和结尾，因为滚动的时候需要重新算出开头和结尾】
    // 渲染可见的数据
    visibleData() {
      // 把上下的可是区域扩大一倍
      let start = this.start - this.prevCount
      let end = this.end + this.nextCount
      return this.formatData.slice(start, end)
    },
    // 前面预留几个
    prevCount() {
      // 取最小值，如果前面的start是0 那么前面就没有了 比如你滑动到了第五个，那前面只有五个，就取五个，最大取八个
      return Math.min(this.start, this.remain)
    },
    // 后面预留几个
    nextCount() {
      // this.items.length - this.end 剩下的个数
      //如果剩下的个数不足八个了，就取剩下的个数
      return Math.min(this.items.length - this.end, this.remain)
    }
  },
  created() {
    this.scrollFn = throttle(this.handleScroll, 200, { leading: false })
  },
  mounted() {
    // 1.设置viewPrort的高度
    this.$refs.viewport.style.height = this.remain * this.size + 'px'
    // 2.设置滚动条高度
    this.$refs.scrollBar.style.height = this.items.length * this.size + 'px'
    // 3.计算显示范围
    this.end = this.start + this.remain
    if (this.variable) {
      // 1.先记录好，滚动的时候去渲染页面时获取真实dom的高度，来更新缓存内容
      // 2.重新计算滚动条的高度
      this.initPosition()
    }
  },
  // 页面更新
  updated() {
    //页面渲染完成后 需要根据当前展示的数据，更新缓存区的内容
    // 根据当前显示的，更新缓存中的height,bottom，top,最终更新滚动条的高度
    this.$nextTick(() => {
      let nodes = this.$refs.items //获取真实节点
      if (!(nodes && nodes.length > 0)) {
        return
      }
      //用节点更新缓存
      nodes.forEach(node => {

        // 获取节点
        let rect = node.getBoundingClientRect()
        let height = rect.height //真实的高度
        let index = +node.getAttribute('vid')
        let oldHeight = this.positions[index].height
        let val = oldHeight - height
        //计算当前的高度是否和之前有变化
        if (val) {
          // 只有第一次向下滚动的时候才会走这里，【因为滚动的时候会缓存，在向上或者向下滚动的是哦后都不会走这里了】
          // 先更新自己
          // 一个元素，他高度变了，但是它的top值不会变，bottom会变【也就是加上比较的高度，因为--得正】
          this.positions[index].bottom = this.positions[index].bottom - val
          this.positions[index].height = height
          // 如果当前元素的高度增加的话，那它底下的所有元素都会改变【这就像是链表】
          //那后面的人都要往后移动
          for (let i = index + 1; i < this.positions.length; i++) {
            // 把后面这个人的top值改成当前这个人的bottom【也就是你往前后窜了一步，那后面的人只需要站在你后面就好了】
            this.positions[i].top = this.positions[i - 1].bottom
            // 而尾部变的都是相同的值
            this.positions[i].bottom = this.positions[i].bottom - val
          }
        }
      })
      // 只要更新过会算出滚动条的高度  给滚动条设置高度=最后一个人的底部
      this.$refs.scrollBar.style.height =
        this.positions[this.positions.length - 1].bottom + 'px'
      // this.offset = this.positions[this.start - this.prevCount]? this.positions[this.start - this.prevCount].top : 0;
    })
  },
  methods: {
    //找位置，渲染，渲染完成之后拿真实的位置信息替换掉缓存的位置信息，最后再重新计算滚动条的高度
    // 缓存每一项的高度，top,bottom 这这样就知道每一项在哪了
    initPosition() {
      // 初始化默认位置
      this.positions = this.items.map((item, index) => ({
        index,
        height: this.size, //默认预留的高度
        top: index * this.size, //当前索引*高度
        bottom: (index + 1) * this.size
      }))
    },
    // 查找到当前的位置
    getStartIndex(value) {
      // 1000条数据才查十次,性能很高
      // value 是滚动的位置
      //value 查找当前滚动需要找到的值
      let positions = this.positions
      let start = 0 //开始位置
      let end = this.positions.length //结束位置
      let temp = null //定义滚动的范围 因为有可能你滚动的值是33.5  恰巧二分查找没找到，没有的话二分查找一般返回一个-1，
      //但现在不这么做，因为我们要查找的不是一个具体的值，而是一个滚动的范围，在范围内就ok了，并不需要告诉我没没找到
      while (start <= end) {
        let middleIndex = parseInt((start + end) / 2) //或者 Math.floor()
        let middleValue = this.positions[middleIndex].bottom //找到当前的中间的元素的结尾点
        if (value == middleValue) {
          //如果直接找到了，就返回当前下一个人的索引 因为已找到的是当前这个人的底部，那么下一个才是需要显示的人
          return middleIndex + 1 //为什么要返回middleIndex+1？因为假如value等于当前元素的bottom就说明滚动条已经滚动到当前元素的底部了
          //而我们要找的是开始值和结束值的范围，所以middleIndex+1就是下一个元素的索引值
        } else if (middleValue < value) {
          // 当前要查找的在右边（也就是在滚动条的右边【下边】）因为只记录滚动条的上边
          //中间位置+1
          start = middleIndex + 1
        } else if (middleValue > value) {
          //当前要查找的在左边【当前的中间值大于滚动的位置】
          //中间位置-1
          if (temp == null || temp > middleIndex) {
            temp = middleIndex //找到范围
          }
          end = middleIndex - 1
        }
      }
      return temp
    },
    //处理滚动时渲染哪些数据
    handleScroll() {
      let scrollTop = this.$refs.viewport.scrollTop //当前滚过去的高度
      // 高度不固定，说明要用二分查找找到对应的记录
      if (this.variable) {
        //现在缓存的数据就是按顺序缓存的，所以不需要先排序了
        // 算出开始的位置
        // 拿当前的索引查找
        this.start = this.getStartIndex(scrollTop)
        this.end = this.start + this.remain //找到当前渲染屏幕的结束位置
        // 设置偏移量  这里面找的都是缓存的数据 也就是当页面更新的时候，需要把缓存的数据替换成真实数据
        this.offset = this.positions[this.start - this.prevCount]
          ? this.positions[this.start - this.prevCount].top
          : 0
        // 算出结尾位置
        // 设置偏移量
      } else {
        // 应该先算出来当前滚过去几个了，当前应该从第几个显示
        // 获取当前应该从第几个开始渲染
        this.start = Math.floor(scrollTop / this.size) //滚过去了多少个,向下取整
        //当前可渲染的区域
        this.end = this.start + this.remain
        // 他们变化时 visibleData计算属性也会变化
        // 定位当前的可视区域  需要把预留的位置也减掉
        this.offset =
          scrollTop - (scrollTop % this.size) - this.prevCount * this.size
      }
    }
  }
}
</script>
<style lang="stylus">
.viewport {
  overflow-y: scroll;
  position: relative;
}

.scroll-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
</style>