import virtualList from "./virtual-list";
export default {
  install: function(Vue) {
    Vue.component(virtualList.name, virtualList);
  }
};
