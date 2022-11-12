import {baseUrl} from './config.js'

export function topList(){
	
	let listIds = ['19723756','3779629','2884035','3778678']
	
	return new Promise(function(reslove,reject){
		
			uni.request({
			url:`${baseUrl}/toplist/detail`,
			method:'GET',
			data:{},
			success:(res)=>{
				let result = res.data.list
				// console.log(res);
				result.length = 4
				
				for(var i = 0; i < listIds.length;i++){
					result[i].listId = listIds[i]
				}
				
				reslove(result)
			},
			fail:(err)=>{
				console.log(err);
			},
				complete:()=>{
				
			}
		})
	})
	
}

// list
/* 歌单详情 */
export function list(listId){
	return uni.request({
		url:`${baseUrl}/playlist/detail?id=${listId}`,
		method:'GET'
	})
}
/* 歌单详情 */


//detail
/* 歌曲详情 */
export function songDetail(songId){
	return uni.request({
		url:`${baseUrl}/song/detail?ids=${songId}`,
		method:'GET'
	})
}
/* 歌曲详情 */

//lyric
/* 获取歌词 */
export function songLyric(songId){
	return uni.request({
		url:`${baseUrl}/lyric?id=${songId}`,
		method:'GET'
	})
}
/* 获取歌词 */

//Comment
export function songComment(songId){
	return uni.request({
		url:`${baseUrl}/comment/music?id=${songId}`,
		method:'GET'
	})
}


//Url
/* 歌曲url */
export function songUrl(songId){
	return uni.request({
		url:`${baseUrl}/song/url?id=${songId}`,
		method:'GET'
	})
}
/* 歌曲url */
//simi
export function songSimi(songId){
	return uni.request({
		url:`${baseUrl}/simi/song?id=${songId}`,
		method:'GET'
	})
}


// search
// 热词
// http://localhost:3000/search/hot/detail
export function searchHot(){
	return uni.request({
		url:`${baseUrl}/search/hot/detail`,
		method:'GET'
	})
}

//搜索结果
//http://localhost:3000/search?keywords=少年
export function searchWords(word){
	return uni.request({
		url:`${baseUrl}/search?keywords=${word}`,
		method:'GET'
	})
}

//提示文字
//http://localhost:3000/search/suggest?keywords-=少年&type=mobile
export function searchSuggest(word){
	return uni.request({
		url:`${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method:'GET'
	})
}