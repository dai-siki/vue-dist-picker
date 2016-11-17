import 'babel-polyfill';
import Vue from 'vue';
import distData from 'china-dist-data';
import myDistPicker from '../dist-picker.vue';

window.DIST_PICKER_LIST = distData; //注册一个全局变量，为了数据公用（distList可能会比较大）

new Vue({
	el: '#app',
	data: {
		distId: ''
	},
	components: {
		'dist-picker': myDistPicker
	}
});
