<template>
	<view class="index">
		<!-- 头部 -->
		<musicHead title='ikun音乐' :icon="false"></musicHead>
		<!-- 可滚动区域 -->
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索框 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-search"></text>
					<input type="text" placeholder="搜索歌曲">
				</view>
				<!-- 音乐榜单列表 -->
				<view class="index-list">
					<view class="index-list-item" v-for="(item,index) in topList" :key="index" @tap="handleToList(item.listId)">
						<view class="index-list-image">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(textItem,index) in item.tracks" :key="index">{{index+1}}.{{textItem.first}} - {{textItem.second}}</view>
						</view>
					</view>
					
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css'
	import musicHead from '../../components/musicHead/musicHead.vue'
	import { topList } from '../../common/api.js'
	export default {
		data() {
			return {
				topList:[]
			}
		},
		components:{
			musicHead
		},
		
		onLoad() {
			topList().then((res)=>{
				//console.log(res);
				if(res.length){
					this.topList = res
				}
			})
		},
		methods: {
			handleToList(listId){
				uni.navigateTo({
					url:'../list/list?listId=' + listId
				})
			},
			handleToSearch(){
				uni.navigateTo({
					url:'../search/search'
				})
			}
		}
	}
</script>

<style scoped>
	.index{}
	.index-search{
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}
	.index-search text{
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.index-search input{
		font-size: 20rpx;
		/* 占据剩余空间 */
		flex: 1;
	}
	
	/* 音乐分类列表样式 */
	.index-list{
		margin: 0 30rpx;
	}
	.index-list-item{
		display: flex;
		margin-bottom: 34rpx;
	}
	.index-list-image{
		width: 212rpx;
		height: 212rpx;
		position: relative;
		border-radius: 30rpx;
		overflow: hidden;
		margin-right: 22rpx;
	}
	.index-list-image image{
		width: 100%;
		height: 100%;
	}
	.index-list-image text{
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: white;
		font-size: 20rpx;
	}
	.index-list-text{
		font-size: 24rpx;
		line-height: 66rpx;
	}
	/* 溢出隐藏 */
	.index-list-text view{
		max-width: 400rpx;
		/* 不换行 */
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
