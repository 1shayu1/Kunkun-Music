<template>
	<view class="detail">
		<!-- 毛玻璃背景 -->
		<view class="fixbg" :style="{'background-image' : 'url('+ songDetail.al.picUrl +')'}"></view>
		<!-- 自定义组件 -->
		<musicHead :title='songDetail.name' :icon='true' color='white'></musicHead>
		<!-- 可滚动区域 -->
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<!-- 播放区域 -->
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" mode="" :class="{'detail-play-run' : isPlayRotate}"></image>
					<text class="iconfont icon-pause-circle" :class="iconPlay"></text>
					<view></view>
				</view>
				
				<!-- 歌词区域 -->
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{ transform : 'translateY('+ -(lyricIndex-1)*82 +'rpx)' }">
						<view class="detail-lyric-item" :class="{ active : lyricIndex == index}" v-for="(item,index) in songLyric" :key="index">{{item.lyric}}</view>
					</view>
				</view>
				
				<!-- 喜欢区域 -->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.album.picUrl"></image>
						</view>
						<view class="detail-like-song">
							<view>{{item.name}}</view>
							<view>
								<image v-if="item.privilege.flag != 0" src="/static/iconfont/dujia.png"></image>
								<image v-if="item.privilege.maxbr === 999000" src="/static/iconfont/sq.png"></image>
								{{item.album.artists[0].name}} - {{item.name}}
							</view>
						</view>
						<text class="iconfont icon-play-circle-stroke"></text>
					</view>
					
					
					<!-- 精彩评论 -->
					<view class="detail-comment">
						<view class="detail-comment-head">精彩评论</view>
						<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
							<view class="detail-comment-img">
								<image :src="item.user.avatarUrl" mode=""></image>
							</view>
							<view class="detail-comment-content">
								<view class="detail-comment-title">
									<view class="detail-comment-name">
										<view>{{item.user.nickname}}</view>
										<view>{{item.time | formatTime}}</view>
									</view>
									<view class="detail-comment-like">{{item.likedCount | formatCount}} <text class="iconfont icon-zhengque-gou"></text></view>
								</view>
								<view class="detail-comment-text">{{item.content}}</view>
							</view>
						</view>
						
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musicHead from '../../components/musicHead/musicHead.vue'
	import '@/common/iconfont.css'
	import {songDetail,songSimi,songComment,songLyric,songUrl} from '../../common/api.js'
	export default {
		data() {
			return {
				songDetail : {
					al : {
						picUrl : ''
					}
				},
				songSimi : [],
				songComment : [],
				songLyric: [],
				lyricIndex : 0,
				iconPlay : 'icon-pause-circle',
				isPlayRotate : true,
				isLoading : true
			}
		},
		components:{
			musicHead
		},
		
		onLoad(options) {
			// console.log(options.songId);
			this.getMusic(options.songId)
		},
		//返回上一级或跳转别的页面，清除定时器
		onUnload() {
			this.cancleLyricIndex()
			// #ifdef H5
					this.bgAudioManager.destroy()
			// #endif
		},
		onHide() {
			this.cancleLyricIndex()
			// #ifdef H5
					this.bgAudioManager.destroy()
			// #endif
		},
		
		methods: {
			getMusic(songId){
				//提交，提交之后就可以获取到下一首歌的id
				this.$store.commit('NEXT_ID',songId)
				
				uni.showToast({
					title:'加载中',
					icon:'loading'
				})
				this.isLoading = true
				
				
				Promise.all([songDetail(songId),songSimi(songId) , songComment(songId), songLyric(songId), songUrl((songId))]).then((res)=>{
					// console.log(res);
					if(res[0][1].data.code === 200){
						this.songDetail = res[0][1].data.songs[0]
					}
					if(res[1][1].data.code === 200){
						this.songSimi = res[1][1].data.songs
					}
					if(res[2][1].data.code === 200){
						this.songComment = res[2][1].data.hotComments
					}
					if(res[3][1].data.code === 200){
						let lyric = res[3][1].data.lrc.lyric
						// console.log(lyric);
						//正则表达式
						let re = /\[([^\]]+)\]([^\[]+)/g
						var result = []
						lyric.replace(re,($0,$1,$2)=>{
							result.push({"time" : this.formatTimeToSec($1),"lyric" : $2})
						})
						// console.log(result);
						this.songLyric = result
					}
					if(res[4][1].data.code === 200){
						
						// #ifdef MP-WEIXIN
						
							this.bgAudioManager = uni.getBackgroundAudioManager()
							this.bgAudioManager.title = this.songDetail.name
							
						// #endif
						
						// #ifdef H5
							if(!this.bgAudioManager){
								this.bgAudioManager = uni.createInnerAudioContext()
							}
							
							this.bgAudioManager.autoplay = true
							// this.iconPlay = 'icon-play-circle-stroke'
							// this.isPlayRotate = false
						// #endif
						
							this.bgAudioManager.src = res[4][1].data.data[0].url || ''
							this.listLyricIndex()
						
						//事件监听
						//监听播放
						this.bgAudioManager.onPlay(()=>{
							this.iconPlay = 'icon-pause-circle',
							this.isPlayRotate = true
							this.listLyricIndex()
						})
						//监听暂停
						this.bgAudioManager.onPause(()=>{
							this.iconPlay = 'icon-play-circle-stroke'
							this.isPlayRotate = false
							this.cancleLyricIndex()
						})
						//监听歌曲播放完毕
						this.bgAudioManager.onEnded(()=>{
							this.getMusic(this.$store.state.nextId)
						})
					}
					this.isLoading = false
					uni.hideLoading()
				})
			},
			formatTimeToSec(value){
				let arr = value.split(':')
				return (Number(arr[0]*60) + Number(arr[1])).toFixed(1)
			},
			handleToPlay(){
				//如果是暂停状态，就让你播放，如果是播放状态就暂停
				if(this.bgAudioManager.paused){
					this.bgAudioManager.play()
				}else{
					this.bgAudioManager.pause()
				}
			},
			listLyricIndex(){
				clearInterval(this.timer)
				this.timer = setInterval(()=>{
					for(var i = 0; i < this.songLyric.length;i++){
						if(this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length-1].time){
							this.lyricIndex = this.songLyric.length-1
							break
						}
						
						if(this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i+1].time){
							this.lyricIndex = i
						}
					}
					// console.log(this.lyricIndex);
				},500)
			},
			//清除定时器
			cancleLyricIndex(){
				clearInterval(this.timer)
			},
			handleToSimi(songId){
				this.getMusic(songId)
			}
		}
	}
