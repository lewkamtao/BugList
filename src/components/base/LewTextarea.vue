<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps({
  modelValue: {
    // 父组件 v-model 没有指定参数名，则默认是 modelValue
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const v = ref(props.modelValue);
watch(
  () => props.modelValue,
  () => {
    v.value = props.modelValue;
  }
);
const emit = defineEmits(["update:modelValue"]);

const input = (e: any) => {
  let { value } = e.target;
  emit("update:modelValue", value);
};
</script>

<template>
  <textarea v-model="v" @input="input" :disabled="props.disabled"></textarea>
</template>

<style lang="scss" scoped>
textarea {
  width: 100%;
  height: 115px;
  border-radius: 12px;
  padding: 5px 10px;
  border: var(--border-width) solid var(--border-color);
  font-size: 14px;
  line-height: 24px;
  background: var(--background-3);
  color: var(--text-color);
  box-sizing: border-box;
  color: var(--text-color);
  resize: none;
}
textarea:focus {
  background: var(--background-2);
}
</style>
