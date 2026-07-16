<template>
  <div style="padding: 20px; font-family: Arial">
    <h1>Python 交互测试</h1>

    <button @click="callPython" style="margin-top: 15px; padding: 8px 20px">Post</button>
    <div class="res">
      <div v-for="song in result">
        <div>
          <span>歌曲名称:{{ song.name }}</span>
          <br />
          <span>歌曲封面地址:{{ song.coverImage }}</span>
          <br />
          <span>歌曲下载链接:{{ song.downloadLink }}</span>
          <br />
        </div>
        <br />
      </div>
    </div>
    <div v-show="error != ''">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Music } from './utils/interfaces'
const result = ref<Music[]>()
const error = ref('')
const loading = ref(false)

async function callPython() {
  loading.value = true
  result.value = []
  error.value = ''

  try {
    // 调用预加载暴露的 API，传递参数数组
    const response = await window.electronAPI.getMusicsFromPy('周杰伦', 3)
    if (response.success) {
      result.value = response.data
    } else {
      error.value = response.error || '未知错误'
    }
  } catch (err: any) {
    error.value = err.message || '调用失败'
  } finally {
    loading.value = false
  }
}
</script>
