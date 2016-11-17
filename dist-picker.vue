<template>
<div class="vue-dist-picker" @mouseout="endChoice" @mouseover="startMouseOver">
	<input type="text" :name="field" :id="field" :placeholder="placeholder" :value="showName" @click="startChoice" @keypress="startChoice">
	<!--选择面板-->
	<div class="vdp-panel" v-show="distPanelIsShow">
		<h5>选择省市区</h5>
		<ul class="vdp-tags">
			<li :class="{'z-on': activatedTag==1}" @click="activeTag(1)">{{ currProv.name }}</li>
			<li :class="{'z-on': activatedTag==2}" @click="activeTag(2)" v-if="provId">{{ currCity.name }}</li>
			<li :class="{'z-on': activatedTag==3}" @click="activeTag(3)" v-if="cityId">{{ currDist.name }}</li>
		</ul>
		<div class="vdp-list">
			<ul v-if="activatedTag==1">
				<li v-for="item in provList" @click="choiceProv(item.id)" title="{{ item.name }}">{{ item.name }}</li>
			</ul>
			<ul v-if="activatedTag==2">
				<li v-for="item in cityList" @click="choiceCity(item.id)" title="{{ item.name }}">{{ item.name }}</li>
			</ul>
			<ul v-if="activatedTag==3">
				<li v-for="item in distList" @click="choiceDist(item.id)" title="{{ item.name }}">{{ item.name }}</li>
			</ul>
		</div>
	</div>
</div>

</template>

<script>
'use strict';

const collection = {
    /*
	 * 通过id获取集合条目，取得条目
	 */
	get(arr, id, field = 'id') {
		let res = null;
		if (typeof arr == 'object' && typeof arr.length != 'undefined' && arr.length > 0) {
			arr.forEach((item) => {
				if (item[field] == id) {
					res = item;
				}
			});
		}

		return res;
	}
};

export default {
	props: {
		field: {
			type: String,
			default: ''
		},
		//distId
		value: {
			default: '',
			twoWay: true
		},
		placeholder: {
			type: String,
			default: ''
		}
	},
	data() {
		let that = this,
			{
				value
			} = this,
			activatedTag = 1,
			provId = '',
			cityId = '',
			distId = '';
		if (value) {
			DIST_PICKER_LIST['-1'].forEach((item) => {
				DIST_PICKER_LIST[item.id].forEach((cityItem) => {
					if (DIST_PICKER_LIST[cityItem.id]) {
						DIST_PICKER_LIST[cityItem.id].forEach((distItem) => {
							if (distItem.id == value) {
								provId = item.id;
								cityId = cityItem.id;
								distId = distItem.id;
								activatedTag = 3;
								// 必须等到下一轮去运行时间，可恶的组件没有created函数
								setTimeout(function () {
									that.setShowName();
								}, 0);
							}
						});
					}
				});
			});
		}
		return {
			distPanelIsShow: false,
			isMouseOver: false,
			activatedTag, //1省 2市 3区
			showName: '',
			provList: DIST_PICKER_LIST['-1'],
			provId,
			cityId,
			distId
		};
	},
	computed: {
		cityList() {
			let {
				provId
			} = this;
			if (provId && typeof DIST_PICKER_LIST[provId] != 'undefined') {
				return DIST_PICKER_LIST[provId];
			} else {
				return [];
			}
		},
		distList() {
			let {
				cityId
			} = this;
			if (cityId && typeof DIST_PICKER_LIST[cityId] != 'undefined') {
				return DIST_PICKER_LIST[cityId];
			} else {
				return [];
			}
		},
		currProv() {
			let {
				provList,
				provId
			} = this;
			if (provId) {
				return collection.get(provList, provId);
			} else {
				return {
					id: '',
					name: '请选择'
				};
			}
		},
		currCity() {
			let {
				cityList,
				cityId
			} = this;
			if (cityList.length > 0 && cityId) {
				return collection.get(cityList, cityId);
			} else {
				return {
					id: '',
					name: '请选择'
				};
			}
		},
		currDist() {
			let {
				distList,
				distId
			} = this;
			if (distList.length > 0 && distId) {
				return collection.get(distList, distId);
			} else {
				return {
					id: '',
					name: '请选择'
				};
			}
		}
	},
	methods: {
		setShowName() {
			let {
				currProv,
				currCity,
				currDist
			} = this;
			if (currProv.id && currCity.id && currDist.id) {
				this.showName = currProv.name + '-' + currCity.name + '-' + currDist.name;
			} else {
				this.showName = '';
			}
		},
		activeTag(k) {
			this.activatedTag = k;
		},
		choiceProv(id) {
			this.provId = id;
			this.cityId = '';
			this.distId = '';
			this.activeTag(2);
		},
		choiceCity(id) {
			this.cityId = id;
			this.distId = '';
			this.activeTag(3);
		},
		choiceDist(id) {
			this.distId = id;
			this.value = id;
			this.setShowName();
			this.immEndChoice();
		},
		// 开始选择（显示省市区面板）
		startChoice(e) {
			if (e && e.type == 'keypress') {
				e.returnValue = false;
			}
			this.distPanelIsShow = true;
		},
		// 鼠标离开省市区选择区域时超过一定时间，关闭省市区面板
		endChoice() {
			let that = this;
			that.isMouseOver = false;
			setTimeout(function() {
				if (!that.isMouseOver) {
					that.distPanelIsShow = false;
				}
			}, 1000);
		},
		startMouseOver() {
			this.isMouseOver = true;
		},
		// 立即关闭省市区面板
		immEndChoice() {
			this.isMouseOver = true;
			this.distPanelIsShow = false;
		}
	},
	create() {
		this.setShowName();
	}
}

</script>

<style lang="sass" scoped>@import "./scss/dist-picker.scss"</style>
