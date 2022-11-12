<template>
	<view class="music-head" :style="{color:color}">
		<view class="music-head-icon" v-if="icon">
			<text class="iconfont icon-fanhui" @tap="handleToBack"></text> | <text class="iconfont icon-shouyeicon" @tap="handleToHome"></text>
		</view>
		{{title}}
	</view>
</template>

<script>
	export default {
		name:"musicHead",
		data() {
			return {
				
			};
		},
		props: ['title','icon','color'],
		methods: {
			handleToBack(){
				// console.log('1');
				uni.navigateBack()
			},
			handleToHome(){
				// console.log('2');
				uni.navigateTo({
					url:'../../pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.music-head{
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: black;
		position: relative;
	}
	.music-head-icon{
		position: absolute;
		top: 26px;
		left: 8px;
		width: 90px;
		height: 30px;
		background-color: rgba(0,0,0,0.4);
		color: white;
		line-height: 30px;
		border-radius: 15px;
		display: flex;
		/* 两端对齐平均分配 */
		justify-content: space-evenly;
	}
</style>
