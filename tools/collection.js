/* 集合相关操作（也就是二维数组）
 ---------------------------------------------------------------*/
'use strict';

export default {
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