</script>

<style scoped>
	.detail-play{
		width: 580rpx;
		height: 580rpx;
		background: url(../../static/iconfont/disc.png);
		background-size: cover;
		margin: 214rpx auto 0 auto;
		position: relative;
	}
	.detail-play image {
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		margin: auto;
		/* 图片旋转 */
		animation:  10s linear move infinite;
		/* 一开始暂停的 */
		animation-play-state: paused;
	}
	.detail-play .detail-play-run{
		/* 让你触发旋转 */
		animation-play-state: running;
	}
	/* 制定关键帧 */
	@keyframes move{
		from{transform: rotate(0deg);}
		to{transform: rotate(360deg);}
	}
	.detail-play text{
		width: 100rpx;
		height: 100rpx;
		font-size: 100rpx;
		color: white;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		margin: auto;
	}
	.detail-play view{
		width: 270rpx;
		height: 365rpx;
		background: url(../../static/iconfont/needle.png);
		position: absolute;
		left: 60rpx;
		right: 0;
		top: -210rpx;
		margin: auto;
		background-size:cover ;
	}
	
	/* 歌词 */
	.detail-lyric{
		height: 246rpx;
		font-size: 32rpx;
		line-height: 82rpx;
		color: #6f6e73;
		text-align: center;
		overflow: hidden;
	}
	.detail-lyric-wrap{
		transition: .5s;
	}
	.detail-like-item{
		height: 82rpx;
	}
	.detail-lyric-wrap .active{
		color: white;
	}
	
	/* 喜欢 */
	.detail-like{
		margin: 0 30rpx;
	}
	.detail-like-head{
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}
	.detail-like-item{
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;
	}
	.detail-like-img{
		width: 82rpx;
		height: 82rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}
	.detail-like-img image{
		width: 100%;
		height: 100%;
	}
	.detail-like-song{
		flex: 1;
		color: #c6c2bf;
	}
	.detail-like-song view:nth-child(1){
		font-size: 28rpx;
		color: white;
		margin-bottom: 12rpx;
		max-width: 400rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.detail-like-song view:nth-child(2){
		font-size: 22rpx;
		max-width: 400rpx;
		margin-bottom: 12rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.detail-like-song image{
		width: 26rpx;
		height: 20rpx;
		margin-right: 10rpx;
	}
	.detail-like-item text{
		font-size: 50rpx;
		color: #c6c2bf;
	}
	
	/* 精彩评论 */
	.detail-comment{
		margin: 0 30rpx;
	}
	.detail-comment-head{
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}
	.detail-comment-item{
		display: flex;
		margin-bottom: 28rpx;
	}
	.detail-comment-img{
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 18rpx;
	}
	.detail-comment-img image{
		width: 100%;
		height: 100%;
	}
	.detail-comment-content{
		flex: 1;
		color: #cbcacf;
	}
	.detail-comment-title{
		display: flex;
		justify-content: space-between;
	}
	.detail-comment-name{}
	.detail-comment-name view:nth-child(1){
		font-size: 26rpx;
	}
	.detail-comment-name view:nth-child(2){
		font-size: 20rpx;
	}
	.detail-comment-like{
		font-size: 28rpx;
	}
	.detail-comment-text{
		font-size: 28rpx;
		line-height: 40rpx;
		color: white;
		margin-top: 20rpx;
		border-bottom: 1px #545B62 solid;
		padding-bottom: 40rpx;
	}
	
</style>
