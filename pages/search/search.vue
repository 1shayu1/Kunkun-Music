<template>
	<view class="search">
		<!-- 头部 -->
		<musicHead title='搜索' :iconblack="true"></musicHead>
		<!-- 可滚动区域 -->
		<view class="container" >
			<scroll-view scroll-y="true">
				<view class="search-search">
					<text class="iconfont icon-search"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearch(searchWord)" @input="handleToSuggest">
					<text class="iconfont icon-Xhao" v-show="searchType != 1" @tap="handleToClose"></text>
				</view>
				
				<!-- 搜索页面主要内容 -->
				<block v-if="searchType == 1">
					<!-- 历史记录 -->
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont icon-Xhao" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="index"  @tap="handleToWord(item)">{{item}}</view>
						</view>
					</view>
					<!-- 热搜榜 -->
					<view class="search-hot">
					<view class="search-hot-head">热搜榜</view>
					<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index" @tap="handleToWord(item.searchWord)">
						<view class="search-hot-top">{{index+1}}</view>
						<view class="search-hot-word">
							<view>
								{{item.searchWord}}<image :src="item.iconUrl"></image>
							</view>
							<view>{{item.content}}</view>
						</view>
						<text class="search-hot-count">{{item.score}}</text>
					</view>
				</view>
				</block>
				
				<!-- 搜索结果 -->
				
				<block v-else-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>{{item.ar[0].name}} - {{item.al.name}}</view>
							</view>
							<text class="iconfont icon-play-circle-stroke"></text>
						</view>	
					</view>
				</block>
				
				<!-- 搜索提示 -->
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索“{{searchWord}}”</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="index" @tap="handleToWord(item.keyword)">
							<text class="iconfont icon-search"></text>{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musicHead from '../../components/musicHead/musicHead.vue'
	import '@/common/iconfont.css'
	import {searchHot , searchWords , searchSuggest} from '../../common/api.js'
	export default {
		data() {
			return {
				searchHot:[],
				searchWord: '',
				searchHistory : [],
				searchType : 1,
				searchList : [],//搜索结果
				searchSuggest : []//搜索提示
			}
		},
		
		
		onLoad() {
			searchHot().then((res)=>{
				// console.log(res);
				if(res[1].data.code === 200){
					this.searchHot = res[1].data.data
				}
			})
			//获取本地存储
			uni.getStorage({
				key:'searchHistory',
				success: (res)=>{
					this.searchHistory = res.data
				}
			});
		},
		
		components: {
			musicHead
		},
		
		methods: {
			handleToWord(word){
				this.searchWord = word
				this.handleToSearch(word)
			},
			handleToSearch(word){
				//console.log(word);
				this.searchHistory.unshift(word)
				//数组去重
				this.searchHistory = [...new Set(this.searchHistory)]
				//保持历史记录最多到10个，后面替换第一个
				if(this.searchHistory.length > 7){
					this.searchHistory.length = 7
				}
				
				//设置本地存储
				uni.setStorage({
					key:'searchHistory',
					data: this.searchHistory
				})
				
				this.getSearchList(word)
			},
				//删除本地存储
				handleToClear(){
					uni.removeStorage({
						key:'searchHistory',
						success:(res)=>{
							this.searchHistory = [],
							this.searchWord = ''
						}
					});
			},
			getSearchList(word){
				searchWords(word).then((res)=>{
					console.log(res);
					if(res[1].data.code === 200){
						this.searchList = res[1].data.result.songs
						this.searchType = 2
					}
				})
			},
			handleToClose(){
				this.searchWord = ''
				this.searchType = 1
			},
			handleToDetail(songId){
				uni.navigateTo({
					url:'../detail/detail?songId=' + songId
				})
			},
			
			handleToSuggest(event){
				let value = event.detail.value
				//判断value为空，就返回搜索主页面
				if(!value){
					this.searchType = 1
					return
				}
				searchSuggest(value).then((res)=>{
					console.log(res);
					if(res[1].data.code === 200){
						this.searchSuggest = res[1].data.result.allMatch
						this.searchType = 3
					}
				})
			}
		}
	}
</script>

<style scoped>
.search-search{
		display: flex;
		align-items: center;
		height: 80rpx;
		margin: 30rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}
	.search-search text{
		margin: 0 27rpx;
		display: flex;
		
	}
	.search-search input{
		font-size: 27rpx;
		/* 占据剩余空间 */
		flex: 1;
	}
	
	/* 历史记录 */
	.search-history{
		margin: 0 30rpx 50rpx 30rpx;
		font-size: 26rpx;
	}
	.search-history-head{
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
	}
	.search-history-list{
		display: flex;
		flex-wrap: wrap;
	}
	.search-history-list view{
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background: #f7f7f7;
	}
	
	/* 热歌榜 */
	.search-hot{
		margin: 0 30rpx;
		font-size: 26rpx;
	}
	.search-hot-head{
		margin-bottom: 36rpx;
	}
	.search-hot-item{
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
	}
	.search-hot-top{
		color: #fb2222;
		width: 60rpx;
		margin-left: 8rpx;
	}
	.search-hot-word{
		flex: 1;
	}
	.search-hot-word view:nth-child(1){
		font-size: 30rpx;
		color: black;
	}
	.search-hot-word view:nth-child(2){
		font-size: 24rpx;
		color: #878787;
		width: 65vw;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.search-hot-word image{
		width: 48rpx;
		height: 26rpx;
		margin-left: 8rpx;
	}
	.search-hot-count{
		color: #878787;
	}
	
	/* 搜索结果 */
	.search-result{
		padding: 30rpx;
		border-top: 2rpx solid #e4e4e4;
	}
		
	.search-result-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 2rpx solid #e4e4e4;
		
	}
	.search-result-word{}
	
	.search-result-word view:nth-child(1){
		font-size: 28rpx;
		color: #235790;
		margin-bottom: 12rpx;
	}
	.search-result-word view:nth-child(2){
		font-size: 22rpx;
		color: #898989;
	
	}
	.search-result-item text{
		font-size: 50rpx;
		color: #898989;
	}
	
	
	/* 搜索提示 */
	.search-suggest{
		border-top: 2rpx solid #E4E4E4;
		padding: 30rpx;
		font-size: 26rpx;
	}
	.search-suggest-head{
		color: #4574a5;
		margin-bottom: 70rpx;
	}
	.search-suggest-item{
		color: #5d5d5d;
		margin-bottom: 70rpx;
	}
	.search-suggest-item text{
		margin-right: 28rpx;
		color: #bdbdbd;
		position: relative;
		top: 3rpx;
	}
</style>
