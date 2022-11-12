<template>
	<view class="list">
		<!-- 所以页面都能使用，样式写在全局 -->
		<view class="fixbg" :style="{'background-image' : 'url('+playlist.coverImgUrl+')'}"></view>
		<!-- 加入自定义头部 -->
		<musicHead title='歌单' :icon='true' color='white'></musicHead>
		<!-- 头部内容区域 -->
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<!-- 歌单图片 -->
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl" mode=""></image>
						<text class="iconfont icon-next">{{playlist.playCount | formatCount}}</text>
					</view>
					<!-- 歌单介绍 -->
					<view class="list-head-text">
						<view>{{playlist.name}}</view>
						<view>
							<image :src="playlist.creator.avatarUrl" mode=""></image>{{playlist.creator.nickname}}
						</view>
						<view>
							{{playlist.description}}
						</view>
					</view>
				</view>
				
				<!-- 分享按钮条件编译，差异化 -->
				<!-- #ifdef MP-WEIXIN -->
					<button open-type="share" class="list-share">
						<text class="iconfont icon-gengduo"></text>分享给微信好友
					</button>
				<!-- #endif -->
				
				<!-- 榜单歌曲列表区域 -->
				<view class="list-music">
					<!-- 歌曲列表头部 -->
					<view class="list-music-head">
						<text class="iconfont icon-play-circle-stroke"></text>
						<text>播放全部</text>
						<text>(共{{playlist.trackCount}}首)</text>
					</view>
					<!-- 歌曲内容 -->
					<view class="list-music-item" v-for="(item,index) in playlist.tracks" :key="index" @tap="handleToDetail(item.id)">
						<view class="list-music-top">{{index+1}}</view>
						<view class="list-music-song">
							<view>{{item.name}}</view>
							<view>
								<image v-if="privileges[index].flag != 0"  src="../../static/iconfont/dujia.png"></image>
								<image  v-if="privileges[index].maxbr === 999000" src="../../static/iconfont/sq.png"></image>
								{{item.ar[0].name}}
							</view>
						</view>
						<text class="iconfont icon-play-circle-stroke"></text>
					</view>
					
					<view class="list-music-item">
						<view class="list-music-top">1</view>
						<view class="list-music-song">
							<view>雨我无瓜</view>
							<view>
								<image src="../../static/iconfont/dujia.png"></image>
								<image src="../../static/iconfont/sq.png"></image>
								游乐王子 - 雨我无瓜
							</view>
						</view>
						<text class="iconfont icon-play-circle-stroke"></text>
					</view>
					
					<view class="list-music-item">
						<view class="list-music-top">1</view>
						<view class="list-music-song">
							<view>雨我无瓜</view>
							<view>
								<image src="../../static/iconfont/dujia.png"></image>
								<image src="../../static/iconfont/sq.png"></image>
								游乐王子 - 雨我无瓜
							</view>
						</view>
						<text class="iconfont icon-play-circle-stroke"></text>
					</view>
					
					<view class="list-music-item">
						<view class="list-music-top">1</view>
						<view class="list-music-song">
							<view>雨我无瓜</view>
							<view>
								<image src="../../static/iconfont/dujia.png"></image>
								<image src="../../static/iconfont/sq.png"></image>
								游乐王子 - 雨我无瓜
							</view>
						</view>
						<text class="iconfont icon-play-circle-stroke"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musicHead from '../../components/musicHead/musicHead.vue'
	import '@/common/iconfont.css'
	import {list} from '../../common/api.js'
	export default {
		data() {
			return {
				playlist:{
					coverImgUrl: '',
					creator:{
						avatarUrl : ''
					},
					trackCount : ''
				},
				privileges : [],
				isLoading : true
			}
		},
		components:{
			musicHead
		},
		//options配置选项
		onLoad(options){
			uni.showToast({
				title:'加载中',
				icon:'loading'
			})
			
			list(options.listId).then((res)=>{
				// console.log(res);
				if(res[1].data.code === 200){
					this.playlist = res[1].data.playlist
					this.privileges = res[1].data.privileges
					//在获取数据之后再store中写入
					this.$store.commit('INIT_TOPLISTIDS',res[1].data.playlist.trackIds)
					this.isLoading = false
					uni.hideLoading()
				}
			})
		},
		methods: {
			handleToDetail(songId){
				uni.navigateTo({
					url:'../detail/detail?songId=' + songId
				})
			}
		}
	}
</script>

<style scoped>
	.list-head{
		display: flex;
		margin: 30rpx;
	}
	.list-head-img{
		width: 264rpx;
		height: 264rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin-right: 42rpx;
	}
	.list-head-img image{
		width: 100%;
		height: 100%;
	}
	.list-head-img text{
		position: absolute;
		top: 8rpx;
		right: 8rpx;
		color: white;
		font-size: 26rpx;
	}
	.list-head-text{
		flex: 1;
		color: #f0f2f7;
	}
	.list-head-text view:nth-child(1){
		color: white;
		font-size: 34rpx;
	}
	.list-head-text view:nth-child(2){
		display: flex;
		margin: 20rpx 0;
		font-size: 34rpx;
		align-items: center;
	}
	.list-head-text view:nth-child(2) image {
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
		margin-right: 14rpx;
	}
	.list-head-text view:nth-child(3){
		font-size: 22rpx;
		line-height: 34rpx;
		/* 多行文本溢出隐藏，超出部分省略号代替 */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient:vertical;
		/* 设置多行的行数 */
		-webkit-line-clamp:3;
	}
	
	/* 分享按钮 */
	.list-share{
		width: 330rpx;
		height: 74rpx;
		background: rgba(0,0,0,0.4);
		margin: 0 auto;
		border-radius: 37rpx;
		color: white;
		text-align: center;
		line-height: 74rpx;
		font-size: 28rpx;
	}
	.list-share text{
		margin-right: 16rpx;
	}
	
	/* 榜单歌曲列表 */
	.list-music{
		background: white;
		border-radius: 50rpx;
		margin-top: 40rpx;
		/* 不让下面的list-music-head进行margin传递 */
		overflow: hidden;
	}
	.list-music-head{
		height: 50rpx;
		margin: 30rpx 0 70rpx 22rpx;
	}
	.list-music-head text:nth-child(1){
		height: 50rpx;
		font-size: 50rpx;
	}
	.list-music-head text:nth-child(2){
		font-size: 30rpx;
		margin: 0 10rpx 0 26rpx;
	}
	.list-music-head text:nth-child(3){
		font-size: 26rpx;
		color: #b2b2b2;
	}
	.list-music-item{
		display: flex;
		margin: 0 32rpx 66rpx 46rpx;
		align-items: center;
		color: #959595;
	}
	.list-music-top{
		width: 58rpx;
		font-size: 30rpx;
		line-height: 30rpx;
	}
	.list-music-song{
		flex: 1;
	}
	.list-music-song view:nth-child(1){
		font-size: 28rpx;
		color: black;
		/* 单行文本溢出隐藏，超出部分省略号代替 */
		width: 70vw;
		/* 不换行 */
		white-space: nowrap;
		/* 溢出隐藏 */
		overflow: hidden;
		/* 省略号代替 */
		text-overflow: ellipsis;
		
	}
	.list-music-song view:nth-child(2){
		/* display: flex; */
		font-size: 20rpx;
		align-items: center;
		/* 单行文本溢出隐藏，超出部分省略号代替 */
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list-music-song view:nth-child(2) image{
		width: 32rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}
	.list-music-item text{
		font-size: 50rpx;
		color: #c7c7c7;
	}
</style>
