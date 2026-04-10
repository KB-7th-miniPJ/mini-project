  <template>
  <div>
    <input ref="fileInput" type="file" accept="image/*" multiple style="display:none" @change="handleFile" />

    <button :class="['upload-btn', { highlight }]" @click="handleClick">
      <div :class="['upload-icon', { highlight }]">📷</div>
      <span :class="['upload-text', { highlight }]">사진 첨부하기</span>
      <span class="upload-sub">갤러리 또는 카메라</span>
    </button>

    <div v-for="(photo, i) in photos" :key="i" class="photo-row">
      <span>📎 {{ photo }}</span>
      <button class="remove-btn" @click="$emit('remove', i)">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({ photos: Array });
const emit = defineEmits(["add", "remove"]);

const fileInput = ref(null);
const highlight = ref(false);

const handleClick = () => {
  highlight.value = true;
  setTimeout(() => {
    highlight.value = false;
    fileInput.value?.click();
  }, 400);
};

const handleFile = (e) => {
  const files = Array.from(e.target.files).map(f => f.name);
  emit("add", files);
  e.target.value = "";
};
</script>

<style scoped>
.upload-btn {
  width: 100%; padding: 20px;
  border: 1.5px dashed #d1d5db; border-radius: 12px;
  background: #fafafa; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  transition: all 0.3s;
}
.upload-btn.highlight { border-color: #22c55e; background: rgba(34,197,94,0.08); }
.upload-icon {
  width: 40px; height: 40px; border-radius: 10px;
  background: #f3f4f6; display: flex; align-items: center;
  justify-content: center; font-size: 20px; transition: background 0.3s;
}
.upload-icon.highlight { background: #22c55e; }
.upload-text { font-size: 13px; color: #6b7280; }
.upload-text.highlight { color: #16a34a; }
.upload-sub { font-size: 11px; color: #9ca3af; }
.photo-row {
  display: flex; justify-content: space-between;
  align-items: center; padding: 6px 4px;
}
.photo-row span { font-size: 13px; color: #374151; }
.remove-btn {
  background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 16px;
}
</style>